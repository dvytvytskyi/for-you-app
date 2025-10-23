# 🏢 For You Real Estate

Кросплатформовий мобільний додаток та веб-панель адміністратора для управління нерухомістю.

## 📋 Зміст

- [Про проект](#-про-проект)
- [Технологічний стек](#-технологічний-стек)
- [Структура проекту](#-структура-проекту)
- [📊 Планування та Прогрес](#-планування-та-прогрес)
- [Початок роботи](#-початок-роботи)
- [Розробка](#-розробка)
- [Розгортання](#-розгортання)

## 📖 Про проект

**For You Real Estate** — це комплексна платформа для роботи з нерухомістю, призначена для трьох ключових ролей:

- **Інвестори** — управління інвестиційним портфелем нерухомості
- **Брокери** — автоматизація робочих процесів, CRM, генератор презентацій
- **Клієнти** — зручний пошук та оформлення заявок на нерухомість

### Цілі проекту

- ✅ Кросплатформовий мобільний додаток (iOS + Android)
- ✅ Веб-панель адміністратора
- ✅ REST API для інтеграцій
- ✅ Геолокаційний пошук з PostGIS
- ✅ Push-сповіщення
- ✅ Інтеграція з зовнішніми джерелами даних

## 🚀 Технологічний стек

### Backend
- **NestJS 10.x** — серверний фреймворк
- **TypeScript 5.x** — мова програмування
- **PostgreSQL 15+ з PostGIS** — база даних з геопросторовими даними
- **Redis** — кешування та черги
- **TypeORM** — ORM для роботи з БД
- **JWT** — автентифікація
- **Swagger** — API документація

### Frontend (Admin Panel)
- **Next.js 14** — React фреймворк
- **React 18** — UI бібліотека
- **TypeScript** — типізація
- **Ant Design** — UI компоненти
- **SWR** — data fetching
- **Zustand** — state management

### Mobile (У планах)
- **Flutter 3.x** — мобільний фреймворк
- **Dart 3.x** — мова програмування
- **BLoC/Riverpod** — управління станом
- **Clean Architecture** — архітектурний підхід

### Інфраструктура
- **Docker** — контейнеризація
- **Docker Compose** — оркестрація
- **AWS/GCP** — хмарний провайдер
- **S3/Cloud Storage** — зберігання файлів
- **Firebase** — push-сповіщення

## 📊 Планування та Прогрес

### 📄 Документи Планування

| Файл | Призначення | Частота оновлення |
|------|-------------|-------------------|
| **[DEVELOPMENT-PLAN.md](./DEVELOPMENT-PLAN.md)** | 📋 Детальний план розробки з checkpoints | Після кожної сесії |
| **[PROGRESS-TRACKER.md](./PROGRESS-TRACKER.md)** | 📊 Швидкий доступ до прогресу | Щоденно |
| **progress/session-XX.md** | 📝 Детальні нотатки з кожної сесії | Після сесії |

### 🎯 Поточний Статус

Дивіться актуальний прогрес в [PROGRESS-TRACKER.md](./PROGRESS-TRACKER.md)

### 📝 Як працювати з планом

1. **Перед початком сесії:** Переглянути [DEVELOPMENT-PLAN.md](./DEVELOPMENT-PLAN.md), поточний етап
2. **Під час сесії:** Відмічати виконані завдання (checkboxes)
3. **Після сесії:** 
   - Скопіювати `progress/SESSION-TEMPLATE.md` → `progress/session-XX.md`
   - Заповнити результати
   - Оновити [PROGRESS-TRACKER.md](./PROGRESS-TRACKER.md)

---

## 📁 Структура проекту

```
for-you-real-estate/
├── 📋 DEVELOPMENT-PLAN.md      # Основний план розробки
├── 📊 PROGRESS-TRACKER.md      # Швидкий трекер прогресу
├── progress/                   # Нотатки з кожної сесії
│   ├── SESSION-TEMPLATE.md
│   └── session-XX.md
│
├── backend/                    # NestJS Backend API
│   ├── src/
│   │   ├── auth/              # Автентифікація та авторизація
│   │   ├── users/             # Управління користувачами
│   │   ├── properties/        # Управління нерухомістю
│   │   ├── leads/             # Управління заявками
│   │   ├── notifications/     # Push-сповіщення
│   │   ├── content/           # Управління контентом
│   │   ├── common/            # Спільні модулі (guards, decorators, filters)
│   │   ├── config/            # Конфігурація
│   │   └── database/          # Entities, міграції
│   ├── Dockerfile
│   └── package.json
│
├── admin-panel/               # Next.js Веб-панель адміністратора
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   ├── components/       # React компоненти
│   │   ├── lib/              # Утиліти та API клієнт
│   │   ├── hooks/            # Custom React hooks
│   │   ├── types/            # TypeScript типи
│   │   └── styles/           # Стилі
│   └── package.json
│
├── mobile/                    # Flutter мобільний додаток (планується)
│   └── (структура Flutter проекту)
│
├── docker-compose.yml         # Docker композиція сервісів
└── README.md                  # Ця документація
```

## 🏁 Початок роботи

### Передумови

Переконайтеся, що у вас встановлено:

- **Node.js** >= 20.x ([Завантажити](https://nodejs.org/))
- **Docker Desktop** ([Завантажити](https://www.docker.com/products/docker-desktop))
- **Git** ([Завантажити](https://git-scm.com/))

### Швидкий старт

#### 1. Клонуйте репозиторій

```bash
git clone <repository-url>
cd for-you-real-estate
```

#### 2. Запустіть Docker контейнери (PostgreSQL + Redis)

```bash
docker-compose up -d
```

Це запустить:
- PostgreSQL з PostGIS на порту `5432`
- Redis на порту `6379`

#### 3. Налаштуйте Backend

```bash
cd backend

# Скопіюйте файл середовища
cp .env.example .env

# Встановіть залежності
npm install

# Запустіть у режимі розробки
npm run start:dev
```

Backend буде доступний на `http://localhost:3000`

Swagger документація: `http://localhost:3000/api/v1/docs`

#### 4. Налаштуйте Admin Panel

```bash
cd admin-panel

# Скопіюйте файл середовища
cp .env.example .env

# Встановіть залежності
npm install

# Запустіть у режимі розробки
npm run dev
```

Адмін панель буде доступна на `http://localhost:3001`

## 🛠 Розробка

### Backend

```bash
cd backend

# Режим розробки з hot-reload
npm run start:dev

# Збірка проекту
npm run build

# Production режим
npm run start:prod

# Тести
npm run test

# Лінтинг
npm run lint

# Форматування коду
npm run format
```

### Робота з базою даних

```bash
# Генерація міграції
npm run migration:generate -- src/database/migrations/MigrationName

# Застосування міграцій
npm run migration:run

# Відкат міграції
npm run migration:revert
```

### Admin Panel

```bash
cd admin-panel

# Режим розробки
npm run dev

# Збірка для production
npm run build

# Запуск production білду
npm run start

# Лінтинг
npm run lint

# Перевірка типів
npm run type-check
```

## 🐳 Docker

### Запуск тільки баз даних

```bash
docker-compose up -d postgres redis
```

### Запуск всього стеку (коли буде готово)

```bash
docker-compose up -d
```

### Зупинка контейнерів

```bash
docker-compose down
```

### Перегляд логів

```bash
# Всі сервіси
docker-compose logs -f

# Тільки PostgreSQL
docker-compose logs -f postgres

# Тільки Redis
docker-compose logs -f redis
```

## 📚 API Документація

Після запуску backend сервера, Swagger документація доступна за адресою:

**http://localhost:3000/api/v1/docs**

## 🔒 Безпека

- JWT токени для автентифікації
- Helmet для захисту HTTP headers
- Rate limiting через Throttler
- Валідація даних через class-validator
- CORS налаштування

## 🌍 Змінні середовища

### Backend (.env)

```env
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=for_you_real_estate

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
```

### Admin Panel (.env)

```env
API_URL=http://localhost:3000/api/v1
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret
```

## 📞 Контакти

Для питань та пропозицій звертайтеся до команди розробки.

---

**Версія:** 1.0.0  
**Ліцензія:** Private

