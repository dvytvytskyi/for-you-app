# 📋 Що потрібно на Admin Panel Backend для CRM

## ✅ Обов'язкові Endpoints

### 1. `GET /api/v1/leads`
**Призначення:** Отримати список leads з пагінацією та фільтрами

**Query параметри:**
- `page?: number` (default: 1)
- `limit?: number` (default: 50, max: 100)
- `status?: 'NEW' | 'IN_PROGRESS' | 'CLOSED'`
- `brokerId?: string` (UUID)
- `clientId?: string` (UUID)
- `propertyId?: string` (UUID)

**Відповідь:**
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

**Авторизація:** JWT токен (Bearer token)

---

### 2. `GET /api/v1/leads/:id`
**Призначення:** Отримати деталі конкретного lead

**Відповідь:**
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

**Авторизація:** 
- ⚠️ **Обов'язкова:** JWT токен (Bearer token)
- Опціональна: AMO CRM OAuth

**Права доступу:** 
- Брокери можуть бачити тільки свої leads (`brokerId === user.id`)
- Адміни можуть бачити всі leads
- Якщо брокер намагається отримати чужій lead → 403 Forbidden

---

## 🔧 Технічні вимоги

### 1. Entity Lead
Потрібна entity з полями:
- `id` (UUID, primary key)
- `guestName` (string, nullable)
- `guestPhone` (string, nullable)
- `guestEmail` (string, nullable)
- `status` (enum: 'NEW' | 'IN_PROGRESS' | 'CLOSED')
- `price` (number, nullable)
- `amoLeadId` (number, nullable)
- `responsibleUserId` (number, nullable)
- `brokerId` (UUID, nullable)
- `clientId` (UUID, nullable)
- `propertyId` (UUID, nullable)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### 2. Route файл
**Файл:** `admin-panel-backend/src/routes/leads.routes.ts`

**Основні вимоги:**
- ⚠️ **Обов'язково:** Middleware `authenticate` для JWT авторизації
- Підтримка пагінації (page, limit)
- Підтримка фільтрів (status, brokerId, clientId, propertyId)
- Обмеження доступу для брокерів (тільки свої leads: `brokerId === user.id`)
- Трансформація даних у правильний формат
- Отримання користувача з `req.user` (додається middleware `authenticate`)

### 3. Підключення до Server
**Файл:** `admin-panel-backend/src/server.ts`

```typescript
import leadsRoutes from './routes/leads.routes';

// Після інших routes:
app.use('/api/v1/leads', leadsRoutes);
```

---

## 📝 Опціональні Endpoints

### `GET /api/v1/analytics/my-stats`
**Призначення:** Статистика CRM для поточного користувача

**Відповідь:**
```json
{
  "newLeads": 10,
  "activeDeals": 5,
  "totalAmount": 2500000
}
```

**Примітка:** Якщо endpoint не існує, мобільний додаток розрахує статистику на клієнті через `GET /api/v1/leads`

---

## ✅ Чеклист реалізації

- [ ] Створено entity `Lead` з усіма необхідними полями
- [ ] Створено файл `admin-panel-backend/src/routes/leads.routes.ts`
- [ ] Реалізовано `GET /api/v1/leads` з пагінацією та фільтрами
- [ ] Реалізовано `GET /api/v1/leads/:id` з перевіркою прав доступу
- [ ] Підключено route до `server.ts`
- [ ] Endpoint вимагає JWT авторизацію (middleware `authenticate`)
- [ ] Middleware `authenticate` правильно перевіряє JWT токен
- [ ] Користувач доступний через `req.user` після авторизації
- [ ] Брокери бачать тільки свої leads (фільтрація по `user.id`)
- [ ] Адміни бачать всі leads
- [ ] Формат відповіді відповідає вимогам
- [ ] Протестовано з мобільним додатком

---

## 🧪 Тестування

```bash
# 1. Отримати токен
TOKEN=$(curl -s -X POST https://admin.foryou-realestate.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])")

# 2. Тест: список leads
curl -X GET "https://admin.foryou-realestate.com/api/v1/leads?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# 3. Тест: конкретний lead
curl -X GET "https://admin.foryou-realestate.com/api/v1/leads/{leadId}" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📚 Повна документація

- Детальна інструкція з кодом: `ADMIN_PANEL_LEADS_ENDPOINT.md`
- Авторизація та AMO CRM: `ADMIN_PANEL_AUTHENTICATION.md`

---

## 🔐 Авторизація - Коротко

**Два рівні:**

1. **JWT (обов'язкова):**
   - Користувач входить в додаток → отримує JWT токен
   - Токен передається в header: `Authorization: Bearer <token>`
   - Backend перевіряє через middleware `authenticate`
   - Брокери бачать тільки свої leads

2. **AMO CRM OAuth (опціональна):**
   - Якщо потрібна синхронізація з AMO CRM
   - Користувач окремо авторизується в AMO CRM
   - Токени зберігаються для конкретного користувача (`user_id`)
   - Endpoint `/api/v1/leads` працює навіть без AMO CRM (повертає з локальної БД)

**Детальніше:** `ADMIN_PANEL_AUTHENTICATION.md`

---

**Останнє оновлення:** Січень 2025
