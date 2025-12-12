# 📋 Повний чеклист AMO CRM для бекенду

## 🎯 Огляд

Цей документ містить **повний список** всього, що потрібно мати на бекенді для повноцінної роботи з AMO CRM.

---

## 📦 1. СУТНОСТІ (Entities) - База даних

### ✅ Обов'язкові сутності:

#### 1.1. **AmoToken** - Токени OAuth
- `id` - ID токена
- `access_token` - Access token
- `refresh_token` - Refresh token
- `expires_at` - Коли закінчується
- `created_at` / `updated_at`

#### 1.2. **AmoPipeline** - Воронки продажів
- `id` - ID воронки в AMO CRM
- `name` - Назва воронки
- `sort` - Порядок сортування
- `is_main` - Чи основна воронка
- `is_unsorted_on` - Чи увімкнено "Несортовані"
- `is_archive` - Чи архівна
- `account_id` - ID акаунта AMO CRM
- `created_at` / `updated_at`

#### 1.3. **AmoStage** - Етапи воронок
- `id` - ID етапу в AMO CRM
- `name` - Назва етапу
- `pipeline_id` - ID воронки
- `sort` - Порядок сортування
- `color` - Колір етапу
- `mapped_status` - Мапінг на наш статус (NEW/IN_PROGRESS/CLOSED)
- `account_id` - ID акаунта AMO CRM
- `created_at` / `updated_at`

#### 1.4. **AmoUser** - Користувачі AMO CRM
- `id` - ID користувача в AMO CRM
- `name` - Ім'я користувача
- `email` - Email
- `lang` - Мова
- `account_id` - ID акаунта AMO CRM
- `created_at` / `updated_at`

#### 1.5. **AmoRole** - Ролі користувачів
- `id` - ID ролі в AMO CRM
- `name` - Назва ролі
- `account_id` - ID акаунта AMO CRM
- `created_at` / `updated_at`

#### 1.6. **AmoContact** - Контакти
- `id` - ID контакта в AMO CRM
- `name` - Ім'я контакта
- `first_name` - Ім'я
- `last_name` - Прізвище
- `email` - Email
- `phone` - Телефон
- `responsible_user_id` - Відповідальний користувач
- `account_id` - ID акаунта AMO CRM
- `amo_created_at` / `amo_updated_at` - Timestamps з AMO
- `created_at` / `updated_at`

#### 1.7. **AmoTask** - Задачі
- `id` - ID задачі в AMO CRM
- `text` - Опис задачі
- `task_type_id` - Тип задачі (1 - дзвінок, 2 - зустріч)
- `complete_till` - Дата виконання (Unix timestamp)
- `is_completed` - Чи виконана
- `responsible_user_id` - Відповідальний користувач
- `entity_id` - ID сутності (lead/contact/company)
- `entity_type` - Тип сутності (leads/contacts/companies)
- `duration` - Тривалість в секундах
- `result_text` - Результат виконання
- `created_by` / `updated_by` - Хто створив/оновив
- `amo_created_at` / `amo_updated_at` - Timestamps з AMO
- `account_id` - ID акаунта AMO CRM
- `created_at` / `updated_at`

#### 1.8. **Lead** - Заявки (зв'язок з AMO)
- `id` - ID заявки
- `amo_lead_id` - ID lead в AMO CRM (nullable)
- `amo_contact_id` - ID контакта в AMO CRM (nullable)
- `responsible_user_id` - ID користувача AMO (nullable)
- `status` - Статус (NEW/IN_PROGRESS/CLOSED)
- `guest_name`, `guest_phone`, `guest_email` - Дані гостя
- `price` - Ціна
- `property_id` - ID нерухомості (nullable)
- `created_at` / `updated_at`

---

## 🔌 2. ENDPOINTS - API

### 2.1. **OAuth та авторизація**

#### ✅ `GET /integrations/amo-crm/callback`
- OAuth callback endpoint
- Приймає `code` (authorization code)
- Обмінює код на токени
- Зберігає токени в БД

#### ✅ `POST /integrations/amo-crm/exchange-api-key`
- Обмін API ключа на authorization code
- Body: `{ login, api_key, state? }`
- Повертає 202 Accepted

#### ✅ `GET /integrations/amo-crm/test`
- Перевірка статусу підключення
- Повертає: `{ connected, hasTokens, domain, accountId }`

#### ✅ `POST /integrations/amo-crm/set-tokens` (development)
- Ручне збереження токенів
- Body: `{ access_token, refresh_token, expires_in? }`

---

### 2.2. **Pipelines та Stages (Воронки та етапи)**

#### ✅ `POST /integrations/amo-crm/sync-pipelines`
- Синхронізація воронок та етапів з AMO CRM
- Отримує pipelines з AMO → зберігає в БД
- Повертає: `{ synced, errors }`

#### ✅ `GET /integrations/amo-crm/pipelines`
- Отримати всі воронки з БД
- Повертає: `{ data: AmoPipeline[], count }`

#### ✅ `GET /integrations/amo-crm/pipelines/:pipelineId/stages`
- Отримати етапи конкретної воронки
- Повертає: `{ data: AmoStage[], count }`

#### ✅ `PUT /integrations/amo-crm/stages/:stageId/mapping`
- Оновити мапінг статусу для етапу
- Body: `{ mappedStatus: 'NEW' | 'IN_PROGRESS' | 'CLOSED' }`
- Повертає: `{ message, data: AmoStage }`

#### ✅ `GET /integrations/amo-crm/mapping/suggestions`
- Отримати рекомендації по автоматичному мапінгу
- Аналізує назви етапів → пропонує мапінг
- Повертає: `{ data: suggestions[], count }`

#### ✅ `POST /integrations/amo-crm/mapping/auto-apply`
- Автоматично застосувати рекомендований мапінг
- Повертає: `{ applied, errors }`

---

### 2.3. **Leads (Заявки)**

#### ✅ `POST /integrations/amo-crm/sync-leads`
- Синхронізація leads з AMO CRM в нашу БД
- Query: `?limit=50` (0 = без ліміту)
- Отримує leads з AMO → створює/оновлює в нашій БД
- Повертає: `{ synced, errors }`

#### ✅ `POST /integrations/amo-crm/create-lead` (викликається з Main Backend)
- Створити lead в AMO CRM
- Body: `{ leadData: AmoLead }`
- Header: `X-API-Key` (для безпеки між сервісами)
- Повертає: `{ amoLeadId }`

#### ✅ `POST /integrations/amo-crm/update-lead` (викликається з Main Backend)
- Оновити lead в AMO CRM
- Body: `{ leadId, leadData: Partial<AmoLead> }`
- Header: `X-API-Key`

#### ✅ `POST /integrations/amo-crm/test-lead` (development)
- Тестування створення lead
- Створює тестовий lead в AMO CRM

---

### 2.4. **Users та Roles (Користувачі та ролі)**

#### ✅ `POST /integrations/amo-crm/sync-users`
- Синхронізація користувачів з AMO CRM
- Отримує users з AMO → зберігає в БД
- Повертає: `{ synced, errors }`

#### ✅ `GET /integrations/amo-crm/users`
- Отримати список користувачів AMO CRM з БД
- Повертає: `{ data: AmoUser[], count }`

#### ✅ `POST /integrations/amo-crm/sync-roles`
- Синхронізація ролей з AMO CRM
- Отримує roles з AMO → зберігає в БД
- Повертає: `{ synced, errors }`

#### ✅ `GET /integrations/amo-crm/roles`
- Отримати список ролей AMO CRM з БД
- Повертає: `{ data: AmoRole[], count }`

---

### 2.5. **Contacts (Контакти)**

#### ✅ `POST /integrations/amo-crm/sync-contacts`
- Синхронізація контактів з AMO CRM
- Query: `?limit=50`
- Отримує contacts з AMO → зберігає в БД
- Повертає: `{ synced, errors }`

#### ✅ `GET /integrations/amo-crm/contacts`
- Отримати список контактів AMO CRM з БД
- Повертає: `{ data: AmoContact[], count }`

---

### 2.6. **Tasks (Задачі)**

#### ✅ `POST /integrations/amo-crm/sync-tasks`
- Синхронізація задач з AMO CRM
- Query: `?limit=50&is_completed=false&entity_type=leads`
- Отримує tasks з AMO → зберігає в БД
- Повертає: `{ synced, errors }`

#### ✅ `GET /integrations/amo-crm/tasks`
- Отримати список задач AMO CRM з БД
- Query: `?is_completed=false&entity_type=leads&entity_id=123`
- Фільтри:
  - `is_completed` - чи виконана
  - `entity_type` - тип сутності (leads/contacts/companies)
  - `entity_id` - ID сутності
- Повертає: `{ data: AmoTask[], count }`

#### ✅ `PATCH /integrations/amo-crm/tasks/:id/complete`
- Виконати задачу в AMO CRM
- Body: `{ result_text?: string }`
- Оновлює задачу в AMO CRM та в нашій БД
- Повертає: `{ message, status }`

---

### 2.7. **Webhooks**

#### ✅ `POST /integrations/amo-crm/webhook`
- Webhook endpoint для прийому подій з AMO CRM
- Body: `AmoWebhookPayload`
- Обробляє події:
  - `leads.status` - зміна статусу lead
  - `leads.add` - новий lead
  - `leads.update` - оновлення lead
  - `leads.delete` - видалення lead
  - `contacts.add` - новий контакт
  - `contacts.update` - оновлення контакта
  - `tasks.add` - нова задача
  - `tasks.update` - оновлення задачі
  - `tasks.delete` - видалення задачі
- Завжди повертає 200 OK (навіть при помилках)
- Повертає: `{ status: 'ok', processed, errors }`

---

### 2.8. **Повна синхронізація**

#### ✅ `POST /integrations/amo-crm/sync-all`
- Повна синхронізація: pipelines, stages та всі leads
- Query: `?leadsLimit=0` (0 = без ліміту)
- Послідовно виконує:
  1. Синхронізацію pipelines та stages
  2. Синхронізацію leads
- Повертає: `{ pipelines: { synced, errors }, leads: { synced, errors } }`

---

## 🔧 3. ФУНКЦІОНАЛ - AmoCrmService

### 3.1. **OAuth та токени**

#### ✅ `exchangeApiKeyForCode(login, apiKey, state?)`
- Обмін API ключа на authorization code
- Викликає AMO CRM API: `POST /oauth2/exchange_api_key`

#### ✅ `exchangeCode(code)`
- Обмін authorization code на токени
- Викликає AMO CRM API: `POST /oauth2/access_token`
- Зберігає токени в БД

#### ✅ `getAccessToken()`
- Отримати актуальний access token
- Автоматично оновлює токен якщо він закінчився (через refresh_token)

#### ✅ `refreshToken()`
- Оновити access token через refresh_token
- Викликає AMO CRM API: `POST /oauth2/access_token` (grant_type=refresh_token)

#### ✅ `getConnectionStatus()`
- Перевірити статус підключення
- Повертає: `{ connected, hasTokens, domain, accountId }`

---

### 3.2. **Pipelines та Stages**

#### ✅ `syncPipelines()`
- Синхронізація pipelines та stages з AMO CRM
- Викликає: `GET /api/v4/leads/pipelines`
- Зберігає в БД: `AmoPipeline` та `AmoStage`
- Повертає: `{ synced, errors }`

#### ✅ `getPipelines()`
- Отримати всі pipelines з БД
- Повертає: `AmoPipeline[]`

#### ✅ `getStages(pipelineId)`
- Отримати stages конкретної воронки з БД
- Повертає: `AmoStage[]`

#### ✅ `updateStageMapping(stageId, mappedStatus)`
- Оновити мапінг статусу для етапу
- `mappedStatus`: 'NEW' | 'IN_PROGRESS' | 'CLOSED'
- Повертає: `AmoStage`

#### ✅ `getSuggestedMappings()`
- Отримати рекомендації по автоматичному мапінгу
- Аналізує назви етапів → пропонує мапінг
- Повертає: `Array<{ stageId, stageName, suggestedStatus, confidence }>`

#### ✅ `applyAutoMapping()`
- Автоматично застосувати рекомендований мапінг
- Повертає: `{ applied, errors }`

---

### 3.3. **Leads**

#### ✅ `syncLeadsFromAmo(limit)`
- Синхронізація leads з AMO CRM в нашу БД
- Викликає: `GET /api/v4/leads?limit=50`
- Для кожного lead:
  - Створює/оновлює `Lead` в нашій БД
  - Зберігає `amo_lead_id`
  - Зберігає `amo_contact_id` (якщо є)
  - Зберігає `responsible_user_id` (якщо є)
- Повертає: `{ synced, errors }`

#### ✅ `createLead(leadData)`
- Створити lead в AMO CRM
- Викликає: `POST /api/v4/leads`
- Body: `[leadData]` (масив з одним lead)
- Повертає: `number` (amoLeadId)

#### ✅ `updateLead(leadId, leadData)`
- Оновити lead в AMO CRM
- Викликає: `PATCH /api/v4/leads/:leadId`
- Body: `leadData`

#### ✅ `getLead(leadId)`
- Отримати lead з AMO CRM
- Викликає: `GET /api/v4/leads/:leadId`
- Повертає: `AmoLead`

---

### 3.4. **Users та Roles**

#### ✅ `syncUsers()`
- Синхронізація користувачів з AMO CRM
- Викликає: `GET /api/v4/users`
- Зберігає в БД: `AmoUser`
- Повертає: `{ synced, errors }`

#### ✅ `getUsers()`
- Отримати користувачів з БД
- Повертає: `AmoUser[]`

#### ✅ `syncRoles()`
- Синхронізація ролей з AMO CRM
- Викликає: `GET /api/v4/roles`
- Зберігає в БД: `AmoRole`
- Повертає: `{ synced, errors }`

#### ✅ `getRoles()`
- Отримати ролі з БД
- Повертає: `AmoRole[]`

---

### 3.5. **Contacts**

#### ✅ `syncContacts(limit)`
- Синхронізація контактів з AMO CRM
- Викликає: `GET /api/v4/contacts?limit=50`
- Зберігає в БД: `AmoContact`
- Повертає: `{ synced, errors }`

#### ✅ `getContacts()`
- Отримати контакти з БД
- Повертає: `AmoContact[]`

#### ✅ `createContact(contactData)`
- Створити контакт в AMO CRM
- Викликає: `POST /api/v4/contacts`
- Body: `[contactData]` (масив з одним контактом)
- Повертає: `number` (amoContactId)

#### ✅ `updateContact(contactId, contactData)`
- Оновити контакт в AMO CRM
- Викликає: `PATCH /api/v4/contacts/:contactId`
- Body: `contactData`

---

### 3.6. **Tasks**

#### ✅ `syncTasks(options)`
- Синхронізація задач з AMO CRM
- Викликає: `GET /api/v4/tasks?limit=50&is_completed=false&entity_type=leads`
- Options:
  - `limit` - кількість задач
  - `is_completed` - чи виконана
  - `entity_type` - тип сутності (leads/contacts/companies)
- Зберігає в БД: `AmoTask`
- Повертає: `{ synced, errors }`

#### ✅ `getTasks(options)`
- Отримати задачі з БД
- Options:
  - `is_completed` - чи виконана
  - `entity_type` - тип сутності
  - `entity_id` - ID сутності
- Повертає: `AmoTask[]`

#### ✅ `createTask(taskData)`
- Створити задачу в AMO CRM
- Викликає: `POST /api/v4/tasks`
- Body: `[taskData]` (масив з однією задачею)
- Повертає: `number` (amoTaskId)

#### ✅ `completeTask(taskId, resultText?)`
- Виконати задачу в AMO CRM
- Викликає: `PATCH /api/v4/tasks/:taskId`
- Body: `{ is_completed: true, result: { text: resultText } }`
- Оновлює задачу в нашій БД

---

### 3.7. **Webhooks**

#### ✅ `processWebhook(payload)`
- Обробити webhook від AMO CRM
- Обробляє події:
  - **`leads.status`** - зміна статусу lead
    - Оновлює статус в нашій БД (через мапінг)
    - Відправляє в Main Backend для обробки
  - **`leads.add`** - новий lead
    - Отримує lead з AMO CRM
    - Створює/оновлює в нашій БД
  - **`leads.update`** - оновлення lead
    - Отримує lead з AMO CRM
    - Оновлює в нашій БД
  - **`leads.delete`** - видалення lead
    - Видаляє зв'язок з AMO CRM (не видаляє з нашої БД)
  - **`contacts.add`** - новий контакт
    - Отримує контакт з AMO CRM
    - Створює/оновлює в нашій БД
  - **`contacts.update`** - оновлення контакта
    - Отримує контакт з AMO CRM
    - Оновлює в нашій БД
  - **`tasks.add`** - нова задача
    - Отримує задачу з AMO CRM
    - Створює/оновлює в нашій БД
  - **`tasks.update`** - оновлення задачі
    - Отримує задачу з AMO CRM
    - Оновлює в нашій БД
  - **`tasks.delete`** - видалення задачі
    - Видаляє зв'язок з AMO CRM (не видаляє з нашої БД)
- Повертає: `{ processed, errors }`

---

## 📝 4. КОМЕНТИ ТА НОТАТКИ

### ⚠️ Важливо:
**AMO CRM не має окремого API для коментів/нотаток!**

Коменти та нотатки в AMO CRM зберігаються як:
- **Custom Fields** (кастомні поля) в leads/contacts
- **Notes** (нотатки) - це частина сутності (lead/contact)
- **Tasks result_text** - результат виконання задачі

### ✅ Що можна зробити:

#### 4.1. **Custom Fields в Leads**
- Отримувати через `AmoLead.custom_fields_values`
- Зберігати в нашій БД як JSON або окремі поля
- Оновлювати через `updateLead()`

#### 4.2. **Notes через Tasks**
- Використовувати `AmoTask.result_text` для зберігання нотаток
- Створювати задачу типу "Нотатка" (якщо є такий тип в AMO)
- Зберігати в `AmoTask` entity

#### 4.3. **Activity Logs**
- Можна створити окрему сутність `AmoActivityLog`
- Зберігати історію змін через webhooks
- Логувати всі події: `leads.update`, `contacts.update`, `tasks.add`, etc.

---

## 🔗 5. ІНТЕГРАЦІЯ З MAIN BACKEND

### 5.1. **Endpoints для виклику з Main Backend**

#### ✅ `POST /integrations/amo-crm/create-lead`
- Викликається з Main Backend при створенні lead
- Header: `X-API-Key` (безпека)
- Body: `{ leadData: AmoLead }`
- Створює lead в AMO CRM
- Повертає: `{ amoLeadId }`

#### ✅ `POST /integrations/amo-crm/update-lead`
- Викликається з Main Backend при оновленні lead
- Header: `X-API-Key`
- Body: `{ leadId, leadData: Partial<AmoLead> }`
- Оновлює lead в AMO CRM

#### ✅ `POST /integrations/amo-crm/sync-lead`
- Викликається з webhook або вручну
- Body: `{ lead: AmoLead }`
- Створює/оновлює lead в нашій БД

#### ✅ `POST /integrations/amo-crm/webhook`
- Викликається з AMO CRM (webhook)
- Body: `AmoWebhookPayload`
- Обробляє події та синхронізує з Main Backend

---

## 🔐 6. БЕЗПЕКА

### 6.1. **API Keys**
- `MAIN_BACKEND_API_KEY` - для комунікації між сервісами
- Перевірка в headers: `X-API-Key`

### 6.2. **OAuth Tokens**
- Зберігаються в БД (`AmoToken`)
- Автоматичне оновлення через `refresh_token`
- Захист від витоку токенів

### 6.3. **Webhook Security**
- Перевірка джерела (опціонально)
- Валідація payload
- Логування всіх подій

---

## 📊 7. СИНХРОНІЗАЦІЯ

### 7.1. **Автоматична синхронізація (через Webhooks)**
- ✅ Leads: статус змінився
- ✅ Leads: додано
- ✅ Leads: оновлено
- ✅ Contacts: додано/оновлено
- ✅ Tasks: додано/оновлено/видалено

### 7.2. **Ручна синхронізація (через API)**
- ✅ Pipelines та Stages
- ✅ Leads (з лімітом)
- ✅ Users та Roles
- ✅ Contacts
- ✅ Tasks
- ✅ Повна синхронізація (`sync-all`)

---

## ✅ 8. ЧЕКЛИСТ РЕАЛІЗАЦІЇ

### Entities (8 сутностей):
- [ ] AmoToken
- [ ] AmoPipeline
- [ ] AmoStage
- [ ] AmoUser
- [ ] AmoRole
- [ ] AmoContact
- [ ] AmoTask
- [ ] Lead (з полями для AMO)

### Endpoints (20+ endpoints):
- [ ] OAuth: callback, exchange-api-key, test, set-tokens
- [ ] Pipelines: sync-pipelines, get pipelines, get stages, update mapping, suggestions, auto-apply
- [ ] Leads: sync-leads, create-lead, update-lead, test-lead
- [ ] Users: sync-users, get users
- [ ] Roles: sync-roles, get roles
- [ ] Contacts: sync-contacts, get contacts
- [ ] Tasks: sync-tasks, get tasks, complete task
- [ ] Webhook: webhook
- [ ] Sync: sync-all

### Service Methods (30+ методів):
- [ ] OAuth: exchangeApiKeyForCode, exchangeCode, getAccessToken, refreshToken, getConnectionStatus
- [ ] Pipelines: syncPipelines, getPipelines, getStages, updateStageMapping, getSuggestedMappings, applyAutoMapping
- [ ] Leads: syncLeadsFromAmo, createLead, updateLead, getLead
- [ ] Users: syncUsers, getUsers
- [ ] Roles: syncRoles, getRoles
- [ ] Contacts: syncContacts, getContacts, createContact, updateContact
- [ ] Tasks: syncTasks, getTasks, createTask, completeTask
- [ ] Webhooks: processWebhook

### Інтеграція:
- [ ] Налаштування webhook в AMO CRM
- [ ] Налаштування OAuth в AMO CRM
- [ ] Налаштування .env змінних
- [ ] Тестування всіх endpoints
- [ ] Тестування webhooks
- [ ] Тестування синхронізації

---

## 📚 9. ДОКУМЕНТАЦІЯ

### Корисні посилання:
- [AMO CRM API Documentation](https://www.amocrm.ru/developers/content/api/account-info)
- [OAuth2 в AMO CRM](https://www.amocrm.ru/developers/content/oauth/step-by-step)
- [Webhooks в AMO CRM](https://www.amocrm.ru/developers/content/webhooks/webhooks)

---

**Останнє оновлення:** Грудень 2025
