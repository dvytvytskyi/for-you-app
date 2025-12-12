# 📋 Повний список: Що потрібно на Backend для CRM

## 🎯 Огляд

Цей документ містить **повний список** того, що потрібно реалізувати на admin-panel-backend для роботи сторінки CRM в мобільному додатку - від авторизації до роботи з leads.

---

## 1️⃣ АВТОРИЗАЦІЯ (JWT)

### 1.1. Endpoint: `POST /api/auth/login`
**Призначення:** Авторизація користувача (агента/брокера)

**Request:**
```json
{
  "email": "agent@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "agent@example.com",
      "role": "BROKER",
      "name": "John Doe"
    },
    "token": "jwt_token_here"
  }
}
```

**Вимоги:**
- [ ] Endpoint існує
- [ ] Перевіряє email та password
- [ ] Генерує JWT токен
- [ ] Повертає інформацію про користувача (id, email, role)
- [ ] Токен містить `userId` та `role` в payload

---

### 1.2. Middleware: `authenticate`
**Призначення:** Перевірка JWT токену для захищених endpoints

**Файл:** `admin-panel-backend/src/middleware/auth.ts`

**Вимоги:**
- [ ] Middleware існує
- [ ] Читає токен з header: `Authorization: Bearer <token>`
- [ ] Перевіряє валідність JWT токену
- [ ] Отримує користувача з бази даних
- [ ] Додає користувача до `req.user` (з полями: `id`, `email`, `role`)
- [ ] Повертає 401 якщо токен невалідний

**Приклад:**
```typescript
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findOne({ where: { id: decoded.userId } });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
```

---

## 2️⃣ AMO CRM АВТОРИЗАЦІЯ (OAuth)

### 2.1. Endpoint: `GET /api/amo-crm/status`
**Призначення:** Перевірка статусу підключення AMO CRM для поточного користувача

**Request:**
```
GET /api/amo-crm/status
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "connected": false,
    "hasTokens": false,
    "domain": "reforyou.amocrm.ru",
    "accountId": "31920194"
  }
}
```

**Вимоги:**
- [ ] Endpoint існує
- [ ] Використовує middleware `authenticate` (JWT)
- [ ] **НЕ вимагає** `requireAdmin` (доступний для всіх авторизованих)
- [ ] Перевіряє токени для **поточного користувача** (`user.id`)
- [ ] Повертає статус для конкретного користувача (не глобальний)

---

### 2.2. Endpoint: `GET /api/amo-crm/callback`
**Призначення:** OAuth callback від AMO CRM

**Request:**
```
GET /api/amo-crm/callback?code=oauth_code&state=state_value
```

**Response:**
- **ВАЖЛИВО:** Перенаправляє на deep link (не повертає JSON!)
- Redirect: `foryoure://amo-crm/callback?code=...&state=...`

**Вимоги:**
- [ ] Endpoint існує
- [ ] Приймає `code` та `state` з query параметрів
- [ ] Обмінює `code` на токени через AMO CRM API
- [ ] Зберігає токени для **поточного користувача** (як визначити користувача?)
- [ ] Перенаправляє на deep link `foryoure://amo-crm/callback?code=...`

**Примітка:** Потрібно визначити, як отримати `user_id` в callback (можливо через `state` параметр)

---

### 2.3. Endpoint: `POST /api/amo-crm/exchange-code`
**Призначення:** Обмін OAuth code на токени (викликається з мобільного додатку)

**Request:**
```json
{
  "code": "oauth_code_from_amo"
}
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "AMO CRM successfully connected"
}
```

**Вимоги:**
- [ ] Endpoint існує
- [ ] Використовує middleware `authenticate` (JWT)
- [ ] Приймає `{ code: string }` в body
- [ ] Обмінює code на токени через AMO CRM API
- [ ] Зберігає токени для **поточного користувача** (`user.id` з JWT)
- [ ] Повертає успішну відповідь

---

### 2.4. Endpoint: `POST /api/amo-crm/disconnect`
**Призначення:** Відключення AMO CRM для поточного користувача

**Request:**
```
POST /api/amo-crm/disconnect
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "AMO CRM disconnected"
}
```

**Вимоги:**
- [ ] Endpoint існує
- [ ] Використовує middleware `authenticate` (JWT)
- [ ] Видаляє токени для **поточного користувача** (`user.id`)
- [ ] Повертає успішну відповідь

---

### 2.5. Entity: `AmoCrmToken`
**Призначення:** Зберігання токенів AMO CRM для користувачів

**Файл:** `admin-panel-backend/src/entities/AmoCrmToken.ts`

**Вимоги:**
- [ ] Entity існує
- [ ] Має поле `user_id` (UUID, NOT NULL)
- [ ] Має foreign key на `users(id)`
- [ ] Має унікальний індекс на `user_id` (один токен на користувача)
- [ ] Має поля: `access_token`, `refresh_token`, `expires_at`, `domain`, `account_id`

**Приклад:**
```typescript
@Entity('amo_crm_tokens')
export class AmoCrmToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string; // ⚠️ Важливо!

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'access_token', type: 'text' })
  accessToken: string;

  @Column({ name: 'refresh_token', type: 'text' })
  refreshToken: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'domain', type: 'varchar' })
  domain: string;

  @Column({ name: 'account_id', type: 'varchar' })
  accountId: string;
}
```

---

## 3️⃣ AMO CRM PIPELINES & STAGES

### 3.1. Endpoint: `GET /api/amo-crm/pipelines`
**Призначення:** Отримати список воронок (pipelines) з AMO CRM

**Request:**
```
GET /api/amo-crm/pipelines
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": [
    {
      "id": 123,
      "name": "Sales Pipeline",
      "sort": 0,
      "isMain": true,
      "stages": []
    }
  ],
  "count": 1
}
```

**Вимоги:**
- [ ] Endpoint існує
- [ ] Використовує middleware `authenticate` (JWT)
- [ ] Отримує токени AMO CRM для поточного користувача
- [ ] Робить запит до AMO CRM API: `GET /api/v4/leads/pipelines`
- [ ] Повертає список pipelines

---

### 3.2. Endpoint: `GET /api/amo-crm/pipelines/:id/stages`
**Призначення:** Отримати stages конкретної воронки

**Request:**
```
GET /api/amo-crm/pipelines/123/stages
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": [
    {
      "id": 456,
      "pipelineId": 123,
      "name": "New",
      "sort": 0,
      "color": "#4CAF50",
      "mappedStatus": "NEW"
    }
  ],
  "count": 1
}
```

**Вимоги:**
- [ ] Endpoint існує
- [ ] Використовує middleware `authenticate` (JWT)
- [ ] Отримує токени AMO CRM для поточного користувача
- [ ] Робить запит до AMO CRM API або отримує з локальної БД
- [ ] Повертає список stages з мапінгом статусів (`mappedStatus`)

---

## 4️⃣ LEADS (Основні Endpoints)

### 4.1. Endpoint: `GET /api/v1/leads`
**Призначення:** Отримати список leads з пагінацією та фільтрами

**Request:**
```
GET /api/v1/leads?page=1&limit=10&status=NEW
Authorization: Bearer <jwt_token>
```

**Query параметри:**
- `page?: number` (default: 1)
- `limit?: number` (default: 50, max: 100)
- `status?: 'NEW' | 'IN_PROGRESS' | 'CLOSED'`
- `brokerId?: string` (UUID)
- `clientId?: string` (UUID)
- `propertyId?: string` (UUID)

**Response:**
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

**Вимоги:**
- [ ] Endpoint існує
- [ ] Використовує middleware `authenticate` (JWT)
- [ ] Отримує користувача з `req.user`
- [ ] Підтримує пагінацію (page, limit)
- [ ] Підтримує фільтри (status, brokerId, clientId, propertyId)
- [ ] **Брокери бачать тільки свої leads:** `if (user.role === 'BROKER') { queryBuilder.andWhere('lead.brokerId = :userId', { userId: user.id }); }`
- [ ] Адміни бачать всі leads
- [ ] Повертає дані у правильному форматі

---

### 4.2. Endpoint: `GET /api/v1/leads/:id`
**Призначення:** Отримати деталі конкретного lead

**Request:**
```
GET /api/v1/leads/{leadId}
Authorization: Bearer <jwt_token>
```

**Response:**
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

**Вимоги:**
- [ ] Endpoint існує
- [ ] Використовує middleware `authenticate` (JWT)
- [ ] Отримує користувача з `req.user`
- [ ] Перевіряє права доступу:
  - Брокер може бачити тільки свої leads (`lead.brokerId === user.id`)
  - Якщо брокер намагається отримати чужій lead → 403 Forbidden
  - Адміни можуть бачити всі leads
- [ ] Повертає 404 якщо lead не знайдено
- [ ] Повертає дані у правильному форматі

---

### 4.3. Entity: `Lead`
**Призначення:** Зберігання leads в базі даних

**Файл:** `admin-panel-backend/src/entities/Lead.ts`

**Вимоги:**
- [ ] Entity існує
- [ ] Має всі необхідні поля:
  - `id` (UUID, primary key)
  - `guestName` (string, nullable)
  - `guestPhone` (string, nullable)
  - `guestEmail` (string, nullable)
  - `status` (enum: 'NEW' | 'IN_PROGRESS' | 'CLOSED')
  - `price` (number, nullable)
  - `amoLeadId` (number, nullable) - ID lead в AMO CRM
  - `responsibleUserId` (number, nullable) - ID відповідального в AMO CRM
  - `brokerId` (UUID, nullable) - ID брокера
  - `clientId` (UUID, nullable) - ID клієнта
  - `propertyId` (UUID, nullable) - ID нерухомості
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)
- [ ] Має індекси на: `status`, `brokerId`, `clientId`, `propertyId`

---

## 5️⃣ РОЗШИРЕНІ ФУНКЦІЇ (Опціонально)

### 5.1. Endpoint: `GET /api/v1/analytics/my-stats`
**Призначення:** Статистика CRM для поточного користувача

**Request:**
```
GET /api/v1/analytics/my-stats
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "newLeads": 10,
  "activeDeals": 5,
  "totalAmount": 2500000
}
```

**Вимоги:**
- [ ] Endpoint опціональний
- [ ] Якщо не існує, мобільний додаток розрахує статистику на клієнті
- [ ] Використовує middleware `authenticate` (JWT)
- [ ] Розраховує статистику для поточного користувача

---

## 6️⃣ ПІДКЛЮЧЕННЯ ДО SERVER

### 6.1. Файл: `admin-panel-backend/src/server.ts`

**Вимоги:**
- [ ] Підключено routes для auth: `app.use('/api/auth', authRoutes)`
- [ ] Підключено routes для AMO CRM: `app.use('/api/amo-crm', amoCrmRoutes)`
- [ ] Підключено routes для leads: `app.use('/api/v1/leads', leadsRoutes)`
- [ ] Підключено routes для analytics (якщо є): `app.use('/api/v1/analytics', analyticsRoutes)`

**Приклад:**
```typescript
import authRoutes from './routes/auth.routes';
import amoCrmRoutes from './routes/amo-crm.routes';
import leadsRoutes from './routes/leads.routes';

// ... middleware

app.use('/api/auth', authRoutes);
app.use('/api/amo-crm', amoCrmRoutes);
app.use('/api/v1/leads', leadsRoutes);
```

---

## 7️⃣ БАЗА ДАНИХ

### 7.1. Таблиці

**Вимоги:**
- [ ] Таблиця `users` - користувачі (агенти/брокери)
- [ ] Таблиця `amo_crm_tokens` - токени AMO CRM (з `user_id`)
- [ ] Таблиця `leads` - leads
- [ ] Таблиця `amo_pipelines` (опціонально) - pipelines з AMO CRM
- [ ] Таблиця `amo_stages` (опціонально) - stages з AMO CRM

### 7.2. Міграції

**Вимоги:**
- [ ] Міграція для `amo_crm_tokens` з полем `user_id`
- [ ] Міграція для `leads` з усіма необхідними полями
- [ ] Індекси на важливі поля

---

## 8️⃣ СЕРВІСИ

### 8.1. AmoCrmService
**Файл:** `admin-panel-backend/src/services/amo-crm.service.ts`

**Вимоги:**
- [ ] Метод `getUserConnectionStatus(userId: string)` - статус для користувача
- [ ] Метод `exchangeCodeForUser(userId: string, code: string)` - обмін коду
- [ ] Метод `saveTokensForUser(userId: string, authData: AmoAuthResponse)` - збереження токенів
- [ ] Метод `disconnectUser(userId: string)` - відключення
- [ ] Метод `getAccessToken(userId: string)` - отримання токену для користувача

---

## ✅ ПОВНИЙ ЧЕКЛИСТ

### Авторизація
- [x] `POST /api/auth/login` - авторизація
- [x] Middleware `authenticateJWT` - перевірка JWT

### AMO CRM
- [x] `GET /api/amo-crm/status` - статус (для користувача)
- [x] `GET /api/amo-crm/callback` - OAuth callback
- [x] `POST /api/amo-crm/exchange-code` - обмін коду
- [x] `POST /api/amo-crm/disconnect` - відключення
- [x] `GET /api/amo-crm/pipelines` - список pipelines
- [x] `GET /api/amo-crm/pipelines/:id/stages` - список stages
- [x] Entity `AmoCrmToken` з `user_id`

### Leads
- [x] `GET /api/v1/leads` - список leads (з пагінацією та фільтрами)
- [x] `GET /api/v1/leads/:id` - деталі lead
- [x] Використовується `AmoCrmLead` entity
- [ ] Фільтрація для брокерів (тільки свої leads) - **TODO: потребує мапінгу**

### Розширені
- [x] `GET /api/v1/analytics/my-stats` - статистика

### Інфраструктура
- [x] Routes підключені до server
- [x] База даних налаштована
- [x] Міграції виконані

---

## ⚠️ TODO (Майбутні покращення)

1. **Мапінг між User та AmoCrmUser**
   - Для фільтрації по `brokerId` потрібно мапити `User.id` → `AmoCrmUser.amoUserId`
   - Для перевірки прав доступу брокерів

2. **Фільтрація leads для брокерів**
   - Зараз показуються всі leads
   - Потрібно фільтрувати по `responsibleUserId` через мапінг

**Детальніше:** `CRM_BACKEND_STATUS.md`

---

## 📚 Детальна документація

- **Leads Endpoint:** `ADMIN_PANEL_LEADS_ENDPOINT.md`
- **Авторизація:** `ADMIN_PANEL_AUTHENTICATION.md`
- **AMO CRM:** `AMO_CRM_BACKEND_CHECKLIST.md`

---

**Останнє оновлення:** Січень 2025
