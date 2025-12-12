# Створення тестового інвестора

## Спосіб 1: Через API (рекомендовано)

### Крок 1: Зареєструвати інвестора через API

```bash
curl -X POST http://88.99.38.25:3002/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "investor@test.com",
    "phone": "+971501234567",
    "password": "Investor123!",
    "firstName": "Investor",
    "lastName": "Test",
    "role": "INVESTOR"
  }'
```

### Крок 2: Активувати інвестора в базі даних

Підключитися до PostgreSQL та виконати:

```sql
UPDATE users 
SET status = 'ACTIVE' 
WHERE email = 'investor@test.com' AND role = 'INVESTOR';
```

## Спосіб 2: Прямо через базу даних

Підключитися до PostgreSQL та виконати SQL скрипт (потрібно згенерувати bcrypt hash):

```bash
# На сервері виконати Node.js скрипт для генерації hash:
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('Investor123!', 10).then(hash => console.log(hash));"
```

Потім вставити отриманий hash в SQL:

```sql
INSERT INTO users (
  email,
  phone,
  password_hash,
  first_name,
  last_name,
  role,
  status,
  created_at,
  updated_at
) VALUES (
  'investor@test.com',
  '+971501234567',
  'ЗГЕНЕРОВАНИЙ_HASH_ТУТ',  -- Вставити hash з Node.js команди
  'Investor',
  'Test',
  'INVESTOR',
  'ACTIVE',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET status = 'ACTIVE';
```

## Дані для входу

**Email:** `investor@test.com`  
**Phone:** `+971501234567`  
**Password:** `Investor123!`

**АБО**

**Email/Phone:** `investor@test.com`  
**Password:** `Investor123!`

## Нотатки

- При реєстрації через API, інвестор отримує статус `PENDING` - потрібно активувати через SQL
- Пароль має мінімум 8 символів, 1 велику літеру, 1 символ
- Email та phone повинні бути унікальними

