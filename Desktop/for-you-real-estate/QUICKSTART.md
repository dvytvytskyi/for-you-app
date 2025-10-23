# ⚡ Швидкий Старт

Цей гід допоможе вам запустити проект за 5 хвилин!

## 📋 Передумови

Переконайтеся, що встановлено:

- ✅ **Node.js 20+** — [Завантажити](https://nodejs.org/)
- ✅ **Docker Desktop** — [Завантажити](https://www.docker.com/products/docker-desktop)

## 🚀 Автоматичне налаштування

### Крок 1: Автоматична установка

```bash
./scripts/setup.sh
```

Цей скрипт:
- Запустить Docker контейнери (PostgreSQL + Redis)
- Створить `.env` файли
- Встановить всі залежності

### Крок 2: Запуск проекту

```bash
./scripts/start.sh
```

або вручну в окремих терміналах:

**Термінал 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Термінал 2 - Admin Panel:**
```bash
cd admin-panel
npm run dev
```

## 🎉 Готово!

### Backend API
- 🌐 URL: http://localhost:3000
- 📚 Swagger Docs: http://localhost:3000/api/v1/docs
- ✅ Health Check: http://localhost:3000/api/v1/health

### Admin Panel
- 🌐 URL: http://localhost:3001

### База даних
- 🐘 PostgreSQL: localhost:5432
- 🔴 Redis: localhost:6379

## 📦 Корисні команди

### Backend

```bash
cd backend

# Розробка з hot-reload
npm run start:dev

# Production збірка
npm run build
npm run start:prod

# Тести
npm run test

# Лінтинг та форматування
npm run lint
npm run format
```

### Admin Panel

```bash
cd admin-panel

# Розробка
npm run dev

# Production збірка
npm run build
npm run start

# Лінтинг
npm run lint
```

### Docker

```bash
# Запуск всіх сервісів
docker-compose up -d

# Зупинка
docker-compose down

# Перегляд логів
docker-compose logs -f

# Перезапуск PostgreSQL
docker-compose restart postgres
```

## 🔧 Налаштування

### Backend (.env)

Відредагуйте `backend/.env` для налаштування:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=for_you_real_estate
JWT_SECRET=your-secret-key
```

### Admin Panel (.env)

Відредагуйте `admin-panel/.env`:

```env
API_URL=http://localhost:3000/api/v1
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret
```

## ❓ Проблеми?

### Docker не запускається

```bash
# Перевірте статус Docker
docker ps

# Перезапустіть Docker Desktop
# та спробуйте знову
docker-compose up -d
```

### Порт зайнятий

Якщо порт 3000 або 3001 зайнятий:

```bash
# Знайдіть процес
lsof -i :3000

# Зупиніть процес
kill -9 <PID>
```

### База даних не підключається

```bash
# Перевірте контейнер PostgreSQL
docker logs for-you-real-estate-postgres

# Перезапустіть
docker-compose restart postgres
```

## 📚 Наступні кроки

1. Прочитайте повну [документацію](./README.md)
2. Ознайомтеся з [гідом для контриб'юторів](./CONTRIBUTING.md)
3. Перегляньте [Swagger документацію](http://localhost:3000/api/v1/docs)

---

**Щасливого кодування! 🎉**

