# 🔧 Виправлення помилки 500 при завантаженні Stages

## 📋 Проблема

Мобільний додаток отримує помилку **500 Internal Server Error** при спробі завантажити stages для pipeline через endpoint:

```
GET /api/amo-crm/pipelines/:id/stages
```

**Помилка в консолі:**
```
Error loading stages for pipeline 8550470: AxiosError: Request failed with status code 500
Error loading stages for pipeline 8696950: AxiosError: Request failed with status code 500
```

---

## 🎯 Endpoint: `GET /api/amo-crm/pipelines/:id/stages`

### Поточна реалізація (admin-panel-backend)

**Файл:** `admin-panel-backend/src/routes/amo-crm.routes.ts`

**Очікуваний код:**
```typescript
router.get(
  '/pipelines/:id/stages',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const pipelineId = parseInt(req.params.id);
      // ... логіка отримання stages
    } catch (error) {
      // ... обробка помилок
    }
  }
);
```

---

## 🔍 Можливі причини помилки 500

### 1. Проблема з токенами AMO CRM

**Симптоми:**
- Endpoint повертає 500
- В логах може бути помилка про невалідний токен або відсутність токенів

**Рішення:**
- Перевірити, чи є токени для користувача або глобальні токени
- Додати fallback на глобальні токени (як в `GET /api/amo-crm/status`)

### 2. Проблема з запитом до AMO CRM API

**Симптоми:**
- AMO CRM API повертає помилку
- Невалідний `pipelineId`

**Рішення:**
- Додати валідацію `pipelineId`
- Обробляти помилки від AMO CRM API
- Повертати 404, якщо pipeline не знайдено

### 3. Проблема з локальною БД

**Симптоми:**
- Помилка при запиті до БД
- Відсутність stages в БД для pipeline

**Рішення:**
- Перевірити, чи існує pipeline в БД
- Якщо stages немає в БД - синхронізувати з AMO CRM
- Обробляти помилки БД

### 4. Проблема з entity або query

**Симптоми:**
- Помилка TypeORM при запиті
- Неправильні назви колонок

**Рішення:**
- Перевірити entity `AmoCrmStage`
- Використовувати правильні назви колонок (snake_case для query builder)

---

## ✅ Правильна реалізація

### Файл: `admin-panel-backend/src/routes/amo-crm.routes.ts`

```typescript
import { Router, Request, Response } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { AppDataSource } from '../config/database';
import { AmoCrmToken } from '../entities/AmoCrmToken';
import { AmoCrmStage } from '../entities/AmoCrmStage';
import { IsNull } from 'typeorm';
import axios from 'axios';

const router = Router();

/**
 * GET /api/amo-crm/pipelines/:id/stages
 * Отримати stages конкретної воронки
 */
router.get(
  '/pipelines/:id/stages',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const pipelineId = parseInt(req.params.id);

      // Валідація pipelineId
      if (isNaN(pipelineId) || pipelineId <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pipeline ID',
        });
      }

      // Перевірка ініціалізації БД
      if (!AppDataSource.isInitialized) {
        return res.status(500).json({
          success: false,
          message: 'Database not initialized',
        });
      }

      const amoCrmTokenRepository = AppDataSource.getRepository(AmoCrmToken);
      const amoCrmStageRepository = AppDataSource.getRepository(AmoCrmStage);

      // 1. Отримати токени AMO CRM (спочатку для користувача, потім глобальні)
      let token = await amoCrmTokenRepository.findOne({
        where: { userId: user.id },
      });

      if (!token) {
        token = await amoCrmTokenRepository.findOne({
          where: { userId: IsNull() },
        });
      }

      // 2. Спробувати отримати stages з локальної БД
      let stages = await amoCrmStageRepository.find({
        where: { pipelineId },
        order: { sort: 'ASC' },
      });

      // 3. Якщо stages немає в БД і є токени - синхронізувати з AMO CRM
      if (stages.length === 0 && token && token.accessToken) {
        try {
          console.log(`🔄 Syncing stages for pipeline ${pipelineId} from AMO CRM...`);
          
          const response = await axios.get(
            `https://${token.domain}/api/v4/leads/pipelines/${pipelineId}`,
            {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            }
          );

          const pipelineData = response.data;
          if (pipelineData._embedded && pipelineData._embedded.pipelines) {
            const pipeline = pipelineData._embedded.pipelines[0];
            
            if (pipeline._embedded && pipeline._embedded.statuses) {
              // Зберегти stages в БД
              const stagesToSave = pipeline._embedded.statuses.map((status: any) => {
                return amoCrmStageRepository.create({
                  id: status.id,
                  pipelineId: pipelineId,
                  name: status.name,
                  sort: status.sort || 0,
                  isEditable: status.is_editable !== false,
                  color: status.color || null,
                  mappedStatus: null, // Можна додати мапінг пізніше
                });
              });

              await amoCrmStageRepository.save(stagesToSave);
              
              // Отримати збережені stages
              stages = await amoCrmStageRepository.find({
                where: { pipelineId },
                order: { sort: 'ASC' },
              });

              console.log(`✅ Synced ${stages.length} stages for pipeline ${pipelineId}`);
            }
          }
        } catch (syncError: any) {
          console.error(`❌ Error syncing stages for pipeline ${pipelineId}:`, syncError);
          // Продовжуємо з порожнім масивом stages
        }
      }

      // 4. Формуємо відповідь
      const responseData = stages.map((stage) => ({
        id: stage.id,
        pipelineId: stage.pipelineId,
        name: stage.name,
        sort: stage.sort,
        isEditable: stage.isEditable,
        color: stage.color || undefined,
        mappedStatus: stage.mappedStatus || null,
      }));

      return res.json({
        data: responseData,
        count: responseData.length,
      });
    } catch (error: any) {
      console.error('❌ Error in GET /api/amo-crm/pipelines/:id/stages:', error);
      console.error('📋 Error details:', {
        message: error?.message,
        stack: error?.stack,
        response: error?.response?.data,
      });

      return res.status(500).json({
        success: false,
        message: error?.message || 'Internal server error',
      });
    }
  }
);

export default router;
```

---

## 🔍 Діагностика

### 1. Перевірити логи бекенду

```bash
# Подивитися логи контейнера
docker logs <container_name> | grep "stages"
```

### 2. Перевірити токени в БД

```sql
SELECT * FROM amo_crm_tokens 
WHERE "userId" IS NULL OR "userId" = '<user_id>';
```

### 3. Перевірити stages в БД

```sql
SELECT * FROM amo_stages 
WHERE pipeline_id = 8550470;
```

### 4. Тестувати endpoint напряму

```bash
# Отримати токен
TOKEN=$(curl -s -X POST https://admin.foryou-realestate.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])")

# Тестувати endpoint
curl -X GET "https://admin.foryou-realestate.com/api/amo-crm/pipelines/8550470/stages" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -v
```

---

## ✅ Чеклист виправлення

- [ ] Перевірити, чи endpoint існує та правильно зареєстрований
- [ ] Додати валідацію `pipelineId`
- [ ] Додати перевірку ініціалізації БД
- [ ] Додати fallback на глобальні токени (якщо немає для користувача)
- [ ] Додати синхронізацію stages з AMO CRM (якщо немає в БД)
- [ ] Додати обробку помилок від AMO CRM API
- [ ] Додати детальне логування
- [ ] Перевірити entity `AmoCrmStage` та назви колонок
- [ ] Тестувати endpoint з різними pipeline ID
- [ ] Перевірити, чи повертається правильний формат відповіді

---

## 📝 Формат відповіді

**Успіх (200 OK):**
```json
{
  "data": [
    {
      "id": 456,
      "pipelineId": 8550470,
      "name": "New",
      "sort": 0,
      "isEditable": true,
      "color": "#4CAF50",
      "mappedStatus": "NEW"
    }
  ],
  "count": 1
}
```

**Помилка (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid pipeline ID"
}
```

**Помилка (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

**Останнє оновлення:** Січень 2025
