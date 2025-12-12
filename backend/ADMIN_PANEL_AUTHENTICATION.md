# 🔐 Авторизація для CRM в Admin Panel Backend

## 📋 Огляд

Для роботи CRM в мобільному додатку потрібні **два рівні авторизації**:

1. **JWT авторизація** - для доступу до endpoints (обов'язкова)
2. **AMO CRM OAuth** - для синхронізації з AMO CRM (опціональна)

---

## 1️⃣ JWT Авторизація (Обов'язкова)

### Як працює:

1. **Користувач (агент/брокер) входить в додаток:**
   - Логін через `POST /api/auth/login`
   - Отримує JWT токен
   - Токен зберігається в SecureStore мобільного додатку

2. **При запиті до `/api/v1/leads`:**
   - Мобільний додаток автоматично додає токен в header:
     ```
     Authorization: Bearer <jwt_token>
     ```
   - Backend перевіряє токен через middleware `authenticate`
   - Отримує інформацію про користувача (`user.id`, `user.role`)

3. **Фільтрація даних:**
   - Брокери (`role === 'BROKER'`) бачать тільки свої leads (`brokerId === user.id`)
   - Адміни бачать всі leads

### Endpoints, які вимагають JWT:

- ✅ `GET /api/v1/leads` - список leads
- ✅ `GET /api/v1/leads/:id` - деталі lead
- ✅ `GET /api/amo-crm/status` - статус AMO CRM
- ✅ `POST /api/amo-crm/exchange-code` - обмін OAuth code
- ✅ `POST /api/amo-crm/disconnect` - відключення AMO CRM

---

## 2️⃣ AMO CRM OAuth Авторизація (Опціональна)

### Коли потрібна:

- Якщо потрібно синхронізувати leads з AMO CRM
- Якщо потрібно отримувати pipelines/stages з AMO CRM
- Якщо потрібно створювати/оновлювати leads в AMO CRM

### Як працює:

1. **Перевірка статусу:**
   ```
   GET /api/amo-crm/status
   Authorization: Bearer <jwt_token>
   ```
   Повертає: `{ connected: false, hasTokens: false }`

2. **Якщо не підключено - показується екран авторизації:**
   - Мобільний додаток відкриває OAuth URL: `https://www.amocrm.ru/oauth?...`
   - Користувач авторизується в AMO CRM
   - AMO CRM перенаправляє на: `https://admin.foryou-realestate.com/api/amo-crm/callback?code=...`

3. **Callback обробляє код:**
   - Backend обмінює `code` на токени через AMO CRM API
   - Зберігає токени для **конкретного користувача** (`user_id`)
   - Перенаправляє на deep link: `foryoure://amo-crm/callback?code=...`

4. **Мобільний додаток завершує авторизацію:**
   ```
   POST /api/amo-crm/exchange-code
   Authorization: Bearer <jwt_token>
   Body: { code: "..." }
   ```
   - Backend зберігає токени для поточного користувача

5. **Тепер користувач підключений:**
   ```
   GET /api/amo-crm/status
   Authorization: Bearer <jwt_token>
   ```
   Повертає: `{ connected: true, hasTokens: true }`

### Важливо:

- **Токени AMO CRM зберігаються для кожного користувача окремо**
- Кожен агент/брокер має свої токени AMO CRM
- Endpoint `/api/v1/leads` може працювати **без AMO CRM авторизації** (повертає leads з локальної БД)

---

## 🔄 Повний Flow

```
1. Користувач входить в додаток
   ↓
   JWT токен зберігається
   ↓
2. Користувач відкриває CRM
   ↓
   Перевірка: GET /api/amo-crm/status (з JWT токеном)
   ↓
3. Якщо AMO CRM не підключено:
   ↓
   Показується екран авторизації AMO CRM
   ↓
   OAuth авторизація → Callback → Exchange code
   ↓
   AMO CRM токени зберігаються для користувача
   ↓
4. Завантаження leads:
   ↓
   GET /api/v1/leads (з JWT токеном)
   ↓
   Backend перевіряє JWT → отримує user.id
   ↓
   Повертає leads для цього користувача
```

---

## ✅ Що має бути на Backend

### 1. Middleware `authenticate`

**Файл:** `admin-panel-backend/src/middleware/auth.ts`

```typescript
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // Перевірка JWT токену
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findOne({ where: { id: decoded.userId } });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Додаємо користувача до request
    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
```

### 2. Endpoint `/api/v1/leads` з авторизацією

```typescript
router.get(
  '/',
  authenticate, // ⚠️ Обов'язкова JWT авторизація
  async (req: Request, res: Response) => {
    const user = (req as any).user; // Користувач з middleware
    
    // Фільтрація для брокерів
    if (user.role === 'BROKER') {
      queryBuilder.andWhere('lead.brokerId = :userId', { userId: user.id });
    }
    
    // ... решта коду
  }
);
```

### 3. AMO CRM токени з `user_id`

**Entity:** `AmoCrmToken`

```typescript
@Entity('amo_crm_tokens')
export class AmoCrmToken {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string; // ⚠️ Важливо: токени для конкретного користувача
  
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
  
  // ... інші поля
}
```

---

## 🧪 Тестування

### Тест 1: JWT авторизація

```bash
# Без токену (має повернути 401)
curl -X GET "https://admin.foryou-realestate.com/api/v1/leads"

# З токеном (має працювати)
curl -X GET "https://admin.foryou-realestate.com/api/v1/leads" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Тест 2: AMO CRM авторизація

```bash
# Перевірка статусу
curl -X GET "https://admin.foryou-realestate.com/api/amo-crm/status" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Обмін коду (після OAuth)
curl -X POST "https://admin.foryou-realestate.com/api/amo-crm/exchange-code" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code": "oauth_code_from_amo"}'
```

---

## ⚠️ Важливі моменти

1. **JWT авторизація обов'язкова** для всіх CRM endpoints
2. **AMO CRM авторизація опціональна** - leads можуть бути з локальної БД
3. **Токени AMO CRM зберігаються для кожного користувача окремо**
4. **Брокери бачать тільки свої leads** (фільтрація по `brokerId`)
5. **Адміни бачать всі leads**

---

**Останнє оновлення:** Січень 2025
