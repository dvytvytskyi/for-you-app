# Статус інтеграції мобільного додатка з бекендом

## ✅ Підключені модулі

### 1. Авторизація (`auth.ts`)
- ✅ `POST /api/auth/login` - Вхід
- ✅ `POST /api/auth/register` - Реєстрація
- ✅ `GET /api/auth/me` - Отримати поточного користувача
- ✅ `PATCH /api/auth/profile` - Оновити профіль

**Файл:** `mobile/api/auth.ts`

---

### 2. Нерухомість (`properties.ts`)
- ✅ `GET /api/properties` - Список нерухомості (з фільтрами)
- ✅ `GET /api/properties/:id` - Деталі нерухомості
- ✅ `GET /api/properties/search` - Пошук
- ✅ `GET /api/properties/filters` - Фільтри та опції

**Файл:** `mobile/api/properties.ts`

---

### 3. Улюблені (`favorites.ts`)
- ✅ `GET /api/v1/favorites` - Список улюблених
- ✅ `GET /api/v1/favorites/ids` - Тільки ID
- ✅ `POST /api/v1/favorites/:propertyId` - Додати в улюблені
- ✅ `DELETE /api/v1/favorites/:propertyId` - Видалити з улюблених

**Файл:** `mobile/api/favorites.ts`

---

### 4. Девелопери (`developers.ts`)
- ✅ `GET /api/developers` - Список девелоперів
- ✅ `GET /api/developers/:id` - Деталі девелопера

**Файл:** `mobile/api/developers.ts`

---

### 5. Курси (`courses.ts`)
- ✅ `GET /api/courses` - Список курсів
- ✅ `GET /api/courses/:id` - Деталі курсу

**Файл:** `mobile/api/courses.ts`

---

### 6. Новини (`news.ts`)
- ✅ `GET /api/news` - Список новин
- ✅ `GET /api/news/:id` - Деталі новини

**Файл:** `mobile/api/news.ts`

---

### 7. Нотифікації (`notifications.ts`)
- ✅ `POST /api/v1/notifications/devices` - Реєстрація пристрою
- ✅ `DELETE /api/v1/notifications/devices/:fcmToken` - Видалити пристрій
- ✅ `GET /api/v1/notifications/devices` - Список пристроїв
- ✅ `GET /api/v1/notifications/settings` - Налаштування
- ✅ `PUT /api/v1/notifications/settings` - Оновити налаштування
- ✅ `GET /api/v1/notifications` - Історія сповіщень
- ✅ `GET /api/v1/notifications/unread-count` - Кількість непрочитаних
- ✅ `PUT /api/v1/notifications/:id/read` - Позначити як прочитане
- ✅ `PUT /api/v1/notifications/read-all` - Позначити всі як прочитані

**Файл:** `mobile/api/notifications.ts`

---

### 8. Leads (`leads.ts`) - ⚠️ ЧАСТКОВО
- ✅ `GET /api/v1/leads` - Список leads (з фільтрами)
- ✅ `GET /api/v1/leads/:id` - Деталі lead
- ❌ `POST /api/v1/leads` - Створити lead - **НЕ РЕАЛІЗОВАНО**
- ❌ `PUT /api/v1/leads/:id` - Оновити lead - **НЕ РЕАЛІЗОВАНО**
- ❌ `POST /api/v1/leads/:id/assign` - Призначити брокера - **НЕ РЕАЛІЗОВАНО**
- ❌ `PUT /api/v1/leads/:id/status` - Змінити статус - **НЕ РЕАЛІЗОВАНО**

**Файл:** `mobile/api/leads.ts`

**Backend endpoints:**
- `POST /api/v1/leads` - Створити lead
- `PUT /api/v1/leads/:id` - Оновити lead
- `POST /api/v1/leads/:id/assign` - Призначити брокера (BROKER, ADMIN)
- `PUT /api/v1/leads/:id/status` - Змінити статус (BROKER, ADMIN)

---

### 9. AMO CRM (`amo-crm.ts`)
- ✅ `GET /api/v1/amo-crm/pipelines` - Список pipeline
- ✅ `GET /api/v1/amo-crm/stages` - Список stages
- ✅ `GET /api/v1/amo-crm/users` - Список користувачів

**Файл:** `mobile/api/amo-crm.ts`

---

## ❌ НЕ ПІДКЛЮЧЕНІ модулі

### 1. Документи (`documents`) - 🔴 ВИСОКИЙ ПРІОРИТЕТ

**Backend endpoints:**
- `POST /api/v1/documents/upload` - Завантажити документ (BROKER, ADMIN)
- `GET /api/v1/documents/entity/:entityType/:entityId` - Документи для сутності
- `GET /api/v1/documents/:id` - Отримати документ
- `PATCH /api/v1/documents/:id` - Оновити метадані
- `DELETE /api/v1/documents/:id` - Видалити документ
- `POST /api/v1/documents/:id/verify` - Верифікувати (ADMIN)
- `GET /api/v1/documents` - Всі документи з фільтрами (ADMIN)

**Типи документів:**
- `PASSPORT` - Паспорт
- `VISA` - Віза
- `CONTRACT` - Договір
- `INVOICE` - Рахунок
- `OTHER` - Інше

**Категорії:**
- `USER` - Документи користувача
- `PROPERTY` - Документи нерухомості
- `LEAD` - Документи заявки

**Що потрібно:**
1. Створити `mobile/api/documents.ts`
2. Додати типи для документів
3. Реалізувати завантаження файлів (multipart/form-data)
4. Додати UI для перегляду та завантаження документів

---

### 2. Broker Clients (CRM) - 🔴 ВИСОКИЙ ПРІОРИТЕТ

**Backend endpoints:**
- `POST /api/v1/broker-clients` - Додати клієнта (BROKER, ADMIN)
- `GET /api/v1/broker-clients` - Список клієнтів (BROKER: свої, ADMIN: всі)
- `GET /api/v1/broker-clients/:id` - Деталі клієнта
- `PUT /api/v1/broker-clients/:id` - Оновити клієнта
- `DELETE /api/v1/broker-clients/:id` - Видалити клієнта

**Що потрібно:**
1. Створити `mobile/api/broker-clients.ts`
2. Додати типи для клієнтів
3. Реалізувати CRUD операції
4. Додати UI для управління клієнтами (CRM)

---

### 3. Analytics - 🟡 НИЗЬКИЙ ПРІОРИТЕТ (тільки для ADMIN/BROKER)

**Backend endpoints:**
- `GET /api/v1/analytics/dashboard` - Загальна статистика (ADMIN)
- `GET /api/v1/analytics/period` - Статистика за період (ADMIN)
- `GET /api/v1/analytics/broker/:brokerId` - Статистика брокера

**Що потрібно:**
1. Створити `mobile/api/analytics.ts`
2. Додати типи для статистики
3. Реалізувати отримання статистики
4. Додати UI для відображення статистики (dashboard)

**Примітка:** Це потрібно тільки для брокерів та адмінів, не для звичайних користувачів.

---

### 4. Activity Logs - 🟡 НИЗЬКИЙ ПРІОРИТЕТ (тільки для ADMIN)

**Backend endpoints:**
- `GET /api/v1/admin/activity-logs` - Логи активності (ADMIN)
- `GET /api/v1/admin/activity-logs/stats` - Статистика логів (ADMIN)

**Примітка:** Це потрібно тільки для адміністраторів, не для мобільного додатка користувачів.

---

### 5. Data Sync - 🟡 НИЗЬКИЙ ПРІОРИТЕТ (тільки для ADMIN)

**Backend endpoints:**
- `POST /api/v1/admin/sync/properties` - Синхронізація properties (ADMIN)
- `GET /api/v1/admin/sync/logs` - Історія синхронізацій (ADMIN)
- `GET /api/v1/admin/sync/stats` - Статистика синхронізацій (ADMIN)

**Примітка:** Це потрібно тільки для адміністраторів, не для мобільного додатка користувачів.

---

## 📋 Пріоритети інтеграції

### 🔴 ВИСОКИЙ ПРІОРИТЕТ

1. **Documents API** (`documents.ts`)
   - Завантаження документів
   - Перегляд документів
   - Управління документами
   - **Користь:** Користувачі можуть завантажувати документи для верифікації, договори тощо

2. **Broker Clients API** (`broker-clients.ts`)
   - CRUD для клієнтів
   - Управління клієнтами в CRM
   - **Користь:** Брокери можуть керувати своїми клієнтами

3. **Leads API - повна інтеграція**
   - Створення leads
   - Оновлення leads
   - Призначення брокерів
   - Зміна статусів
   - **Користь:** Повний функціонал CRM для брокерів

---

### 🟡 СЕРЕДНІЙ ПРІОРИТЕТ

4. **Analytics API** (`analytics.ts`)
   - Статистика для брокерів
   - Dashboard з метриками
   - **Користь:** Брокери бачать свою статистику

---

### 🟢 НИЗЬКИЙ ПРІОРИТЕТ

5. **Activity Logs** - тільки для адмін-панелі
6. **Data Sync** - тільки для адмін-панелі

---

## 📝 План інтеграції

### Крок 1: Documents API

**Створити файл:** `mobile/api/documents.ts`

```typescript
import { backendApiClient } from './backend-client';
import * as DocumentPicker from 'expo-document-picker';

export enum DocumentType {
  PASSPORT = 'PASSPORT',
  VISA = 'VISA',
  CONTRACT = 'CONTRACT',
  INVOICE = 'INVOICE',
  OTHER = 'OTHER',
}

export enum DocumentCategory {
  USER = 'USER',
  PROPERTY = 'PROPERTY',
  LEAD = 'LEAD',
}

export interface Document {
  id: string;
  type: DocumentType;
  entityType: DocumentCategory;
  entityId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  description?: string;
  isPublic: boolean;
  isVerified: boolean;
  uploadedBy: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const documentsApi = {
  // Завантажити документ
  async upload(file: DocumentPicker.DocumentPickerResult, dto: {
    type: DocumentType;
    entityType: DocumentCategory;
    entityId: string;
    description?: string;
    isPublic?: boolean;
  }): Promise<Document> {
    const formData = new FormData();
    // ... реалізація
  },

  // Отримати документи для сутності
  async getByEntity(entityType: DocumentCategory, entityId: string): Promise<Document[]> {
    const response = await backendApiClient.get(`/documents/entity/${entityType}/${entityId}`);
    return response.data;
  },

  // Отримати документ
  async getById(id: string): Promise<Document> {
    const response = await backendApiClient.get(`/documents/${id}`);
    return response.data;
  },

  // Оновити документ
  async update(id: string, dto: { description?: string }): Promise<Document> {
    const response = await backendApiClient.patch(`/documents/${id}`, dto);
    return response.data;
  },

  // Видалити документ
  async delete(id: string): Promise<void> {
    await backendApiClient.delete(`/documents/${id}`);
  },
};
```

**Залежності:**
```bash
npx expo install expo-document-picker
```

---

### Крок 2: Broker Clients API

**Створити файл:** `mobile/api/broker-clients.ts`

```typescript
import { backendApiClient } from './backend-client';

export interface BrokerClient {
  id: string;
  brokerId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrokerClientDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  notes?: string;
}

export const brokerClientsApi = {
  // Створити клієнта
  async create(dto: CreateBrokerClientDto): Promise<BrokerClient> {
    const response = await backendApiClient.post('/broker-clients', dto);
    return response.data;
  },

  // Отримати список клієнтів
  async getAll(): Promise<BrokerClient[]> {
    const response = await backendApiClient.get('/broker-clients');
    return response.data;
  },

  // Отримати клієнта
  async getById(id: string): Promise<BrokerClient> {
    const response = await backendApiClient.get(`/broker-clients/${id}`);
    return response.data;
  },

  // Оновити клієнта
  async update(id: string, dto: CreateBrokerClientDto): Promise<BrokerClient> {
    const response = await backendApiClient.put(`/broker-clients/${id}`, dto);
    return response.data;
  },

  // Видалити клієнта
  async delete(id: string): Promise<void> {
    await backendApiClient.delete(`/broker-clients/${id}`);
  },
};
```

---

### Крок 3: Повна інтеграція Leads API

**Оновити файл:** `mobile/api/leads.ts`

```typescript
export const leadsApi = {
  // ... існуючі методи

  // Створити lead
  async create(dto: {
    guestName?: string;
    guestPhone?: string;
    guestEmail?: string;
    propertyId?: string;
    price?: number;
  }): Promise<Lead> {
    const response = await backendApiClient.post('/leads', dto);
    return response.data;
  },

  // Оновити lead
  async update(id: string, dto: {
    guestName?: string;
    guestPhone?: string;
    guestEmail?: string;
    price?: number;
  }): Promise<Lead> {
    const response = await backendApiClient.put(`/leads/${id}`, dto);
    return response.data;
  },

  // Призначити брокера
  async assign(id: string, brokerId: string): Promise<Lead> {
    const response = await backendApiClient.post(`/leads/${id}/assign`, { brokerId });
    return response.data;
  },

  // Змінити статус
  async updateStatus(id: string, status: 'NEW' | 'IN_PROGRESS' | 'CLOSED'): Promise<Lead> {
    const response = await backendApiClient.put(`/leads/${id}/status`, { status });
    return response.data;
  },
};
```

---

## 🔗 Корисні посилання

- [Backend Swagger](https://admin.foryou-realestate.com/api/docs)
- [Expo Document Picker](https://docs.expo.dev/versions/latest/sdk/document-picker/)
- [React Native File Upload](https://reactnative.dev/docs/network#uploading-files)

---

**Останнє оновлення:** Грудень 2025
