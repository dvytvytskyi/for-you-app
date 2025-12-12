# Endpoint `/api/v1/leads` для Admin Panel Backend

## 📋 Огляд

Цей endpoint дозволяє мобільному додатку отримувати leads з admin-panel-backend. **Мобільний додаток використовує тільки admin-panel-backend для CRM функцій.**

## 🎯 Призначення

- **Основний endpoint** для мобільного додатку (CRM функції)
- Повертає leads з локальної бази даних admin-panel-backend
- Використовується як єдине джерело даних для CRM в мобільному додатку
- **Важливо:** Endpoint вимагає JWT авторизацію користувача (агента/брокера)

## 🔐 Авторизація

### Два рівні авторизації:

1. **JWT авторизація (обов'язкова):**
   - Користувач (агент/брокер) має бути авторизований в додатку
   - JWT токен передається в header: `Authorization: Bearer <token>`
   - Endpoint використовує middleware `authenticate` для перевірки токену
   - Брокери бачать тільки свої leads (фільтрація по `brokerId`)

2. **AMO CRM авторизація (опціональна):**
   - Якщо потрібно синхронізувати leads з AMO CRM, користувач має окремо авторизуватись в AMO CRM
   - Процес: `GET /api/amo-crm/status` → OAuth авторизація → `POST /api/amo-crm/exchange-code`
   - Токени AMO CRM зберігаються для конкретного користувача (`user_id`)
   - Endpoint `/api/v1/leads` може повертати leads з локальної БД навіть без AMO CRM авторизації

---

## 📝 Реалізація

### Файл: `admin-panel-backend/src/routes/leads.routes.ts`

```typescript
import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { AppDataSource } from '../config/database';
import { Lead } from '../entities/Lead'; // Або ваша entity для leads

const router = Router();

/**
 * GET /api/v1/leads
 * Отримати список leads з пагінацією
 * 
 * Query параметри:
 * - page?: number (default: 1)
 * - limit?: number (default: 50, max: 100)
 * - status?: 'NEW' | 'IN_PROGRESS' | 'CLOSED'
 * - brokerId?: string (UUID)
 * - clientId?: string (UUID)
 * - propertyId?: string (UUID)
 */
router.get(
  '/',
  authenticate, // ⚠️ JWT авторизація - обов'язкова!
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user; // Користувач з middleware authenticate
      // user.id - ID користувача (агента/брокера)
      // user.role - роль користувача (BROKER, ADMIN, etc.)
      
      // Параметри пагінації
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const skip = (page - 1) * limit;

      // Фільтри
      const status = req.query.status as 'NEW' | 'IN_PROGRESS' | 'CLOSED' | undefined;
      const brokerId = req.query.brokerId as string | undefined;
      const clientId = req.query.clientId as string | undefined;
      const propertyId = req.query.propertyId as string | undefined;

      // Побудова запиту
      const leadRepository = AppDataSource.getRepository(Lead);
      const queryBuilder = leadRepository.createQueryBuilder('lead');

      // Фільтри
      if (status) {
        queryBuilder.andWhere('lead.status = :status', { status });
      }
      if (brokerId) {
        queryBuilder.andWhere('lead.brokerId = :brokerId', { brokerId });
      }
      if (clientId) {
        queryBuilder.andWhere('lead.clientId = :clientId', { clientId });
      }
      if (propertyId) {
        queryBuilder.andWhere('lead.propertyId = :propertyId', { propertyId });
      }

      // Якщо користувач - брокер, показуємо тільки його leads
      if (user.role === 'BROKER') {
        queryBuilder.andWhere('lead.brokerId = :userId', { userId: user.id });
      }

      // Підрахунок загальної кількості
      const total = await queryBuilder.getCount();

      // Отримання даних з пагінацією
      const leads = await queryBuilder
        .orderBy('lead.createdAt', 'DESC')
        .skip(skip)
        .take(limit)
        .getMany();

      // Трансформація даних для сумісності з main backend форматом
      const transformedLeads = leads.map((lead) => ({
        id: lead.id,
        guestName: lead.guestName || null,
        guestPhone: lead.guestPhone || null,
        guestEmail: lead.guestEmail || null,
        status: lead.status,
        price: lead.price || null,
        amoLeadId: lead.amoLeadId || null,
        responsibleUserId: lead.responsibleUserId || null,
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
      }));

      // Відповідь у форматі main backend
      return res.json({
        data: transformedLeads,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch leads',
        error: error.message,
      });
    }
  }
);

/**
 * GET /api/v1/leads/:id
 * Отримати конкретний lead
 */
router.get(
  '/:id',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const leadId = req.params.id;

      const leadRepository = AppDataSource.getRepository(Lead);
      const lead = await leadRepository.findOne({
        where: { id: leadId },
        relations: ['property', 'client', 'broker'],
      });

      if (!lead) {
        return res.status(404).json({
          success: false,
          message: 'Lead not found',
        });
      }

      // Перевірка доступу (брокер може бачити тільки свої leads)
      if (user.role === 'BROKER' && lead.brokerId !== user.id) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only view your own leads',
        });
      }

      // Трансформація даних
      const transformedLead = {
        id: lead.id,
        guestName: lead.guestName || null,
        guestPhone: lead.guestPhone || null,
        guestEmail: lead.guestEmail || null,
        status: lead.status,
        price: lead.price || null,
        amoLeadId: lead.amoLeadId || null,
        responsibleUserId: lead.responsibleUserId || null,
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
        // Додаткові поля, якщо потрібно
        property: lead.property ? {
          id: lead.property.id,
          name: lead.property.name,
        } : null,
      };

      return res.json(transformedLead);
    } catch (error: any) {
      console.error('Error fetching lead:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch lead',
        error: error.message,
      });
    }
  }
);

export default router;
```

---

## 🔧 Підключення до Server

### Файл: `admin-panel-backend/src/server.ts`

Додайте імпорт та підключення routes:

```typescript
import leadsRoutes from './routes/leads.routes';

// ... інші імпорти

// Після інших routes додайте:
app.use('/api/v1/leads', leadsRoutes);
```

**Повний приклад:**

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';

// Import routes
import authRoutes from './routes/auth.routes';
import propertiesRoutes from './routes/properties.routes';
import leadsRoutes from './routes/leads.routes'; // <-- Додати
// ... інші routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/v1/leads', leadsRoutes); // <-- Додати
// ... інші routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📋 Leads endpoint: http://localhost:${PORT}/api/v1/leads`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  });
```

---

## 🧪 Тестування

### Тест 1: Отримати список leads

```bash
# Отримати токен
TOKEN=$(curl -s -X POST https://admin.foryou-realestate.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])")

# Отримати leads
curl -X GET "https://admin.foryou-realestate.com/api/v1/leads?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Очікувана відповідь:**

```json
{
  "data": [
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
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

### Тест 2: Отримати конкретний lead

```bash
curl -X GET "https://admin.foryou-realestate.com/api/v1/leads/{leadId}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Тест 3: Фільтрація по статусу

```bash
curl -X GET "https://admin.foryou-realestate.com/api/v1/leads?status=NEW&limit=20" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

## ✅ Перевірка інтеграції

### Мобільний додаток

Мобільний додаток автоматично використовує цей endpoint як fallback, якщо main backend недоступний:

**Файл:** `mobile/api/leads.ts`

```typescript
async getAll(filters?: LeadFilters): Promise<LeadsResponse> {
  try {
    // Спочатку пробуємо main backend
    const response = await mainBackendClient.get<LeadsResponse>('/leads', {
      params: filters,
    });
    return response.data;
  } catch (error: any) {
    // Якщо main backend недоступний, пробуємо admin-panel-backend
    if (error?.response?.status === 404 || error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      console.log('⚠️ Main backend not available, trying admin-panel-backend...');
      const adminResponse = await backendApiClient.get<LeadsResponse>('/leads', {
        params: filters,
      });
      return adminResponse.data;
    }
    throw error;
  }
}
```

---

## 📋 Чеклист реалізації

- [ ] Створено файл `admin-panel-backend/src/routes/leads.routes.ts`
- [ ] Додано route `/api/v1/leads` в `server.ts`
- [ ] Endpoint підтримує пагінацію (page, limit)
- [ ] Endpoint підтримує фільтрацію (status, brokerId, clientId, propertyId)
- [ ] Endpoint вимагає JWT авторизацію
- [ ] Формат відповіді сумісний з main backend
- [ ] Протестовано з мобільним додатком
- [ ] Додано обробку помилок

---

## ⚠️ Важливі примітки

1. **Формат даних:** Endpoint повинен повертати дані у тому ж форматі, що й main backend для сумісності
2. **Авторизація:** Endpoint вимагає JWT токен (через middleware `authenticate`)
3. **Права доступу:** Брокери можуть бачити тільки свої leads
4. **Пагінація:** Максимальний `limit` - 100 записів

---

**Останнє оновлення:** Січень 2025
