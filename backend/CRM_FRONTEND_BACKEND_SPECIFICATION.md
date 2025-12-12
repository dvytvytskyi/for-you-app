# 📱 CRM Frontend-Backend Specification

## 📋 Огляд

Цей документ описує повну специфікацію CRM функціональності на фронті (мобільний додаток) та очікування від бекенду (admin-panel-backend).

---

## 🏗️ Архітектура

### Backend URL
- **Base URL:** `https://admin.foryou-realestate.com`
- **API Base:** `https://admin.foryou-realestate.com/api/v1`
- **AMO CRM API Base:** `https://admin.foryou-realestate.com/api/amo-crm`

### Авторизація
- **Тип:** JWT (JSON Web Tokens)
- **Header:** `Authorization: Bearer <token>`
- **Токен зберігається:** `SecureStore` (Expo SecureStore)
- **Ключ:** `accessToken`

---

## 📱 Frontend Components (Мобільний додаток)

### 1. CRM Screen (`mobile/app/(tabs)/crm.tsx`)

**Призначення:** Головний екран для перегляду та управління leads.

**Функціональність:**
- Відображення списку leads
- Пошук leads по імені
- Фільтрація по статусу (NEW, IN_PROGRESS, CLOSED)
- Підключення/відключення AMO CRM
- Оновлення даних при фокусі на екран

**Стани:**
- Завантаження (`isLoading`)
- Помилка (`error`)
- Успіх (`data`)

**Залежності:**
- JWT авторизація (обов'язкова)
- AMO CRM підключення (опціональна)

---

### 2. AMO CRM Callback Screen (`mobile/app/amo-crm/callback.tsx`)

**Призначення:** Обробка OAuth callback після авторизації в AMO CRM.

**Deep Link:** `foryoure://amo-crm/callback?success=true&state=...`

**Параметри:**
- `success` (string, optional): `'true'` якщо backend вже обміняв code на токени
- `code` (string, optional): Authorization code (fallback для старих версій)
- `state` (string, optional): OAuth state параметр
- `error` (string, optional): Помилка авторизації

**Логіка:**
1. Якщо `success === 'true'` → backend вже обміняв code, просто оновлюємо кеші
2. Якщо є `code` → fallback (для старих версій backend)
3. Якщо є `error` → показуємо помилку

**Дії:**
- Інвалідує кеш `amo-crm-status`
- Інвалідує кеш `leads`
- Навігує назад на `/(tabs)/crm`

---

### 3. AMO CRM Components

#### `AmoCrmStatusBadge` (`mobile/components/amo-crm/AmoCrmStatusBadge.tsx`)

**Призначення:** Відображення статусу підключення AMO CRM.

**Props:**
```typescript
{
  connected: boolean;
  onDisconnect: () => void;
}
```

**Відображає:**
- "✓ Підключено до АМО CRM" (якщо `connected === true`)
- Кнопку "X" для відключення

#### `AmoCrmAuthScreen` (`mobile/components/amo-crm/AmoCrmAuthScreen.tsx`)

**Призначення:** Екран авторизації AMO CRM (не використовується в поточній версії).

**Примітка:** Замість цього компонента використовується банер з кнопкою "Підключити" на головному екрані CRM.

---

## 🔌 API Clients

### 1. Backend API Client (`mobile/api/backend-client.ts`)

**Base URL:** `https://admin.foryou-realestate.com/api/v1`

**Функціональність:**
- Автоматично додає JWT токен в header `Authorization: Bearer <token>`
- Логує всі запити та відповіді
- Обробляє помилки (401, 403, 500)
- Очищає токени при 401 помилці

**Interceptors:**
- **Request:** Додає токен з `SecureStore`
- **Response:** Логує помилки, обробляє 401

---

### 2. AMO CRM API Client (`mobile/api/amo-crm.ts`)

**Base URL:** `https://admin.foryou-realestate.com/api/amo-crm`

#### Методи:

##### `getConnectionStatus(): Promise<AmoCrmConnectionStatus>`
- **Endpoint:** `GET /api/amo-crm/status`
- **Headers:** `Authorization: Bearer <token>`
- **Очікувана відповідь:**
  ```typescript
  {
    success: true,
    data: {
      connected: boolean;
      hasTokens: boolean;
      domain: string;
      accountId: string;
    }
  }
  ```
- **Повертає:** `AmoCrmConnectionStatus` (тільки `data` частина)

##### `disconnect(): Promise<void>`
- **Endpoint:** `POST /api/amo-crm/disconnect`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{}` (порожній)
- **Очікувана відповідь:**
  ```json
  {
    "success": true,
    "message": "AMO CRM disconnected"
  }
  ```

##### `getPipelines(): Promise<PipelinesResponse>`
- **Endpoint:** `GET /api/amo-crm/pipelines`
- **Headers:** `Authorization: Bearer <token>`
- **Очікувана відповідь:**
  ```typescript
  {
    data: AmoPipeline[];
    count: number;
  }
  ```
- **Типи:**
  ```typescript
  interface AmoPipeline {
    id: number;
    name: string;
    sort: number;
    isMain: boolean;
    isUnsortedOn: boolean;
    stages?: AmoStage[];
  }
  ```

##### `getStages(pipelineId: number): Promise<StagesResponse>`
- **Endpoint:** `GET /api/amo-crm/pipelines/:id/stages`
- **Headers:** `Authorization: Bearer <token>`
- **Очікувана відповідь:**
  ```typescript
  {
    data: AmoStage[];
    count: number;
  }
  ```
- **Типи:**
  ```typescript
  interface AmoStage {
    id: number;
    pipelineId: number;
    name: string;
    sort: number;
    isEditable: boolean;
    color?: string;
    mappedStatus?: 'NEW' | 'IN_PROGRESS' | 'CLOSED' | null;
  }
  ```

##### `buildAmoAuthUrl(): Promise<string>`
- **Призначення:** Генерує OAuth URL для авторизації в AMO CRM
- **Параметри:**
  - `client_id`: `'2912780f-a1e4-4d5d-a069-ee01422d8bef'`
  - `state`: Base64 encoded JSON з `{ random: string, userId: string }`
  - `mode`: `'popup'`
- **Повертає:** `https://www.amocrm.ru/oauth?client_id=...&state=...&mode=popup`

**Примітка:** `exchangeCode()` метод не використовується, бо backend обмінює code в callback endpoint.

---

### 3. Leads API Client (`mobile/api/leads.ts`)

**Base URL:** `https://admin.foryou-realestate.com/api/v1`

#### Методи:

##### `getAll(filters?: LeadFilters): Promise<LeadsResponse>`
- **Endpoint:** `GET /api/v1/leads`
- **Headers:** `Authorization: Bearer <token>`
- **Query параметри:**
  ```typescript
  {
    page?: number;        // default: 1
    limit?: number;       // default: 50, max: 100
    status?: 'NEW' | 'IN_PROGRESS' | 'CLOSED';
    brokerId?: string;    // UUID
    clientId?: string;    // UUID
    propertyId?: string;  // UUID
  }
  ```
- **Очікувана відповідь:**
  ```typescript
  {
    data: Lead[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  ```
- **Типи:**
  ```typescript
  interface Lead {
    id: string;                    // UUID
    guestName?: string;
    guestPhone?: string;
    guestEmail?: string;
    status: 'NEW' | 'IN_PROGRESS' | 'CLOSED';
    price?: number;
    amoLeadId?: number;
    responsibleUserId?: number;
    createdAt: string;             // ISO 8601
    updatedAt: string;              // ISO 8601
  }
  ```
- **Важливо:**
  - Endpoint має працювати **навіть без AMO CRM токенів** (повертає leads з локальної БД)
  - Не передаються `undefined` значення в query параметрах
  - Обробляє формат `{ success: false, ... }` як помилку

##### `getById(id: string): Promise<Lead>`
- **Endpoint:** `GET /api/v1/leads/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Очікувана відповідь:**
  ```typescript
  {
    id: string;
    guestName?: string;
    guestPhone?: string;
    guestEmail?: string;
    status: 'NEW' | 'IN_PROGRESS' | 'CLOSED';
    price?: number;
    amoLeadId?: number;
    responsibleUserId?: number;
    createdAt: string;
    updatedAt: string;
  }
  ```

##### `create(data): Promise<Lead>`
- **Endpoint:** `POST /api/v1/leads`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```typescript
  {
    guestName?: string;
    guestPhone?: string;
    guestEmail?: string;
    price?: number;
    pipelineId?: number;      // ID pipeline з AMO CRM (опціонально)
    stageId?: number;          // ID stage з AMO CRM (опціонально)
    comment?: string;
  }
  ```
- **Очікувана відповідь:**
  ```typescript
  {
    id: string;
    guestName?: string;
    guestPhone?: string;
    guestEmail?: string;
    status: 'NEW' | 'IN_PROGRESS' | 'CLOSED';
    price?: number;
    amoLeadId?: number;
    responsibleUserId?: number;
    createdAt: string;
    updatedAt: string;
  }
  ```
- **Примітка:** Якщо передано `pipelineId` та `stageId`, lead має бути створено в AMO CRM з відповідною pipeline та stage

---

## 🔄 Повний Flow

### 1. Flow авторизації AMO CRM

```
1. Користувач відкриває CRM екран
   ↓
2. Перевірка статусу: GET /api/amo-crm/status
   ↓
3. Якщо connected === false:
   ↓
   Показується банер "Підключіть AMO CRM" з кнопкою
   ↓
4. Користувач натискає "Підключити"
   ↓
   Викликається buildAmoAuthUrl()
   ↓
   Відкривається браузер: https://www.amocrm.ru/oauth?...
   ↓
5. Користувач авторизується в AMO CRM
   ↓
6. AMO CRM перенаправляє на: https://admin.foryou-realestate.com/api/amo-crm/callback?code=...&state=...
   ↓
7. Backend обробляє callback:
   - Обмінює code на токени
   - Зберігає токени в БД (глобально або для користувача)
   - Показує HTML сторінку з кнопкою "Return to App"
   ↓
8. Користувач натискає "Return to App"
   ↓
   Deep link: foryoure://amo-crm/callback?success=true&state=...
   ↓
9. Мобільний додаток отримує deep link
   ↓
   Екран callback.tsx обробляє:
   - Якщо success === 'true' → інвалідує кеші
   - Навігує на /(tabs)/crm
   ↓
10. CRM екран отримує фокус
    ↓
    useFocusEffect викликає:
    - refetchAmoStatus()
    - refetchLeads()
    ↓
11. Статус оновлюється → показується "✓ Підключено до АМО CRM"
    Leads завантажуються → показується список leads
```

---

### 2. Flow завантаження leads

```
1. Користувач відкриває CRM екран
   ↓
2. Перевірка авторизації (JWT токен)
   ↓
3. Виклик: GET /api/v1/leads?limit=100&status=NEW (якщо вибрано фільтр)
   ↓
4. Backend повертає:
   {
     data: Lead[],
     total: number,
     page: number,
     limit: number,
     totalPages: number
   }
   ↓
5. Мобільний додаток відображає leads
   ↓
6. Користувач може:
   - Шукати по імені
   - Фільтрувати по статусу
   - Оновлювати (pull to refresh)
```

---

### 3. Flow відключення AMO CRM

```
1. Користувач натискає "X" на статусному баджі
   ↓
2. Підтвердження: Alert "Відключити AMO CRM?"
   ↓
3. Якщо підтверджено:
   ↓
   Викликається: POST /api/amo-crm/disconnect
   ↓
4. Backend видаляє токени з БД
   ↓
5. Мобільний додаток:
   - Інвалідує кеш amo-crm-status
   - Інвалідує кеш amo-pipelines
   - Інвалідує кеш leads
   - Викликає refetchAmoStatus()
   - Викликає refetchLeads()
   ↓
6. Статус оновлюється → показується банер "Підключіть AMO CRM"
    Leads все ще завантажуються (з локальної БД)
```

---

## 📊 Формати даних

### 1. AMO CRM Connection Status

**Очікуваний формат від бекенду:**
```json
{
  "success": true,
  "data": {
    "connected": true,
    "hasTokens": true,
    "domain": "reforyou.amocrm.ru",
    "accountId": "31920194"
  }
}
```

**Що використовує фронт:**
```typescript
interface AmoCrmConnectionStatus {
  connected: boolean;
  hasTokens: boolean;
  domain: string;
  accountId: string;
}
```

**Примітка:** Фронт використовує тільки `data` частину відповіді.

---

### 2. Leads Response

**Очікуваний формат від бекенду:**
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

**Що використовує фронт:**
```typescript
interface LeadsResponse {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Lead {
  id: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  status: 'NEW' | 'IN_PROGRESS' | 'CLOSED';
  price?: number;
  amoLeadId?: number;
  responsibleUserId?: number;
  createdAt: string;  // ISO 8601
  updatedAt: string;   // ISO 8601
}
```

**Важливо:**
- Всі поля опціональні, крім `id`, `status`, `createdAt`, `updatedAt`
- `status` має бути одним з: `'NEW'`, `'IN_PROGRESS'`, `'CLOSED'`
- Дати мають бути в форматі ISO 8601

---

### 3. Pipelines Response

**Очікуваний формат від бекенду:**
```json
{
  "data": [
    {
      "id": 123,
      "name": "Sales Pipeline",
      "sort": 0,
      "isMain": true,
      "isUnsortedOn": false,
      "stages": [
        {
          "id": 456,
          "pipelineId": 123,
          "name": "New",
          "sort": 0,
          "isEditable": true,
          "color": "#4CAF50",
          "mappedStatus": "NEW"
        }
      ]
    }
  ],
  "count": 1
}
```

**Що використовує фронт:**
```typescript
interface PipelinesResponse {
  data: AmoPipeline[];
  count: number;
}

interface AmoPipeline {
  id: number;
  name: string;
  sort: number;
  isMain: boolean;
  isUnsortedOn: boolean;
  stages?: AmoStage[];
}

interface AmoStage {
  id: number;
  pipelineId: number;
  name: string;
  sort: number;
  isEditable: boolean;
  color?: string;
  mappedStatus?: 'NEW' | 'IN_PROGRESS' | 'CLOSED' | null;
}
```

---

## 🔐 Авторизація

### JWT Авторизація (Обов'язкова)

**Всі endpoints вимагають JWT токен:**
- `GET /api/amo-crm/status`
- `POST /api/amo-crm/disconnect`
- `GET /api/amo-crm/pipelines`
- `GET /api/amo-crm/pipelines/:id/stages`
- `GET /api/v1/leads`
- `GET /api/v1/leads/:id`

**Header:**
```
Authorization: Bearer <jwt_token>
```

**Токен зберігається:**
- `SecureStore.getItemAsync('accessToken')`

**Обробка помилок:**
- `401 Unauthorized` → очищає токени, перенаправляє на логін
- `403 Forbidden` → показує помилку "Немає доступу"
- `500 Internal Server Error` → показує детальну помилку з сервера

---

### AMO CRM OAuth (Опціональна)

**Потрібна для:**
- Синхронізації leads з AMO CRM
- Отримання pipelines/stages
- Створення/оновлення leads в AMO CRM

**Не потрібна для:**
- Перегляду leads з локальної БД
- Базової роботи з CRM

---

## 🎯 Очікування від бекенду

### 1. Endpoint: `GET /api/amo-crm/status`

**Вимоги:**
- ✅ Використовує JWT авторизацію (middleware `authenticate`)
- ✅ **НЕ вимагає** `requireAdmin` (доступний для всіх авторизованих)
- ✅ Перевіряє токени для поточного користувача (`user.id`)
- ✅ **Fallback:** Якщо немає токенів для користувача, перевіряє глобальні токени (`userId IS NULL`)
- ✅ Повертає формат:
  ```json
  {
    "success": true,
    "data": {
      "connected": boolean,
      "hasTokens": boolean,
      "domain": string,
      "accountId": string
    }
  }
  ```

---

### 2. Endpoint: `GET /api/amo-crm/callback`

**Вимоги:**
- ✅ Приймає `code` та `state` з query параметрів
- ✅ **Обмінює code на токени ПЕРЕД показом HTML**
- ✅ Зберігає токени в БД (глобально або для користувача з `state`)
- ✅ Показує HTML сторінку з кнопкою "Return to App"
- ✅ Deep link: `foryoure://amo-crm/callback?success=true&state=...`
- ✅ **НЕ передає** `code` в deep link (бо вже обміняно)

**HTML сторінка:**
- Показує "✓ Authorization successful!"
- Кнопка "Return to App" видима одразу
- Використовує `window.open()` для deep link

---

### 3. Endpoint: `POST /api/amo-crm/disconnect`

**Вимоги:**
- ✅ Використовує JWT авторизацію
- ✅ Видаляє токени для поточного користувача (`user.id`)
- ✅ Повертає:
  ```json
  {
    "success": true,
    "message": "AMO CRM disconnected"
  }
  ```

---

### 4. Endpoint: `GET /api/v1/leads`

**Вимоги:**
- ✅ Використовує JWT авторизацію
- ✅ **Працює навіть без AMO CRM токенів** (повертає leads з локальної БД)
- ✅ Використовує entity `AmoCrmLead` (таблиця `amo_crm_leads`), **НЕ** `Lead` (таблиця `leads`)
- ✅ Використовує **snake_case** назви колонок в query builder:
  - `lead.amo_contact_id` (не `lead.amoContactId`)
  - `lead.status_id` (не `lead.statusId`)
  - `lead.updated_at` (не `lead.updatedAt`)
  - `lead.created_at` (не `lead.createdAt`)
- ✅ Підтримує пагінацію (`page`, `limit`)
- ✅ Підтримує фільтри (`status`, `stageId`, `brokerId`, `clientId`, `propertyId`)
  - `status`: Стандартний статус ('NEW', 'IN_PROGRESS', 'CLOSED')
  - `stageId`: ID стадії з AMO CRM (для фільтрації по конкретній стадії)
- ✅ Повертає формат:
  ```json
  {
    "data": Lead[],
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
  ```
- ✅ **НЕ повертає** формат `{ success: false, ... }` при помилці (використовує HTTP статуси)

**Важливо:**
- Endpoint має використовувати `AmoCrmLead` entity
- Всі join'и, where умови, select, orderBy мають використовувати snake_case назви колонок
- Endpoint має працювати навіть якщо в БД немає leads (повертає `{ data: [], total: 0, ... }`)

---

### 5. Endpoint: `POST /api/v1/leads`

**Вимоги:**
- ✅ Використовує JWT авторизацію
- ✅ Приймає body:
  ```json
  {
    "guestName": "string (опціонально)",
    "guestPhone": "string (опціонально)",
    "guestEmail": "string (опціонально)",
    "price": "number (опціонально)",
    "pipelineId": "number (опціонально, ID pipeline з AMO CRM)",
    "stageId": "number (опціонально, ID stage з AMO CRM)",
    "comment": "string (опціонально)"
  }
  ```
- ✅ **Валідація:** Хоча б одне з полів (`guestName`, `guestPhone`, `guestEmail`) має бути заповнене
- ✅ Якщо передано `pipelineId` та `stageId`:
  - Створює lead в AMO CRM через `amoCrmService.createLead()`
  - Використовує передану pipeline та stage
  - Зберігає `amoLeadId` в локальній БД
- ✅ Якщо AMO CRM не підключено або `pipelineId`/`stageId` не передано:
  - Створює lead тільки в локальній БД
  - Встановлює статус `NEW` за замовчуванням
- ✅ Повертає створений lead у форматі:
  ```json
  {
    "id": "uuid",
    "guestName": "string",
    "guestPhone": "string",
    "guestEmail": "string",
    "status": "NEW",
    "price": "number",
    "amoLeadId": "number (якщо створено в AMO CRM)",
    "responsibleUserId": "number",
    "createdAt": "ISO 8601",
    "updatedAt": "ISO 8601"
  }
  ```
- ✅ HTTP статуси:
  - `201 Created` - успішне створення
  - `400 Bad Request` - невалідні дані
  - `401 Unauthorized` - неавторизований користувач
  - `500 Internal Server Error` - помилка сервера

---

### 6. Endpoint: `GET /api/amo-crm/pipelines`

**Вимоги:**
- ✅ Використовує JWT авторизацію
- ✅ Отримує токени AMO CRM для поточного користувача (з fallback на глобальні)
- ✅ Повертає pipelines з stages
- ✅ Формат:
  ```json
  {
    "data": AmoPipeline[],
    "count": number
  }
  ```

---

### 7. Endpoint: `GET /api/amo-crm/pipelines/:id/stages`

**Вимоги:**
- ✅ Використовує JWT авторизацію
- ✅ Отримує токени AMO CRM для поточного користувача (з fallback на глобальні)
- ✅ Повертає stages з `mappedStatus`
- ✅ Формат:
  ```json
  {
    "data": AmoStage[],
    "count": number
  }
  ```

---

## ⚠️ Важливі моменти

### 1. Назви колонок в Query Builder

**TypeORM Query Builder використовує назви колонок БД (snake_case), не поля entity (camelCase):**

```typescript
// ❌ НЕПРАВИЛЬНО
queryBuilder.andWhere('lead.amoContactId = :contactId', { contactId });
queryBuilder.orderBy('lead.updatedAt', 'DESC');

// ✅ ПРАВИЛЬНО
queryBuilder.andWhere('lead.amo_contact_id = :contactId', { contactId });
queryBuilder.orderBy('lead.updated_at', 'DESC');
```

### 2. Entity для Leads Endpoint

**Endpoint `/api/v1/leads` має використовувати `AmoCrmLead` entity (таблиця `amo_crm_leads`), не `Lead` entity (таблиця `leads`):**

```typescript
// ❌ НЕПРАВИЛЬНО
const leadRepository = AppDataSource.getRepository(Lead);

// ✅ ПРАВИЛЬНО
const leadRepository = AppDataSource.getRepository(AmoCrmLead);
```

### 3. Fallback на глобальні токени

**Endpoint `/api/amo-crm/status` має перевіряти спочатку токени для користувача, потім глобальні:**

```typescript
// Спочатку для користувача
let token = await amoCrmTokenRepository.findOne({
  where: { userId: user.id }
});

// Якщо немає - перевіряємо глобальні
if (!token) {
  token = await amoCrmTokenRepository.findOne({
    where: { userId: IsNull() }
  });
}
```

### 4. Обробка помилок

**Backend має повертати HTTP статуси, не обгортку `{ success: false, ... }`:**

```typescript
// ❌ НЕПРАВИЛЬНО
return res.json({ success: false, message: 'Error' });

// ✅ ПРАВИЛЬНО
return res.status(500).json({ success: false, message: 'Error' });
```

**Або для успішних відповідей:**

```typescript
// ✅ ПРАВИЛЬНО (без обгортки success)
return res.json({ data: leads, total, page, limit, totalPages });

// ✅ АБО з обгорткою (якщо потрібно)
return res.json({ success: true, data: { data: leads, total, page, limit, totalPages } });
```

---

## 🧪 Тестування

### Тест 1: Перевірка статусу AMO CRM

```bash
curl -X GET "https://admin.foryou-realestate.com/api/amo-crm/status" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Очікуваний результат:**
```json
{
  "success": true,
  "data": {
    "connected": true,
    "hasTokens": true,
    "domain": "reforyou.amocrm.ru",
    "accountId": "31920194"
  }
}
```

### Тест 2: Завантаження leads

```bash
curl -X GET "https://admin.foryou-realestate.com/api/v1/leads?limit=10" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Очікуваний результат:**
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
  "total": 5,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### Тест 3: Відключення AMO CRM

```bash
curl -X POST "https://admin.foryou-realestate.com/api/amo-crm/disconnect" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Очікуваний результат:**
```json
{
  "success": true,
  "message": "AMO CRM disconnected"
}
```

---

## 📝 Чеклист для бекенду

### Endpoints

- [ ] `GET /api/amo-crm/status` - працює з fallback на глобальні токени
- [ ] `GET /api/amo-crm/callback` - обмінює code ПЕРЕД показом HTML
- [ ] `POST /api/amo-crm/disconnect` - видаляє токени для користувача
- [ ] `GET /api/v1/leads` - використовує `AmoCrmLead` entity та snake_case колонки
- [ ] `POST /api/v1/leads` - створює lead з підтримкою pipeline/stage
- [ ] `GET /api/amo-crm/pipelines` - працює з fallback на глобальні токени
- [ ] `GET /api/amo-crm/pipelines/:id/stages` - працює з fallback на глобальні токени

### Query Builder

- [ ] Всі колонки використовуються в snake_case (`amo_contact_id`, `status_id`, `updated_at`)
- [ ] Join'и використовують snake_case назви колонок
- [ ] Where умови використовують snake_case назви колонок
- [ ] Select поля використовують snake_case назви колонок
- [ ] OrderBy використовує snake_case назви колонок

### Формати відповідей

- [ ] `GET /api/amo-crm/status` повертає `{ success: true, data: {...} }`
- [ ] `GET /api/v1/leads` повертає `{ data: [...], total, page, limit, totalPages }`
- [ ] Помилки повертаються з HTTP статусами (500, 401, 403)

---

**Останнє оновлення:** Січень 2025

