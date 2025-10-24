4. Детальна Логіка Ключових Процесів

4.1. Детальна Логіка Фільтрації та Пошуку (GET /properties)

Цей ендпоінт є найбільш складним та критичним для UX.

Параметри запиту:
Пагінація:
?page=1&limit=20 (за замовчуванням: page=1, limit=20, максимум: 100)

Мова:
?lang=en|ru|ar (за замовчуванням визначається з заголовка Accept-Language)

Сортування:
?sort_by=price|created_at|popularity (за замовчуванням: created_at)
?sort_order=asc|desc (за замовчуванням: desc)

Фільтри за типом та статусом:
?type=apartment|villa|townhouse|penthouse (множинний вибір через кому)
?status=ready|off-plan (за замовчуванням: всі)

Фільтри за ціною:
?price_min=500000&price_max=2000000
?currency=AED|USD (за замовчуванням: AED)

Фільтри за локацією:
?location=Dubai|Abu%20Dhabi (назва міста)
?district=Downtown|Marina (назва району)

Геопошук (для карти):
?latitude=25.2048&longitude=55.2708&radius=5000 (радіус в метрах)

Фільтри за параметрами:
?bedrooms_min=2&bedrooms_max=4
?bathrooms_min=1&bathrooms_max=3
?area_min=100&area_max=300 (площа в кв.м)

Фільтри за зручностями:
?amenities=pool,gym,parking,security (comma-separated список)

Фільтри за особливостями:
?is_exclusive=true (тільки для інвесторів)
?is_sold_out=false (приховати продані)

Пошук за текстом:
?search=Downtown%20Dubai (повнотекстовий пошук по title, description, address)

Логіка на бекенді:
1. Побудова базового SQL запиту через TypeORM QueryBuilder
2. Додавання WHERE умов на основі переданих фільтрів
3. Для геопошуку використання PostGIS функції ST_DWithin
4. Для повнотекстового пошуку використання PostgreSQL Full-Text Search або LIKE оператора
5. Застосування сортування
6. Пагінація через LIMIT та OFFSET
7. Вибір полів на основі мови (title_en, description_en, etc)

Приклад складного запиту:
GET /properties?lang=en&type=apartment,villa&price_min=1000000&price_max=3000000&bedrooms_min=2&amenities=pool,gym&location=Dubai&district=Marina&sort_by=price&sort_order=asc&page=1&limit=20

Структура відповіді:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Luxury Apartment in Marina",
      "description": "...",
      "price": 1500000,
      "currency": "AED",
      "location": {
        "latitude": 25.0808,
        "longitude": 55.1373
      },
      "images": ["url1", "url2"],
      "amenities": ["pool", "gym"],
      "is_exclusive": false,
      ...
    }
  ],
  "meta": {
    "total": 1523,
    "page": 1,
    "limit": 20,
    "pages": 77
  },
  "filters": {
    "applied": {
      "price_min": 1000000,
      "price_max": 3000000,
      "bedrooms_min": 2,
      "amenities": ["pool", "gym"]
    }
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}

Оптимізація:
- Кешування результатів в Redis на 5 хвилин (ключ: хеш від параметрів запиту)
- Invalidation кешу при створенні/оновленні об'єктів
- Database indexes на всі фільтровані поля
- GIST index для location поля

4.2. Email Сервіс

Технології:
- Nodemailer для відправки
- SMTP провайдер: SendGrid, AWS SES або Gmail
- Handlebars для HTML-шаблонів
- Bull Queue + Redis для асинхронної обробки

Email Templates (збережені в /templates/emails/):

1. welcome.hbs — Вітання після реєстрації клієнта
Змінні: {firstName, appName, appUrl}

2. verification-pending.hbs — Реєстрація брокера/інвестора на перевірці
Змінні: {firstName, role, estimatedTime: "24 години"}

3. account-approved.hbs — Акаунт підтверджено
Змінні: {firstName, role, loginUrl}

4. account-rejected.hbs — Акаунт відхилено
Змінні: {firstName, role, reason, supportEmail}

5. password-reset.hbs — Код для відновлення паролю
Змінні: {firstName, resetCode, expiresIn: "10 хвилин"}

6. new-lead-client.hbs — Клієнту після створення заявки
Змінні: {firstName, propertyTitle, propertyUrl}

7. broker-assigned.hbs — Клієнту коли заявку взяв брокер
Змінні: {firstName, brokerName, brokerPhone, propertyTitle}

8. exclusive-offer.hbs — Інвестору про нову ексклюзивну пропозицію
Змінні: {firstName, propertyTitle, propertyUrl, price}

Структура EmailService:
@Injectable()
class EmailService {
  async sendWelcomeEmail(user: User)
  async sendVerificationPending(user: User)
  async sendAccountApproved(user: User)
  async sendAccountRejected(user: User, reason: string)
  async sendPasswordResetCode(user: User, code: string)
  async sendNewLeadConfirmation(lead: Lead)
  async sendBrokerAssigned(lead: Lead, broker: User)
  async sendExclusiveOfferNotification(investor: User, property: Property)
  
  private async sendEmail(to: string, subject: string, template: string, variables: object)
}

Email Queue (Bull):
- Назва черги: 'email-queue'
- Конфігурація: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  }
- Worker: обробляє jobs асинхронно
- Dead Letter Queue для failed jobs

Логування:
- Логувати всі відправлені emails (to, subject, timestamp)
- Логувати помилки відправки для подальшого аналізу

4.3. Процес Відновлення Паролю (Детально)

POST /auth/forgot-password
Вхідні дані: { identifier: "email@example.com" або "+971501234567" }

Логіка:
1. Знайти користувача за email або phone
2. Якщо не знайдено → повернути 200 (захист від enumerate attack, але не відправляти email)
3. Перевірити rate limit: максимум 5 запитів на годину для цього identifier
4. Згенерувати 6-значний код (Math.random або crypto.randomInt)
5. Створити запис в password_reset_tokens:
   {
     user_id: user.id,
     code: "123456",
     expires_at: now + 10 minutes,
     attempts: 0,
     is_used: false
   }
6. Відправити email з кодом через EmailService
7. Повернути: { success: true, message: "Код відправлено на email" }

POST /auth/verify-reset-code
Вхідні дані: { identifier, code }

Логіка:
1. Знайти активний токен за user_id де is_used = false та expires_at > now
2. Якщо не знайдено або expired → { error: "Код недійсний або застарілий" }
3. Перевірити attempts < 3
4. Якщо код невірний:
   - Increment attempts
   - Якщо attempts >= 3 → блокування на 1 хвилину (можна через Redis)
   - Повернути { error: "Невірний код", attemptsLeft: 3 - attempts }
5. Якщо код вірний:
   - Позначити is_used = true
   - Згенерувати тимчасовий reset_token (JWT з коротким TTL: 5 хвилин)
   - Повернути { success: true, reset_token: "jwt..." }

POST /auth/reset-password
Вхідні дані: { reset_token, new_password, new_password_confirm }

Логіка:
1. Валідувати reset_token (JWT)
2. Валідувати new_password (мінімум 8 символів, etc)
3. Перевірити new_password === new_password_confirm
4. Хешувати new_password через bcrypt
5. Оновити password_hash в users
6. Інвалідувати всі refresh_tokens користувача (logout з усіх пристроїв)
7. Видалити використаний токен з password_reset_tokens
8. Відправити email з підтвердженням зміни паролю
9. Повернути { success: true, message: "Пароль успішно змінено" }

CRON Job для cleanup:
Щогодини видаляти токени де expires_at < now - 1 day

4.4. Firebase Cloud Messaging (Push-сповіщення)

Ініціалізація:
- Firebase Admin SDK
- Service Account Key з Firebase Console
- Ініціалізація в Core Module

POST /devices/register
Вхідні дані: { 
  fcm_token: "firebase_token...",
  device_type: "IOS"|"ANDROID",
  device_model: "iPhone 14 Pro",
  os_version: "17.0",
  app_version: "1.0.0"
}

Логіка:
1. Перевірити чи токен вже існує
2. Якщо існує для іншого користувача → переприв'язати до поточного
3. Якщо існує для поточного → оновити last_active_at
4. Якщо новий → створити запис в user_devices
5. Повернути { success: true }

DELETE /devices/:token
Логіка:
1. Знайти пристрій за fcm_token
2. Видалити або позначити is_active = false
3. Повернути { success: true }

FirebaseService методи:

async sendPushNotification(userId: string, notification: { title, body, data }) {
  1. Отримати всі активні FCM токени користувача з user_devices
  2. Перевірити notification_settings:
     - Чи увімкнений тип сповіщення
     - Чи не тихі години (quiet_hours_start - quiet_hours_end)
  3. Для кожного токену:
     - Сформувати payload для Firebase
     - Відправити через admin.messaging().send()
     - Обробити помилки (invalid token → видалити з БД)
  4. Зберегти в notifications_history
  5. Повернути кількість успішно відправлених
}

async sendBatchNotification(userIds: string[], notification) {
  Аналогічно, але для масиву користувачів
  Використовувати admin.messaging().sendMulticast() для batch відправки
}

Типи Push-сповіщень:

Для Брокера:
- Нова заявка в пулі
  { title: "Нова заявка", body: "Villa в Dubai Marina", data: { type: "LEAD", leadId: "..." } }
  
Для Клієнта:
- Брокер прийняв заявку
  { title: "Заявку прийнято", body: "Брокер Іван зв'яжеться з вами найближчим часом" }
- Статус заявки оновлено
  { title: "Статус оновлено", body: "Ваша заявка в роботі" }

Для Інвестора:
- Нова ексклюзивна пропозиція
  { title: "Нова інвестиція!", body: "Premium Tower в Business Bay. ROI 12%" }
- Щомісячний звіт по портфелю
  { title: "Звіт готовий", body: "Ваш місячний звіт доступний для перегляду" }

Deep Links в data payload:
{
  type: "LEAD|PROPERTY|EXCLUSIVE",
  targetId: "uuid",
  deepLink: "for-you://leads/uuid" або "for-you://properties/uuid"
}

4.5. AMO CRM Integration (Детально)

Налаштування:
- AMO CRM OAuth 2.0 або Long-lived Access Token
- Webhook URL: https://api.for-you.com/integrations/amo-webhook
- Webhook Secret Key для верифікації

AmoCrmService методи:

async createLead(lead: Lead) {
  1. Перевірити чи існує контакт за phone/email
     GET /api/v4/contacts?query={phone}
  2. Якщо контакт не існує → створити:
     POST /api/v4/contacts
     Body: { name, phone, email, custom_fields }
  3. Створити угоду:
     POST /api/v4/leads
     Body: {
       name: "Заявка на {propertyTitle}",
       status_id: 142, // "Нова заявка"
       pipeline_id: 1,
       price: property.price,
       contacts: [{ id: contactId }],
       custom_fields: [
         { field_id: 123, values: [{ value: property.id }] },
         { field_id: 124, values: [{ value: lead.comment }] }
       ]
     }
  4. Зберегти amo_deal_id в нашій таблиці leads
  5. Обробити помилки (якщо AMO недоступний → retry через queue)
}

async updateLeadResponsible(leadId: string, brokerId: string) {
  1. Отримати amo_user_id брокера (зберігати в таблиці users)
  2. Оновити угоду:
     PATCH /api/v4/leads/{amo_deal_id}
     Body: { responsible_user_id: amo_user_id }
}

async updateLeadStatus(leadId: string, status: LeadStatus) {
  Мапінг статусів:
  NEW → 142 (Нова заявка)
  IN_PROGRESS → 143 (В роботі)
  CLOSED → 144 (Завершено)
  
  PATCH /api/v4/leads/{amo_deal_id}
  Body: { status_id: mappedStatusId }
}

POST /integrations/amo-webhook (обробка вебхуків)
Headers: X-AMO-API-KEY: {secret}

Логіка:
1. Валідувати API ключ
2. Парсити payload:
   {
     "leads": {
       "update": [{
         "id": 123456,
         "status_id": 143,
         "responsible_user_id": 789
       }]
     }
   }
3. Знайти lead в БД за amo_deal_id
4. Якщо не знайдено → логувати та ігнорувати
5. Оновити статус в БД (мапінг назад: 143 → IN_PROGRESS)
6. Якщо статус змінився → відправити push клієнту
7. Логувати в sync_logs
8. Повернути 200 OK (AMO очікує швидку відповідь)

Обробка помилок:
- Retry логіка через Bull Queue (3 спроби з exponential backoff)
- Логування всіх помилок в Sentry
- Alert адміну якщо AMO недоступний більше 30 хвилин

4.6. XML Синхронізація (CRON Job)

Налаштування:
- CRON розклад: 0 3 * * * (щоденно о 03:00)
- @nestjs/schedule
- XML URL зберігається в конфігурації

DataSyncService.syncProperties():

1. Підготовка:
   - Логувати початок синхронізації
   - Створити запис в sync_logs (status: PENDING)

2. Завантаження XML:
   - Завантажити XML з URL через axios
   - Timeout: 60 секунд
   - Retry: 3 спроби з інтервалом 5 хвилин
   - Якщо не вдалося → логувати помилку, відправити alert, exit

3. Парсинг XML:
   - Використати xml2js для парсингу
   - Валідувати структуру
   - Якщо помилка парсингу → логувати, alert, exit

4. Обробка кожного <complex>:
   - Отримати external_id з <complex-id>
   - Перевірити чи існує в БД: SELECT id FROM properties WHERE external_id = ?
   
   Якщо існує (UPDATE):
   - Порівняти updated_at або обчислити хеш даних
   - Якщо дані змінилися:
     * Оновити основну таблицю properties
     * Видалити старі реляційні записи (images, amenities, payment_plans)
     * Вставити нові реляційні записи
     * Increment updated_count
   
   Якщо не існує (INSERT):
   - Створити новий запис в properties
   - Створити всі реляційні записи
   - Increment created_count

5. Архівація відсутніх:
   - Отримати список всіх external_id з XML
   - Знайти properties які є в БД, але відсутні в XML
   - Позначити їх як is_archived = true або is_sold_out = true
   - Increment archived_count

6. Завершення:
   - Оновити sync_logs:
     * status: SUCCESS або PARTIAL (якщо були помилки)
     * completed_at: now
     * created_count, updated_count, archived_count
     * errors: JSON масив помилок
   - Invalidate Redis cache для /properties
   - Логувати результати

Performance оптимізації:
- Batch INSERT/UPDATE по 100 записів через TypeORM
- Використовувати транзакції для атомарності
- Кешувати список existing external_id в пам'яті для швидкого lookup
- Connection pool: min 5, max 20

Обробка помилок:
- Wrap весь процес в try-catch
- Логувати кожну помилку з контекстом (який об'єкт, яка операція)
- Якщо критична помилка (падіння БД) → rollback транзакції
- Відправити email адміну з summary

4.7. PDF Генерація (Детально)

Технології:
- Puppeteer (для HTML → PDF)
- Handlebars (для HTML шаблонів)
- Bull Queue (для асинхронної обробки)
- AWS S3 (для зберігання файлів)

POST /selections/:id/generate-pdf

Логіка (синхронна частина):
1. Валідувати що selection належить поточному брокеру
2. Перевірити rate limit: 20 PDF на день на брокера
3. Створити job в pdf_generation_jobs (status: PENDING)
4. Додати job в Bull Queue
5. Одразу повернути:
   {
     "success": true,
     "jobId": "uuid",
     "status": "processing",
     "message": "PDF генерується. Перевірте статус через /selections/:id/pdf-status"
   }

GET /selections/:id/pdf-status
Повертає:
{
  "status": "pending|processing|completed|failed",
  "url": "https://s3.../selection-uuid.pdf" (якщо completed),
  "error": "..." (якщо failed)
}

Bull Worker (асинхронна обробка):

async processPdfGeneration(job: Job) {
  1. Отримати дані:
     - Selection details
     - Об'єкти з selection_properties + properties
     - Broker details (name, photo, phone, email)
  
  2. Підготувати дані для шаблону:
     {
       broker: { name, photo, phone, email, company: "For You Real Estate" },
       selection: { title, description },
       properties: [
         {
           title, address, price, area, bedrooms, bathrooms,
           mainImage, description (перші 200 символів),
           qrCode: generateQR(`https://foryou.app/properties/${id}`)
         }
       ],
       generatedAt: formatDate(now)
     }
  
  3. Рендерити HTML:
     const template = Handlebars.compile(pdfTemplate)
     const html = template(data)
  
  4. Генерувати PDF через Puppeteer:
     const browser = await puppeteer.launch({ headless: true })
     const page = await browser.newPage()
     await page.setContent(html, { waitUntil: 'networkidle0' })
     const pdfBuffer = await page.pdf({
       format: 'A4',
       printBackground: true,
       margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
     })
     await browser.close()
  
  5. Завантажити в S3:
     const fileName = `selections/${selectionId}-${Date.now()}.pdf`
     await s3.upload({
       Bucket: 'for-you-real-estate-pdfs',
       Key: fileName,
       Body: pdfBuffer,
       ContentType: 'application/pdf',
       ACL: 'private'
     })
     const url = s3.getSignedUrl('getObject', { Bucket, Key: fileName, Expires: 7*24*60*60 })
  
  6. Оновити БД:
     - selections.pdf_url = url
     - pdf_generation_jobs.status = COMPLETED
     - pdf_generation_jobs.result_url = url
  
  7. Відправити push брокеру:
     "PDF готовий! Ваша презентація доступна для завантаження"
}

HTML Template (pdf-template.hbs):
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Брендований CSS */
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');
    body { font-family: 'Roboto', sans-serif; }
    .header { background: #1a73e8; color: white; padding: 30px; }
    .property { page-break-inside: avoid; margin: 20px 0; }
    .footer { text-align: center; margin-top: 50px; }
  </style>
</head>
<body>
  <!-- Титульна сторінка -->
  <div class="header">
    <img src="{{broker.company.logo}}" />
    <h1>{{selection.title}}</h1>
    <p>Prepared by: {{broker.name}}</p>
  </div>
  
  <!-- Об'єкти -->
  {{#each properties}}
  <div class="property">
    <img src="{{mainImage}}" style="width: 100%;" />
    <h2>{{title}}</h2>
    <p>{{address}}</p>
    <p><strong>Price:</strong> {{price}} AED</p>
    <p><strong>Area:</strong> {{area}} sq.m | <strong>Bedrooms:</strong> {{bedrooms}}</p>
    <p>{{description}}</p>
    <img src="{{qrCode}}" style="width: 100px;" />
    <p><small>Scan to view in app</small></p>
  </div>
  {{/each}}
  
  <!-- Фінальна сторінка -->
  <div class="footer">
    <h3>Contact Us</h3>
    <p>{{broker.name}}</p>
    <p>{{broker.phone}} | {{broker.email}}</p>
    <p>For You Real Estate</p>
  </div>
</body>
</html>

Обробка помилок:
- Timeout: 30 секунд на генерацію
- Якщо помилка → оновити pdf_generation_jobs.status = FAILED
- Логувати помилку з stack trace
- Retry: 1 спроба (деякі помилки тимчасові)

4.8. Rate Limiting (Детально)

Використання @nestjs/throttler:

Глобальні налаштування:
ThrottlerModule.forRoot([{
  ttl: 60000, // 60 секунд
  limit: 100  // 100 запитів
}])

Спеціальні обмеження для endpoints:

@Throttle({ default: { ttl: 86400000, limit: 10 } }) // 10 на день
POST /leads

@Throttle({ default: { ttl: 3600000, limit: 5 } }) // 5 на годину
POST /auth/forgot-password

@Throttle({ default: { ttl: 900000, limit: 10 } }) // 10 на 15 хвилин
POST /auth/login

@Throttle({ default: { ttl: 86400000, limit: 20 } }) // 20 на день
POST /selections/:id/generate-pdf

Кастомна логіка для POST /auth/reset-password:
- Через Redis counter
- Ключ: `reset-password-attempts:{user_id}`
- Максимум 3 спроби на код
- Блокування на 1 хвилину після 3 невдалих спроб

Обробка перевищення ліміту:
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Занадто багато запитів. Спробуйте пізніше.",
    "retryAfter": 3600 // секунди
  },
  "timestamp": "..."
}

HTTP статус: 429 Too Many Requests

5. Guards, Middleware та Exception Handling

5.1. Guards (Захист Endpoints)

JwtAuthGuard:
Використання: @UseGuards(JwtAuthGuard)
Логіка:
- Перевіряє наявність Bearer token в Authorization header
- Валідує JWT через JwtService
- Додає user об'єкт в request (req.user)
- Якщо токен невалідний → 401 Unauthorized

RolesGuard:
Використання: @UseGuards(JwtAuthGuard, RolesGuard) + @Roles(UserRole.ADMIN, UserRole.BROKER)
Логіка:
- Перевіряє що req.user.role входить в дозволені ролі
- Якщо ні → 403 Forbidden

StatusGuard (кастомний):
Використання: @UseGuards(JwtAuthGuard, StatusGuard)
Логіка:
- Перевіряє що req.user.status === 'ACTIVE'
- Якщо PENDING → 403 з повідомленням "Акаунт на перевірці"
- Якщо BLOCKED → 403 з повідомленням "Акаунт заблоковано"

ThrottlerGuard:
Автоматично застосовується глобально
Логіка rate limiting (див. розділ 4.8)

Приклад використання:
@UseGuards(JwtAuthGuard, RolesGuard, StatusGuard)
@Roles(UserRole.BROKER)
@Get('/crm/clients')
async getClients() { ... }

5.2. Middleware

LoggerMiddleware:
Логіка:
- Логує кожен вхідний HTTP запит
- Формат: [METHOD] URL | Status: CODE | Time: XXms | User: userId
- Використовує Winston logger
- Рівень: info для 2xx/3xx, warn для 4xx, error для 5xx

CorsMiddleware:
Налаштування:
app.enableCors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
})

5.3. Interceptors

TransformInterceptor:
Обгортає всі успішні відповіді в стандартний формат:
{
  "success": true,
  "data": { ... },
  "meta": { ... },
  "timestamp": "2025-01-01T00:00:00.000Z"
}

TimeoutInterceptor:
Встановлює timeout для запитів: 30 секунд
Якщо перевищено → 408 Request Timeout

5.4. Pipes

ValidationPipe (глобальний):
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,           // Видаляє непередбачені поля
  forbidNonWhitelisted: true, // Викидає помилку для непередбачених полів
  transform: true,            // Автоматична трансформація типів
  transformOptions: {
    enableImplicitConversion: true
  }
}))

ParseUUIDPipe:
Для параметрів route (:id)
Валідує що параметр є валідним UUID
Якщо ні → 400 Bad Request

5.5. Exception Filters

AllExceptionsFilter (глобальний):
Перехоплює всі необроблені помилки
Логує помилку з stack trace
Повертає стандартизований формат помилки

HttpExceptionFilter:
Обробляє HttpException та його підкласи
Формат відповіді:
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly message",
    "details": [...] // для validation errors
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}

Коди помилок:
- VALIDATION_ERROR (400)
- UNAUTHORIZED (401)
- FORBIDDEN (403)
- NOT_FOUND (404)
- RATE_LIMIT_EXCEEDED (429)
- INTERNAL_ERROR (500)

6. Security (Безпека)

6.1. Helmet
Встановлює безпечні HTTP headers:
app.use(helmet())

Headers що встановлюються:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000

6.2. CORS
Налаштовано тільки для дозволених origins (див. 5.2)
Production: ['https://admin.for-you.com', 'https://app.for-you.com']

6.3. Input Sanitization
HTML Content:
- Для description полів використовувати sanitize-html
- Дозволені теги: <p>, <br>, <strong>, <em>, <ul>, <ol>, <li>
- Блокувати <script>, <iframe>, onclick тощо

SQL Injection:
- TypeORM автоматично використовує параметризовані запити
- Ніколи не конкатенувати SQL вручну

6.4. Password Security
Hashing:
- bcrypt з salt rounds: 12
- Ніколи не зберігати паролі в plain text

JWT Tokens:
- Access Token TTL: 7 днів
- Refresh Token TTL: 30 днів
- Алгоритм: RS256 (рекомендовано) або HS256
- Secret в змінних середовища

Session Management:
- При зміні паролю → invalidate всі refresh tokens
- Зберігати refresh tokens в БД для можливості revoke

6.5. Secrets Management
Development:
- .env файли (не коммітити в git)

Production:
- AWS Secrets Manager або HashiCorp Vault
- Ротація секретів кожні 90 днів

Що зберігати:
- DATABASE_URL
- JWT_SECRET, JWT_REFRESH_SECRET
- AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
- AMO_CRM_ACCESS_TOKEN
- FIREBASE_SERVICE_ACCOUNT_KEY
- EMAIL_SMTP_PASSWORD

6.6. API Keys
Для AMO CRM Webhook:
- Генерувати складний API ключ
- Перевіряти в X-AMO-API-KEY header
- Ротувати кожні 90 днів

7. Performance Optimization

7.1. Database Indexes

Критичні індекси:
CREATE INDEX idx_properties_location ON properties USING GIST(location);
CREATE INDEX idx_properties_is_exclusive ON properties(is_exclusive) WHERE is_exclusive = true;
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_status ON properties(status_en, status_ru, status_ar);
CREATE INDEX idx_properties_external_id ON properties(external_id);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_broker_id ON leads(broker_id) WHERE broker_id IS NOT NULL;
CREATE INDEX idx_leads_client_id ON leads(client_id) WHERE client_id IS NOT NULL;
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role_status ON users(role, status);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_property_id ON favorites(property_id);

CREATE INDEX idx_notifications_user_unread ON notifications_history(user_id, is_read) WHERE is_read = false;

Composite indexes для частих запитів:
CREATE INDEX idx_properties_filter ON properties(type, is_exclusive, is_sold_out) WHERE is_archived = false;

7.2. Caching (Redis)

Конфігурація:
- Host: Redis server
- TTL: варіюється по endpoint
- Eviction policy: allkeys-lru

Що кешувати:

GET /properties (каталог):
- Ключ: `properties:list:${hashOfQueryParams}`
- TTL: 5 хвилин
- Invalidate: при створенні/оновленні об'єкта

GET /properties/exclusive:
- Ключ: `properties:exclusive:${lang}`
- TTL: 10 хвилин
- Invalidate: при створенні/оновленні ексклюзивного об'єкта

GET /properties/:id:
- Ключ: `property:${id}:${lang}`
- TTL: 30 хвилин
- Invalidate: при оновленні цього об'єкта

User Sessions:
- Ключ: `session:${userId}`
- TTL: 30 днів (як refresh token)
- Зберігає user object для швидкого доступу

Rate Limiting Counters:
- Ключ: `rate-limit:${endpoint}:${userId}`
- TTL: залежить від endpoint

Cache Invalidation Strategy:
- Проактивна: при оновленні даних видаляти відповідні ключі
- Lazy: дозволити TTL expire для рідко використовуваних даних

7.3. Database Connection Pooling

TypeORM Configuration:
{
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  extra: {
    max: 20,          // Максимум з'єднань в пулі
    min: 5,           // Мінімум з'єднань завжди активні
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
  }
}

7.4. Query Optimization

Select тільки потрібні поля:
// BAD
const properties = await repo.find()

// GOOD
const properties = await repo
  .createQueryBuilder('p')
  .select(['p.id', 'p.title', 'p.price', 'p.location'])
  .getMany()

Eager loading для relations:
const selection = await repo
  .createQueryBuilder('s')
  .leftJoinAndSelect('s.properties', 'p')
  .leftJoinAndSelect('p.images', 'i')
  .where('s.id = :id', { id })
  .getOne()

Pagination:
const [results, total] = await repo.findAndCount({
  skip: (page - 1) * limit,
  take: limit
})

7.5. Compression

Gzip compression для HTTP responses:
app.use(compression())

Стискає відповіді більше 1KB
Рекомендовано для JSON API

8. Logging and Monitoring

8.1. Logging (Winston)

Рівні логування:
- error: Критичні помилки (500 errors, crashes)
- warn: Попередження (4xx errors, deprecated usage)
- info: Інформаційні повідомлення (запити, важливі події)
- debug: Детальна інформація (тільки в dev)

Формат:
{
  "level": "error",
  "message": "Failed to create lead",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "context": {
    "userId": "uuid",
    "propertyId": "uuid",
    "error": "Stack trace..."
  }
}

Транспорти:
Development:
- Console (colored output)
- File: logs/error.log, logs/combined.log

Production:
- File з ротацією (winston-daily-rotate-file)
- Sentry для errors
- CloudWatch Logs (якщо AWS)

Що логувати:
- Всі HTTP запити (request/response)
- Всі помилки з stack trace
- Критичні операції (створення заявок, платежів)
- External API calls (AMO CRM, Firebase) з response time
- CRON jobs результати
- Database queries в dev режимі (TypeORM logging: true)

8.2. Error Tracking (Sentry)

Ініціалізація:
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
})

Що відстежувати:
- Необроблені exceptions
- HTTP 5xx errors
- Failed database queries
- External API failures

Context:
- User ID
- Request ID
- Environment
- Node version

8.3. Application Monitoring

Health Check Endpoint:
GET /health
Відповідь:
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123456,
  "database": "connected",
  "redis": "connected"
}

Metrics (опціонально з Prometheus):
- Request rate (requests/second)
- Response time (avg, p95, p99)
- Error rate
- Database query time
- Cache hit rate

Process Management (PM2):
pm2 start dist/main.js --name for-you-api --instances 4

PM2 ecosystem.config.js:
module.exports = {
  apps: [{
    name: 'for-you-api',
    script: './dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
}

9. Testing

9.1. Unit Tests

Тестування сервісів:
describe('AuthService', () => {
  it('should hash password correctly', async () => {
    const password = 'Test123!'
    const hash = await authService.hashPassword(password)
    expect(hash).not.toBe(password)
    expect(await bcrypt.compare(password, hash)).toBe(true)
  })
  
  it('should generate valid JWT token', async () => {
    const user = { id: 'uuid', email: 'test@test.com' }
    const token = await authService.generateAccessToken(user)
    expect(token).toBeDefined()
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    expect(decoded.sub).toBe(user.id)
  })
})

Coverage:
- Мінімум 70% для production
- Focus на business logic

9.2. Integration Tests

Тестування endpoints:
describe('POST /auth/register', () => {
  it('should register new client', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@test.com',
        password: 'Test123!',
        firstName: 'John',
        lastName: 'Doe',
        role: 'CLIENT'
      })
      .expect(201)
    
    expect(response.body.data).toHaveProperty('id')
    expect(response.body.data.email).toBe('test@test.com')
  })
  
  it('should reject duplicate email', async () => {
    // Спочатку створити користувача
    await createUser({ email: 'test@test.com' })
    
    // Спробувати створити ще раз
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@test.com', ... })
      .expect(400)
  })
})

9.3. E2E Tests

Критичні флоу:
1. Реєстрація → Вхід → Перегляд каталогу → Створення заявки
2. Брокер → Вхід → Взяти заявку → Створити підбірку → Генерувати PDF
3. Інвестор → Вхід → Перегляд ексклюзивів → Створення інвестиції

Test Database:
- Окрема БД для тестів
- Cleanup перед кожним тестом
- Fixtures для тестових даних

9.4. Load Testing (опціонально)

Інструменти:
- Artillery або k6

Scenarios:
- 100 concurrent users → GET /properties
- 50 requests/second → POST /leads
- Stress test: поступове збільшення навантаження

Metrics:
- Response time під навантаженням
- Throughput
- Error rate

10. Deployment та DevOps

10.1. Docker

Dockerfile (вже створено):
- Multi-stage build
- Production stage з Node Alpine
- Мінімальний розмір образу

docker-compose.yml (вже створено):
- PostgreSQL + PostGIS
- Redis
- Backend (опціонально)

10.2. CI/CD Pipeline

GitHub Actions або GitLab CI:

Stages:
1. Install Dependencies
2. Lint (ESLint)
3. Type Check (TypeScript)
4. Unit Tests
5. Integration Tests
6. Build
7. Docker Build & Push
8. Deploy (Production)

.github/workflows/ci.yml:
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to AWS
        # Deployment steps

10.3. Environment Variables

Development (.env):
- Всі змінні в .env файлі
- .env не коммітити в git

Production:
- AWS Secrets Manager
- Kubernetes Secrets
- Або Environment Variables в hosting platform

Required variables:
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
AWS_ACCESS_KEY_ID=...
FIREBASE_SERVICE_ACCOUNT=...

10.4. Infrastructure (Приклад AWS)

Architecture:
- EC2 або ECS для Backend
- RDS PostgreSQL з PostGIS
- ElastiCache Redis
- S3 для файлів (PDF, images)
- CloudFront CDN для статики
- Route 53 для DNS
- ALB (Application Load Balancer)
- CloudWatch для логів та метрик

Auto Scaling:
- Мінімум 2 інстанси
- Максимум 10 інстансів
- Scale up: CPU > 70% або Memory > 80%
- Scale down: CPU < 30%

Backup:
- RDS automated backups (7 днів retention)
- S3 versioning для файлів
- Database snapshots щотижня

11. Документація API

11.1. Swagger/OpenAPI

Вже налаштовано в main.ts
Доступно: http://localhost:3000/api/v1/docs

Декоратори для документування:
@ApiTags('Properties')
@ApiOperation({ summary: 'Get properties list' })
@ApiQuery({ name: 'page', required: false, type: Number })
@ApiResponse({ status: 200, description: 'Success', type: PropertyListDto })
@ApiResponse({ status: 400, description: 'Bad Request' })
@Get('/properties')
async getProperties(@Query() query: PropertyFiltersDto) { ... }

11.2. README для розробників

Має включати:
- Швидкий старт (як запустити локально)
- Структура проекту
- Як додати новий модуль
- Як запустити тести
- Як зробити міграцію
- Приклади використання API
- Troubleshooting

11.3. Postman Collection

Створити колекцію з прикладами запитів для всіх endpoints
Включити environments для dev/staging/production
Поділити на folders за модулями

Це завершує повну технічну специфікацію backend для проекту For You Real Estate.

