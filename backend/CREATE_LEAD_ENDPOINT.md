# 📝 Endpoint: POST /api/v1/leads

## 🎯 Призначення

Створити новий lead з можливістю вибору pipeline та stage з AMO CRM.

---

## 📋 Вимоги

### 1. Endpoint
- **URL:** `POST /api/v1/leads`
- **Авторизація:** JWT токен (middleware `authenticateJWT`)
- **Content-Type:** `application/json`

### 2. Request Body

```typescript
{
  guestName?: string;        // Опціонально
  guestPhone?: string;      // Опціонально
  guestEmail?: string;      // Опціонально
  price?: number;           // Опціонально
  pipelineId?: number;      // Опціонально, ID pipeline з AMO CRM
  stageId?: number;         // Опціонально, ID stage з AMO CRM
  comment?: string;          // Опціонально
}
```

**Валідація:**
- Хоча б одне з полів (`guestName`, `guestPhone`, `guestEmail`) має бути заповнене
- `price` має бути позитивним числом (якщо передано)
- `pipelineId` та `stageId` мають бути валідними ID з AMO CRM (якщо передано)

### 3. Response

**Успіх (201 Created):**
```json
{
  "id": "uuid",
  "guestName": "John Doe",
  "guestPhone": "+1234567890",
  "guestEmail": "john@example.com",
  "status": "NEW",
  "price": 500000,
  "amoLeadId": 12345,
  "responsibleUserId": 67890,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

**Помилка (400 Bad Request):**
```json
{
  "success": false,
  "message": "Хоча б одне з полів (guestName, guestPhone, guestEmail) має бути заповнене"
}
```

**Помилка (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**Помилка (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Помилка створення lead"
}
```

---

## 🔧 Реалізація

### Файл: `admin-panel-backend/src/routes/leads.routes.ts`

```typescript
import { Router, Request, Response } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { AppDataSource } from '../config/database';
import { AmoCrmLead } from '../entities/AmoCrmLead';
import { AmoCrmContact } from '../entities/AmoCrmContact';
import { amoCrmService } from '../services/amo-crm.service';

const router = Router();

/**
 * POST /api/v1/leads
 * Створити новий lead
 */
router.post(
  '/',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { guestName, guestPhone, guestEmail, price, pipelineId, stageId, comment } = req.body;

      // Валідація: хоча б одне з полів має бути заповнене
      if (!guestName?.trim() && !guestPhone?.trim() && !guestEmail?.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Хоча б одне з полів (guestName, guestPhone, guestEmail) має бути заповнене',
        });
      }

      // Валідація price
      if (price !== undefined && (isNaN(price) || price < 0)) {
        return res.status(400).json({
          success: false,
          message: 'Price має бути позитивним числом',
        });
      }

      const amoCrmLeadRepository = AppDataSource.getRepository(AmoCrmLead);
      const amoCrmContactRepository = AppDataSource.getRepository(AmoCrmContact);

      let amoLeadId: number | undefined;
      let amoContactId: number | undefined;

      // Якщо передано pipelineId та stageId - створюємо в AMO CRM
      if (pipelineId && stageId) {
        try {
          // 1. Створюємо контакт в AMO CRM
          const contactData = {
            name: guestName || guestPhone || guestEmail || 'Новий контакт',
            email: guestEmail || undefined,
            phone: guestPhone || undefined,
          };

          amoContactId = await amoCrmService.createContact(contactData);

          // 2. Створюємо lead в AMO CRM
          const leadData = {
            name: guestName || guestPhone || guestEmail || 'Новий lead',
            price: price || 0,
            pipeline_id: pipelineId,
            status_id: stageId,
            contacts_id: [amoContactId],
          };

          amoLeadId = await amoCrmService.createLead(leadData);
        } catch (error) {
          console.error('Error creating lead in AMO CRM:', error);
          // Продовжуємо створення в локальній БД навіть якщо AMO CRM не працює
        }
      }

      // 3. Створюємо контакт в локальній БД (якщо ще не створено)
      let contact = await amoCrmContactRepository.findOne({
        where: { amo_contact_id: amoContactId },
      });

      if (!contact && amoContactId) {
        contact = amoCrmContactRepository.create({
          amo_contact_id: amoContactId,
          name: guestName || guestPhone || guestEmail || 'Новий контакт',
          email: guestEmail || undefined,
          phone: guestPhone || undefined,
        });
        await amoCrmContactRepository.save(contact);
      } else if (!contact) {
        // Створюємо контакт без AMO ID
        contact = amoCrmContactRepository.create({
          name: guestName || guestPhone || guestEmail || 'Новий контакт',
          email: guestEmail || undefined,
          phone: guestPhone || undefined,
        });
        await amoCrmContactRepository.save(contact);
        amoContactId = contact.amo_contact_id || undefined;
      }

      // 4. Створюємо lead в локальній БД
      const lead = amoCrmLeadRepository.create({
        amo_lead_id: amoLeadId,
        amo_contact_id: amoContactId || contact.amo_contact_id,
        status_id: stageId || undefined,
        price: price || undefined,
        responsible_user_id: user?.id ? parseInt(user.id) : undefined,
      });

      const savedLead = await amoCrmLeadRepository.save(lead);

      // 5. Отримуємо повний lead з контактом для відповіді
      const fullLead = await amoCrmLeadRepository
        .createQueryBuilder('lead')
        .leftJoinAndSelect('lead.contact', 'contact')
        .where('lead.id = :id', { id: savedLead.id })
        .getOne();

      // 6. Мапимо статус
      let status: 'NEW' | 'IN_PROGRESS' | 'CLOSED' = 'NEW';
      if (stageId && fullLead?.status_id) {
        // Отримуємо mappedStatus з AmoCrmStage
        const stageRepository = AppDataSource.getRepository('AmoCrmStage');
        const stage = await stageRepository.findOne({
          where: { id: stageId },
        });
        if (stage?.mappedStatus) {
          status = stage.mappedStatus;
        }
      }

      // 7. Формуємо відповідь
      const response = {
        id: fullLead?.id || savedLead.id,
        guestName: fullLead?.contact?.name || guestName || undefined,
        guestPhone: fullLead?.contact?.phone || guestPhone || undefined,
        guestEmail: fullLead?.contact?.email || guestEmail || undefined,
        status,
        price: fullLead?.price || price || undefined,
        amoLeadId: fullLead?.amo_lead_id || amoLeadId || undefined,
        responsibleUserId: fullLead?.responsible_user_id || undefined,
        createdAt: fullLead?.created_at?.toISOString() || new Date().toISOString(),
        updatedAt: fullLead?.updated_at?.toISOString() || new Date().toISOString(),
      };

      return res.status(201).json(response);
    } catch (error: any) {
      console.error('Error creating lead:', error);
      return res.status(500).json({
        success: false,
        message: error?.message || 'Помилка створення lead',
      });
    }
  }
);

export default router;
```

---

## 📝 Примітки

1. **AMO CRM інтеграція:**
   - Якщо передано `pipelineId` та `stageId`, lead створюється в AMO CRM
   - Якщо AMO CRM не підключено або помилка - lead все одно створюється в локальній БД
   - `amoLeadId` зберігається для майбутньої синхронізації

2. **Контакти:**
   - Контакт створюється в AMO CRM (якщо передано pipeline/stage)
   - Контакт також зберігається в локальній БД (`AmoCrmContact`)
   - Lead прив'язується до контакту через `amo_contact_id`

3. **Статуси:**
   - Статус мапиться через `AmoCrmStage.mappedStatus`
   - Якщо stage не має `mappedStatus`, використовується `NEW` за замовчуванням

4. **Валідація:**
   - Хоча б одне з полів (`guestName`, `guestPhone`, `guestEmail`) має бути заповнене
   - `price` має бути позитивним числом
   - `pipelineId` та `stageId` перевіряються на валідність (якщо передано)

---

## 🧪 Тестування

### Тест 1: Створити lead без AMO CRM

```bash
curl -X POST "https://admin.foryou-realestate.com/api/v1/leads" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "guestName": "John Doe",
    "guestPhone": "+1234567890",
    "guestEmail": "john@example.com",
    "price": 500000
  }'
```

### Тест 2: Створити lead з pipeline та stage

```bash
curl -X POST "https://admin.foryou-realestate.com/api/v1/leads" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "guestName": "Jane Doe",
    "guestPhone": "+1234567891",
    "guestEmail": "jane@example.com",
    "price": 750000,
    "pipelineId": 123,
    "stageId": 456,
    "comment": "Зацікавлений в нерухомості"
  }'
```

### Тест 3: Помилка валідації (всі поля порожні)

```bash
curl -X POST "https://admin.foryou-realestate.com/api/v1/leads" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 500000
  }'
```

**Очікуваний результат:** `400 Bad Request`

---

**Останнє оновлення:** Січень 2025
