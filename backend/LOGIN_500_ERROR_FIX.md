# 🔧 Виправлення 500 помилки при логіні

## ✅ ПРОБЛЕМА ВИРІШЕНА

**Причина:** PostgreSQL контейнер був зупинений, backend не міг підключитися до БД.

**Рішення:** Запущено PostgreSQL контейнер, оновлено DATABASE_URL.

**Статус:** ✅ Endpoint `POST /api/auth/login` працює коректно.

---

## 🐛 Проблема (вирішена)

Мобільний додаток отримував **500 Internal Server Error** при спробі увійти через `POST /api/auth/login`.

**Email:** `broker1@test.com`  
**Password:** `Test123!`

---

## 🔍 Діагностика

### 1. Перевірка endpoint

Мобільний додаток робить запит:
```
POST https://admin.foryou-realestate.com/api/auth/login
Content-Type: application/json

{
  "email": "broker1@test.com",
  "password": "Test123!"
}
```

**Очікувана відповідь:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "email": "broker1@test.com",
      "role": "BROKER",
      "status": "ACTIVE"
    }
  }
}
```

---

## ⚠️ Можливі причини 500 помилки

### ✅ 1. Проблеми з базою даних (ВИРІШЕНО)
- ❌ **PostgreSQL контейнер був зупинений** ← Це була причина!
- ❌ **Неправильний DATABASE_URL** (використовувався IP замість імені контейнера)
- ✅ **Рішення:** Запущено PostgreSQL контейнер, оновлено DATABASE_URL

### 2. Endpoint не існує на admin-panel-backend
- Endpoint `/api/auth/login` може бути не створений
- Або неправильно підключений до server

### 3. Неправильний формат запиту
- Backend очікує інший формат (наприклад, `emailOrPhone` замість `email`)
- Відсутні обов'язкові поля

### 4. Помилка в обробці на backend
- Помилка при перевірці паролю (bcrypt)
- Помилка при генерації JWT токену
- Помилка при доступі до бази даних
- Помилка при логуванні activity log

### 5. Інші проблеми з базою даних
- Користувач не існує
- Відсутні обов'язкові поля в таблиці `users`

---

## ✅ Рішення (ВИКОНАНО)

### ✅ Крок 0: Перевірка PostgreSQL контейнера (ВИРІШЕНО)

**Проблема:** PostgreSQL контейнер був зупинений.

**Рішення:**
```bash
# Запустити PostgreSQL контейнер
docker-compose up -d postgres

# Перевірити статус
docker-compose ps postgres
```

**Оновлення DATABASE_URL:**
```env
# Було (неправильно):
DATABASE_URL=postgresql://user:password@172.17.0.2:5432/database

# Стало (правильно):
DATABASE_URL=postgresql://user:password@postgres:5432/database
# або
DATABASE_URL=postgresql://user:password@localhost:5432/database
```

**Результат:** ✅ Backend підключений до БД, endpoint працює.

---

## ✅ Рішення (для майбутніх випадків)

### Крок 1: Перевірка endpoint на admin-panel-backend

**Файл:** `admin-panel-backend/src/routes/auth.routes.ts`

Переконайтеся, що endpoint існує:

```typescript
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Знайти користувача
    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Перевірити пароль
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Генерувати JWT токен
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Повернути відповідь
    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
          name: user.name,
        },
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message, // Тільки в development!
    });
  }
});
```

---

### Крок 2: Перевірка підключення до server

**Файл:** `admin-panel-backend/src/server.ts`

Переконайтеся, що route підключено:

```typescript
import authRoutes from './routes/auth.routes';

// Після middleware:
app.use('/api/auth', authRoutes);
```

---

### Крок 3: Перевірка бази даних

Переконайтеся, що:
- [ ] Користувач `broker1@test.com` існує в таблиці `users`
- [ ] Пароль правильно захешований (bcrypt)
- [ ] Поле `passwordHash` існує та заповнене
- [ ] Поле `status` має значення `ACTIVE`

**SQL перевірка:**
```sql
SELECT id, email, status, role, password_hash IS NOT NULL as has_password
FROM users
WHERE email = 'broker1@test.com';
```

---

### Крок 4: Перевірка змінних оточення

**Файл:** `admin-panel-backend/.env`

Переконайтеся, що є:
```env
JWT_SECRET=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/database
```

---

### Крок 5: Додати детальне логування

Додайте логування для діагностики:

```typescript
router.post('/login', async (req: Request, res: Response) => {
  try {
    console.log('=== LOGIN REQUEST ===');
    console.log('Body:', { email: req.body.email, password: '***' });
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    console.log('🔍 Searching for user:', email);
    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    console.log('✅ User found:', user.id, user.email, user.role);
    console.log('🔐 Checking password...');

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    console.log('✅ Password valid');
    console.log('🔑 Generating token...');

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Token generated');
    console.log('📤 Sending response...');

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
          name: user.name,
        },
      },
    });
  } catch (error: any) {
    console.error('❌ LOGIN ERROR:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});
```

---

## 🧪 Тестування

### Тест 1: Перевірка endpoint

```bash
curl -X POST https://admin.foryou-realestate.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "broker1@test.com",
    "password": "Test123!"
  }'
```

### Тест 2: Перевірка з правильними даними

Створіть тестового користувача:

```sql
-- Перевірка чи користувач існує
SELECT * FROM users WHERE email = 'broker1@test.com';

-- Якщо не існує, створіть:
INSERT INTO users (id, email, password_hash, role, status, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'broker1@test.com',
  '$2b$10$...', -- bcrypt hash для 'Test123!'
  'BROKER',
  'ACTIVE',
  NOW(),
  NOW()
);
```

**Генерація bcrypt hash для паролю:**
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('Test123!', 10).then(h => console.log(h))"
```

---

## 📋 Чеклист виправлення

- [ ] Endpoint `/api/auth/login` існує на admin-panel-backend
- [ ] Route підключено до server (`app.use('/api/auth', authRoutes)`)
- [ ] Endpoint приймає `{ email, password }` (не `emailOrPhone`)
- [ ] Endpoint повертає правильний формат: `{ success: true, data: { token, user } }`
- [ ] Користувач існує в базі даних
- [ ] Пароль правильно захешований
- [ ] `JWT_SECRET` налаштований в `.env`
- [ ] База даних доступна
- [ ] Додано детальне логування для діагностики

---

## 🔍 Швидка діагностика

1. **Перевірте логи backend:**
   ```bash
   # На сервері admin-panel-backend
   tail -f logs/app.log
   # або
   pm2 logs admin-panel-backend
   ```

2. **Перевірте, чи endpoint відповідає:**
   ```bash
   curl -X POST https://admin.foryou-realestate.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test"}' \
     -v
   ```

3. **Перевірте формат відповіді:**
   - Має бути `{ success: true, data: { token, user } }`
   - НЕ має бути `{ user, accessToken }` (це формат main backend)

---

## ⚠️ Важливо

**Формат відповіді має бути:**
```json
{
  "success": true,
  "data": {
    "token": "...",
    "user": {...}
  }
}
```

**НЕ:**
```json
{
  "user": {...},
  "accessToken": "..."
}
```

Мобільний додаток очікує формат з `success` та `data.token`, `data.user`.

---

**Останнє оновлення:** Січень 2025
