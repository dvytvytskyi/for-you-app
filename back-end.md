Технічна Специфікація та Архітектура Бекенду
Цей документ описує архітектурні рішення, структуру бази даних, проектування API та логіку роботи серверної частини додатку.
1. Загальна Архітектура та Принципи
Фреймворк: NestJS на Node.js. Обраний за його модульну архітектуру, підтримку TypeScript "з коробки" та Dependency Injection, що ідеально підходить для побудови складних та масштабованих систем.
Архітектурний патерн: Модульна архітектура. Кожен функціональний блок (автентифікація, нерухомість, CRM, інвестиції) буде реалізовано як окремий, слабко зв'язаний модуль. Це спрощує розробку, тестування та подальшу підтримку.
Взаємодія з БД: Використання TypeORM як ORM для роботи з базою даних. Це дозволить описувати моделі даних у вигляді класів TypeScript та абстрагуватися від прямих SQL-запитів.
Асинхронність: Вся система буде побудована на асинхронних операціях (Promises, async/await) для забезпечення високої продуктивності та неблокуючої обробки запитів.
Конфігурація: Управління конфігурацією (ключі API, підключення до БД) через змінні середовища (.env файли) за допомогою @nestjs/config.
2. Проектування Бази Даних (PostgreSQL)
Схема бази даних є фундаментом всього додатку.
users:
id (UUID, Primary Key)
email (VARCHAR, UNIQUE)
phone (VARCHAR, UNIQUE)
password_hash (VARCHAR)
first_name (VARCHAR), last_name (VARCHAR)
role (ENUM: CLIENT, BROKER, INVESTOR, ADMIN)
status (ENUM: PENDING, ACTIVE, BLOCKED)
license_number (VARCHAR, nullable, для BROKER)
google_id (VARCHAR, nullable), apple_id (VARCHAR, nullable)
created_at, updated_at (TIMESTAMPTZ)
properties:
id (UUID, PK)
external_id (BIGINT, UNIQUE, для complex-id з XML)
type (VARCHAR)
title_en, title_ru, title_ar (VARCHAR)
description_en, description_ru, description_ar (TEXT)
status_en, status_ru, status_ar (VARCHAR)
logo_url, main_photo_url (VARCHAR)
location (GEOGRAPHY(Point, 4326), індексоване поле PostGIS)
address (VARCHAR)
min_price, max_price (NUMERIC), currency (VARCHAR)
is_exclusive (BOOLEAN, default: false)
is_sold_out (BOOLEAN)
planned_completion_at (TIMESTAMPTZ)
developer_id (FK to developers)
property_images, property_amenities, payment_plans: Реляційні таблиці, пов'язані з properties.
favorites:
user_id (FK to users)
property_id (FK to properties)
(Composite Primary Key на user_id та property_id)
leads:
id (UUID, PK)
property_id (FK to properties)
client_id (FK to users, може бути null для гостей)
guest_name, guest_phone (VARCHAR, для неавторизованих)
broker_id (FK to users, nullable)
status (ENUM: NEW, IN_PROGRESS, CLOSED)
comment (TEXT)
contact_method, contact_time (VARCHAR)
amo_deal_id (BIGINT, nullable)
broker_clients:
id (UUID, PK)
broker_id (FK to users)
name (VARCHAR)
phone (VARCHAR)
email (VARCHAR, nullable)
source (VARCHAR) -- "додаток", "реферал", "подія"
tags (JSONB) -- мітки для класифікації
notes (TEXT)
created_at, updated_at (TIMESTAMPTZ)

selections:
id (UUID, PK)
broker_id (FK to users)
client_id (FK to broker_clients, nullable)
title (VARCHAR)
description (TEXT, nullable)
pdf_url (VARCHAR, nullable) -- посилання на згенерований PDF в S3
pdf_job_id (UUID, nullable) -- для відстеження статусу генерації
is_shared (BOOLEAN, default: false)
created_at, updated_at (TIMESTAMPTZ)

selection_properties:
selection_id (FK to selections)
property_id (FK to properties)
order_index (INTEGER) -- порядок об'єктів в підбірці
added_at (TIMESTAMPTZ)
(Composite PK на selection_id та property_id)

investments:
id (UUID, PK)
investor_id (FK to users)
property_id (FK to properties)
amount (NUMERIC) -- сума інвестиції
currency (VARCHAR)
investment_date (TIMESTAMPTZ)
expected_roi (NUMERIC) -- очікувана рентабельність, %
actual_roi (NUMERIC, nullable) -- фактична рентабельність
status (ENUM: ACTIVE, COMPLETED, CANCELLED)
notes (TEXT, nullable)
created_at, updated_at (TIMESTAMPTZ)

investor_documents:
id (UUID, PK)
investor_id (FK to users)
investment_id (FK to investments, nullable)
title (VARCHAR)
file_key (VARCHAR) -- ключ файлу в S3
file_type (VARCHAR) -- pdf, docx, xlsx
file_size (BIGINT) -- розмір у байтах
uploaded_at (TIMESTAMPTZ)

property_images:
id (UUID, PK)
property_id (FK to properties)
image_url (VARCHAR)
order_index (INTEGER)
is_main (BOOLEAN, default: false)

property_amenities:
id (UUID, PK)
property_id (FK to properties)
amenity_name (VARCHAR)
amenity_type (VARCHAR) -- indoor/outdoor

payment_plans:
id (UUID, PK)
property_id (FK to properties)
plan_name (VARCHAR)
down_payment_percent (NUMERIC)
installment_years (INTEGER)
description (TEXT)

developers:
id (UUID, PK)
name (VARCHAR)
logo_url (VARCHAR, nullable)
website (VARCHAR, nullable)
created_at (TIMESTAMPTZ)

password_reset_tokens:
id (UUID, PK)
user_id (FK to users)
code (VARCHAR(6))
expires_at (TIMESTAMPTZ) -- дійсний 10 хвилин
attempts (INTEGER, default: 0) -- максимум 3 спроби
is_used (BOOLEAN, default: false)
created_at (TIMESTAMPTZ)

user_devices:
id (UUID, PK)
user_id (FK to users)
fcm_token (VARCHAR, UNIQUE)
device_type (ENUM: IOS, ANDROID)
device_model (VARCHAR, nullable)
os_version (VARCHAR, nullable)
app_version (VARCHAR, nullable)
is_active (BOOLEAN, default: true)
last_active_at (TIMESTAMPTZ)
created_at, updated_at (TIMESTAMPTZ)

notification_settings:
id (UUID, PK)
user_id (FK to users)
new_leads (BOOLEAN, default: true)
lead_updates (BOOLEAN, default: true)
exclusive_offers (BOOLEAN, default: true)
portfolio_reports (BOOLEAN, default: true)
quiet_hours_start (TIME, nullable) -- приклад: 22:00
quiet_hours_end (TIME, nullable) -- приклад: 09:00
created_at, updated_at (TIMESTAMPTZ)

notifications_history:
id (UUID, PK)
user_id (FK to users)
title (VARCHAR)
body (TEXT)
data (JSONB) -- deep link параметри та додаткова інформація
type (ENUM: LEAD, PROPERTY, SYSTEM, EXCLUSIVE)
is_read (BOOLEAN, default: false)
sent_at (TIMESTAMPTZ)
read_at (TIMESTAMPTZ, nullable)

sync_logs:
id (UUID, PK)
sync_type (ENUM: XML_PROPERTIES, AMO_CRM)
started_at (TIMESTAMPTZ)
completed_at (TIMESTAMPTZ, nullable)
status (ENUM: SUCCESS, FAILED, PARTIAL)
created_count (INTEGER, default: 0)
updated_count (INTEGER, default: 0)
archived_count (INTEGER, default: 0)
errors (JSONB)

pdf_generation_jobs:
id (UUID, PK)
selection_id (FK to selections)
broker_id (FK to users)
status (ENUM: PENDING, PROCESSING, COMPLETED, FAILED)
result_url (VARCHAR, nullable)
error_message (TEXT, nullable)
created_at, updated_at (TIMESTAMPTZ)
3. Архітектура Модулів та API Ендпоінтів
3.1. Модуль Core/Shared
Завдання: Налаштування бази даних, конфігурації, логування (напр., Winston), глобальні обробники помилок. Не містить бізнес-логіки.
3.2. Модуль Auth (Автентифікація)
Завдання: Реєстрація, вхід, відновлення паролю, робота з JWT.
API Ендпоінти:
POST /auth/register: Приймає DTO з даними користувача. Створює користувача зі статусом PENDING для Брокерів/Інвесторів. Відправляє email-підтвердження.
POST /auth/login: Валідує креданшали, повертає access_token та refresh_token.
POST /auth/refresh: Оновлює access_token за допомогою refresh_token.
POST /auth/social-login: Обробляє токени від Google/Apple, знаходить або створює користувача.
POST /auth/forgot-password: Генерує та відправляє код відновлення.
POST /auth/reset-password: Валідує код та встановлює новий пароль.
3.3. Модуль Integrations (Інтеграції)
Завдання: Ізольована логіка для роботи зі сторонніми сервісами.
Сервіси:
DataSyncService: Містить логіку для CRON-задачі. Завантажує XML-фід, парсить його (використовуючи, напр., xml2js) та оновлює базу даних.
AmoCrmService: Інкапсулює всю логіку для роботи з API AMO CRM (створення угод, контактів).
FirebaseService: Для відправки Push-сповіщень.
3.4. Модуль Properties (Нерухомість)
Завдання: Надання доступу до каталогу нерухомості.
API Ендпоінти:
GET /properties: Основний ендпоінт для каталогу.
Параметри: ?page=1&limit=20 (пагінація), ?lang=en (мова), складні фільтри (?price_min=..., ?amenities=pool,gym).
Логіка: Формує складний SQL-запит (через TypeORM QueryBuilder) з урахуванням фільтрів, пагінації та мови. Для користувачів-інвесторів не віддає об'єкти з is_exclusive = true.
GET /properties/map: Оптимізований ендпоінт для карти. Повертає лише координати, ціну та ID. Використовує гео-запити PostGIS для пошуку в видимій області.
GET /properties/exclusive: (Захищений, роль: INVESTOR) Повертає список ексклюзивних об'єктів.
GET /properties/:id: Повертає повну інформацію про один об'єкт.
POST /users/me/favorites/:propertyId: (Захищений) Додає об'єкт у вибране.
DELETE /users/me/favorites/:propertyId: (Захищений) Видаляє з вибраного.
3.5. Модуль Leads (Заявки)
Завдання: Управління життєвим циклом заявок.
API Ендпоінти:
POST /leads: Створює нову заявку.
Логіка: Валідує дані. Якщо user_id відсутній, створює заявку для гостя. Викликає AmoCrmService для створення угоди. Поміщає заявку в "пул" (статус NEW).
GET /leads/pool: (Захищений, роль: BROKER) Повертає список заявок зі статусом NEW.
POST /leads/:id/take: (Захищений, роль: BROKER)
Логіка: Атомарно (в транзакції) змінює статус заявки на IN_PROGRESS та призначає broker_id. Якщо заявку вже взяв інший брокер, повертає помилку. Оновлює відповідального в AMO CRM. Відправляє Push-сповіщення клієнту.
GET /leads/my: (Захищений, ролі: BROKER, CLIENT) Повертає список заявок, що належать користувачу.
POST /integrations/amo-webhook: (Спеціальний, захищений API-ключем) Приймає вебхуки від AMO CRM для оновлення статусів заявок.
3.6. Модуль BrokerTools (Інструменти Брокера)
Завдання: Реалізація CRM, підбірок, генерації PDF.
API Ендпоінти: (Всі захищені, роль: BROKER)
GET, POST, PUT /crm/clients: CRUD операції для управління клієнтами.
GET, POST /selections: Створення та перегляд підбірок.
POST /selections/:id/properties: Додавання об'єктів до підбірки.
POST /selections/:id/generate-pdf:
Логіка: Асинхронна операція. Збирає дані про об'єкти, брокера. Використовує бібліотеку (напр., puppeteer або pdfkit) для генерації PDF на основі HTML-шаблону. Зберігає файл в Amazon S3 та повертає посилання на нього.
3.7. Модуль InvestorTools (Інструменти Інвестора)
Завдання: Реалізація портфеля, дашборду, документів.
API Ендпоінти: (Всі захищені, роль: INVESTOR)
GET /investor/dashboard: Агрегує дані для дашборду (сума інвестицій, розрахунок ROI).
GET /investor/portfolio: Повертає список інвестицій.
GET /investor/documents: Повертає список документів, що належать інвестору, з Amazon S3.
GET /investor/documents/:id/download: Генерує тимчасове, захищене посилання (presigned URL) для безпечного завантаження файлу з S3.

3.8. Модуль Users (Профіль Користувача)
Завдання: Управління профілем, налаштуваннями, вибраним.
API Ендпоінти: (Всі захищені, авторизовані користувачі)
GET /users/me: Отримати профіль поточного користувача.
PUT /users/me: Оновити дані профілю (ім'я, прізвище, телефон).
PUT /users/me/password: Змінити пароль (потребує старий пароль для підтвердження).
POST /users/me/avatar: Завантажити аватар (multipart/form-data), зберегти в S3, оновити URL в БД.
GET /users/me/favorites: Отримати список вибраних об'єктів користувача.
GET /users/me/history: Історія переглядів (опціонально, для клієнтів).

3.9. Модуль Notifications (Сповіщення)
Завдання: Управління push-сповіщеннями, історією, налаштуваннями.
API Ендпоінти: (Всі захищені)
POST /devices/register: Реєстрація FCM токену пристрою при вході/встановленні додатку.
DELETE /devices/:token: Видалення токену при logout або видаленні додатку.
GET /notifications: Отримати історію push-сповіщень користувача (пагінація).
PUT /notifications/:id/read: Позначити конкретне сповіщення як прочитане.
PUT /notifications/read-all: Позначити всі сповіщення як прочитані.
GET /notifications/settings: Отримати налаштування сповіщень користувача.
PUT /notifications/settings: Оновити налаштування (типи сповіщень, тихі години).

3.10. Модуль Share (Поділитися)
Завдання: Генерація Dynamic Links для поширення об'єктів.
API Ендпоінти:
POST /share/generate: Генерує Firebase Dynamic Link для об'єкта. Параметри: { propertyId, userId }.
GET /share/:shareId: Отримання даних про об'єкт для відображення на landing page (для неавторизованих).

3.11. Модуль Admin (Адміністративна Панель)
Завдання: Повне управління платформою через веб-панель.
API Ендпоінти: (Всі захищені, роль: ADMIN)

Управління користувачами:
GET /admin/users: Список користувачів з фільтрами (роль, статус), пагінацією, пошуком.
GET /admin/users/:id: Детальна інформація про користувача.
PUT /admin/users/:id/approve: Підтвердити реєстрацію брокера/інвестора (статус PENDING → ACTIVE). Відправити email.
PUT /admin/users/:id/reject: Відхилити реєстрацію (статус PENDING → REJECTED, видалити через 30 днів). Відправити email.
PUT /admin/users/:id/block: Заблокувати користувача (статус ACTIVE → BLOCKED).
PUT /admin/users/:id/unblock: Розблокувати користувача (статус BLOCKED → ACTIVE).

Управління нерухомістю:
GET /admin/properties: Список всіх об'єктів з фільтрами та модерацією.
POST /admin/properties: Ручне додавання ексклюзивного об'єкта.
PUT /admin/properties/:id: Редагувати об'єкт.
PUT /admin/properties/:id/exclusive: Позначити/зняти позначку "ексклюзивний".
DELETE /admin/properties/:id: Архівувати об'єкт (soft delete).

Управління заявками:
GET /admin/leads: Всі заявки з фільтрами (статус, дата, брокер).
POST /admin/leads/:id/assign: Вручну призначити заявку конкретному брокеру.
GET /admin/leads/stats: Статистика по заявкам (нові, в роботі, закриті).

Управління контентом:
GET /admin/content/news: Список новин та навчальних матеріалів.
POST /admin/content/news: Створити новину/матеріал.
PUT /admin/content/news/:id: Редагувати.
DELETE /admin/content/news/:id: Видалити.

Аналітика та звіти:
GET /admin/analytics/dashboard: Дашборд з ключовими метриками (кількість користувачів, заявок, об'єктів).
GET /admin/analytics/users: Статистика користувачів (реєстрації по датах, по ролях).
GET /admin/analytics/properties: Статистика об'єктів (найпопулярніші, по локаціях).
GET /admin/analytics/leads: Конверсія заявок, середній час обробки.

Push-сповіщення:
POST /admin/notifications/broadcast: Масова розсилка push-сповіщення (з фільтрами по ролях, статусах).

ПРИМІТКА: Детальна розширена специфікація всіх процесів, Guards, Security, Performance та інших аспектів міститься в окремому файлі back-end-extended.md