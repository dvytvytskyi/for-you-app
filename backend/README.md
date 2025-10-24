# For You Real Estate - Backend

REST API на NestJS для платформи нерухомості.

## 🚀 Швидкий старт

### 1. Встановлення залежностей

```bash
npm install
```

### 2. Запуск бази даних

```bash
# З root директорії проекту
docker-compose up -d
```

Це запустить:
- PostgreSQL на порту 5432
- Redis на порту 6379
- pgAdmin на порту 5050 (опціонально)

### 3. Запуск міграцій

```bash
# Створити нову міграцію (після зміни entities)
npm run migration:generate

# Запустити міграції
npm run migration:run

# Відкотити останню міграцію
npm run migration:revert
```

### 4. Запуск сервера

```bash
# Development mode з hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

Сервер буде доступний на `http://localhost:3000`

---

## 🏗️ Структура проекту

```
src/
├── auth/                   # Модуль автентифікації
├── users/                  # Модуль користувачів
├── properties/             # Модуль нерухомості
├── leads/                  # Модуль заявок
├── integrations/           # Зовнішні інтеграції
│   └── amo-crm/            # AMO CRM інтеграція
├── common/                 # Спільні utilities
│   ├── decorators/         # Custom decorators
│   ├── filters/            # Exception filters
│   ├── guards/             # Auth guards
│   ├── interceptors/       # Interceptors
│   └── pipes/              # Validation pipes
├── config/                 # Конфігурація
│   ├── database.config.ts  # TypeORM config
│   ├── redis.config.ts     # Redis config
│   └── typeorm.config.ts   # CLI config для міграцій
├── database/
│   ├── entities/           # TypeORM entities
│   └── migrations/         # Database migrations
├── app.module.ts
└── main.ts
```

---

## 🔧 Доступні команди

### Розробка
```bash
npm run start          # Звичайний режим
npm run start:dev      # Watch mode (рекомендовано)
npm run start:debug    # Debug mode
```

### Білд
```bash
npm run build          # Production build
npm run start:prod     # Запуск production
```

### Тести
```bash
npm run test           # Unit tests
npm run test:watch     # Watch mode
npm run test:cov       # Coverage
npm run test:e2e       # E2E tests
```

### Міграції
```bash
npm run migration:generate  # Генерувати міграцію
npm run migration:create    # Створити порожню міграцію
npm run migration:run       # Запустити міграції
npm run migration:revert    # Відкотити міграцію
```

### Linting & Formatting
```bash
npm run lint           # Перевірка коду
npm run format         # Форматування коду
```

---

## 🗄️ База даних

### Підключення до PostgreSQL

**Через pgAdmin:**
- URL: http://localhost:5050
- Email: admin@admin.com
- Password: admin

**Через psql:**
```bash
psql -h localhost -p 5432 -U postgres -d for_you_real_estate
```

### Створення першої міграції

Після того як БД запущена:

```bash
# 1. Згенерувати міграцію на базі entities
npm run migration:generate

# 2. Перевірити згенеровану міграцію в src/database/migrations/

# 3. Запустити міграцію
npm run migration:run
```

---

## 📝 Environment Variables

Скопіюй `.env.example` в `.env` та налаштуй:

```env
# База даних
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=for_you_real_estate

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

# AMO CRM Integration
AMO_DOMAIN=your-subdomain.amocrm.ru
AMO_CLIENT_ID=your-client-id
AMO_CLIENT_SECRET=your-client-secret
AMO_REDIRECT_URI=http://localhost:3000/api/v1/integrations/amo-crm/callback
AMO_ACCOUNT_ID=your-account-id
AMO_API_DOMAIN=api-b.amocrm.ru
```

📖 **[Детальна інструкція по налаштуванню AMO CRM](./docs/AMO_CRM_SETUP.md)**

---

## 🔍 Health Check

Перевір що сервер працює:

```bash
curl http://localhost:3000/api/v1/health
```

Відповідь:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

---

## 📚 API Documentation

Після запуску сервера, Swagger документація доступна на:

```
http://localhost:3000/api/v1/docs
```

---

## 🐛 Troubleshooting

### База даних не підключається

```bash
# Перевір що контейнери запущені
docker ps

# Перезапусти контейнери
docker-compose down
docker-compose up -d

# Подивись логи
docker-compose logs postgres
```

### Помилка міграції

```bash
# Відкоти останню міграцію
npm run migration:revert

# Видали згенеровану міграцію і спробуй знову
rm src/database/migrations/[timestamp]-*.ts
npm run migration:generate
```

---

## 📖 Додаткові ресурси

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Детальна документація проекту](../back-end-extended.md)

---

**Готовий до розробки! 🚀**

