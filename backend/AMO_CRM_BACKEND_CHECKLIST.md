# ✅ Чеклист перевірки AMO CRM на Бекенді Адмінки

## 🔍 Що перевірити для мобільної авторизації

---

## 1. 📋 Endpoints (Routes)

### ✅ `GET /api/amo-crm/status`
**Перевірка:**
- [ ] Endpoint існує
- [ ] Доступний для **всіх авторизованих користувачів** (не тільки адмінів)
- [ ] Прибрано `requireAdmin` middleware
- [ ] Повертає статус для поточного користувача (не глобальний)

**Тест:**
```bash
curl -X GET https://admin.foryou-realestate.com/api/amo-crm/status \
  -H "Authorization: Bearer <user_jwt_token>"
```

**Очікувана відповідь:**
```json
{
  "success": true,
  "data": {
    "connected": false,
    "hasTokens": false,
    "domain": "reforyou.amocrm.ru",
    "accountId": "31920194"
  }
}
```

---

### ✅ `POST /api/amo-crm/exchange-code`
**Перевірка:**
- [ ] Endpoint існує
- [ ] Приймає `{ code: string }` в body
- [ ] Обмінює code на токени через AMO CRM API
- [ ] Зберігає токени для поточного користувача (не глобально)
- [ ] Повертає успішну відповідь

**Тест:**
```bash
curl -X POST https://admin.foryou-realestate.com/api/amo-crm/exchange-code \
  -H "Authorization: Bearer <user_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "authorization_code_from_amo"
  }'
```

**Очікувана відповідь:**
```json
{
  "success": true,
  "message": "AMO CRM successfully connected"
}
```

---

### ✅ `POST /api/amo-crm/disconnect`
**Перевірка:**
- [ ] Endpoint існує
- [ ] Видаляє токени для поточного користувача
- [ ] Повертає успішну відповідь

**Тест:**
```bash
curl -X POST https://admin.foryou-realestate.com/api/amo-crm/disconnect \
  -H "Authorization: Bearer <user_jwt_token>"
```

**Очікувана відповідь:**
```json
{
  "success": true,
  "message": "AMO CRM disconnected"
}
```

---

### ✅ `GET /api/amo-crm/callback`
**Перевірка:**
- [ ] Endpoint існує
- [ ] Приймає `code` та `state` з query параметрів
- [ ] Обмінює code на токени
- [ ] **ВАЖЛИВО:** Перенаправляє на deep link `foryoure://amo-crm/callback?code=...` (не повертає JSON!)

**Тест:**
```bash
curl -I "https://admin.foryou-realestate.com/api/amo-crm/callback?code=test_code&state=test_state"
```

**Очікувана відповідь:**
```
HTTP/1.1 302 Found
Location: foryoure://amo-crm/callback?code=test_code&state=test_state
```

**АБО** (якщо використовується HTML redirect):
```html
<!DOCTYPE html>
<html>
  <head>
    <script>
      window.location.href = 'foryoure://amo-crm/callback?code=...';
    </script>
  </head>
</html>
```

---

## 2. 🗄️ База даних

### ✅ Таблиця `amo_crm_tokens`
**Перевірка:**
- [ ] Колонка `user_id` існує
- [ ] `user_id` має тип `UUID`
- [ ] `user_id` має foreign key на `users(id)`
- [ ] Існує індекс `idx_amo_crm_tokens_user_id`
- [ ] Існує унікальний індекс `idx_amo_crm_tokens_user_id_unique`

**SQL перевірка:**
```sql
-- Перевірити структуру таблиці
\d amo_crm_tokens

-- Перевірити індекси
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'amo_crm_tokens';

-- Перевірити foreign key
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'amo_crm_tokens';
```

---

## 3. 🔧 Service (AmoCrmService)

### ✅ Метод `getUserConnectionStatus(userId: string)`
**Перевірка:**
- [ ] Метод існує
- [ ] Приймає `userId` як параметр
- [ ] Шукає токени для конкретного користувача
- [ ] Повертає `{ connected, hasTokens, domain, accountId }`

---

### ✅ Метод `exchangeCodeForUser(userId: string, code: string)`
**Перевірка:**
- [ ] Метод існує
- [ ] Обмінює code на токени через AMO CRM API
- [ ] Викликає `saveTokensForUser()` для збереження

---

### ✅ Метод `saveTokensForUser(userId: string, authData: AmoAuthResponse)`
**Перевірка:**
- [ ] Метод існує
- [ ] Зберігає токени з `userId`
- [ ] Оновлює існуючі токени або створює нові

---

### ✅ Метод `disconnectUser(userId: string)`
**Перевірка:**
- [ ] Метод існує
- [ ] Видаляє токени для конкретного користувача

---

### ✅ Метод `getAccessToken(userId?: string)`
**Перевірка:**
- [ ] Метод підтримує опціональний `userId`
- [ ] Якщо `userId` передано - отримує токен для користувача
- [ ] Якщо `userId` не передано - використовує глобальний токен (для адмінів)

---

## 4. 🔐 OAuth налаштування

### ✅ Redirect URI в AMO CRM
**Перевірка:**
- [ ] В налаштуваннях інтеграції AMO CRM зареєстрований:
  ```
  https://admin.foryou-realestate.com/api/amo-crm/callback
  ```

**Як перевірити:**
1. Зайдіть в AMO CRM → Налаштування → Інтеграції → API
2. Знайдіть інтеграцію з Client ID: `2912780f-a1e4-4d5d-a069-ee01422d8bef`
3. Перевірте Redirect URI

---

### ✅ Client ID та Client Secret
**Перевірка:**
- [ ] В `.env` файлі є:
  ```env
  AMO_CLIENT_ID=2912780f-a1e4-4d5d-a069-ee01422d8bef
  AMO_CLIENT_SECRET=<ваш_secret>
  AMO_DOMAIN=reforyou.amocrm.ru
  AMO_ACCOUNT_ID=31920194
  ```

---

## 5. 🧪 Повний тест OAuth Flow

### Крок 1: Перевірити статус
```bash
curl -X GET https://admin.foryou-realestate.com/api/amo-crm/status \
  -H "Authorization: Bearer <user_jwt_token>"
```
**Очікується:** `connected: false`

---

### Крок 2: Отримати OAuth URL
В мобільному додатку натиснути "Підключити AMO CRM"

**Очікується:** Відкривається браузер з URL:
```
https://www.amocrm.ru/oauth?client_id=2912780f-a1e4-4d5d-a069-ee01422d8bef&state=...&mode=popup
```

**Якщо відкривається `reforyou.amocrm.ru`** - проблема в мобільному додатку (неправильний URL)

---

### Крок 3: Авторизація
Користувач авторизується в AMO CRM

**Очікується:** AMO CRM перенаправляє на:
```
https://admin.foryou-realestate.com/api/amo-crm/callback?code=...&state=...
```

---

### Крок 4: Callback перенаправляє
**Очікується:** Callback автоматично перенаправляє на:
```
foryoure://amo-crm/callback?code=...&state=...
```

**Якщо callback повертає JSON** - проблема в бекенді (не реалізовано redirect)

---

### Крок 5: Мобільний додаток обробляє deep link
**Очікується:** Додаток викликає `POST /api/amo-crm/exchange-code` з code

---

### Крок 6: Перевірити статус після авторизації
```bash
curl -X GET https://admin.foryou-realestate.com/api/amo-crm/status \
  -H "Authorization: Bearer <user_jwt_token>"
```
**Очікується:** `connected: true`

---

## 6. 🐛 Типові проблеми

### ❌ Проблема: "Cannot GET /api/amo-crm/status" (404)
**Причина:** Endpoint не існує або неправильний шлях
**Рішення:** Перевірити routes та підключення до server

---

### ❌ Проблема: "Forbidden" (403) на `/api/amo-crm/status`
**Причина:** Endpoint все ще вимагає `requireAdmin`
**Рішення:** Прибрати `requireAdmin` middleware

---

### ❌ Проблема: Callback повертає JSON замість redirect
**Причина:** Callback не реалізовано з `res.redirect()`
**Рішення:** Оновити callback endpoint згідно з `AMO_CRM_CALLBACK_REDIRECT_FIX.md`

---

### ❌ Проблема: "AMO CRM not connected for this user" після авторизації
**Причина:** Токени зберігаються глобально, а не для користувача
**Рішення:** Перевірити `saveTokensForUser()` та `userId` в базі даних

---

### ❌ Проблема: OAuth URL веде на `reforyou.amocrm.ru` замість `www.amocrm.ru/oauth`
**Причина:** Проблема в мобільному додатку (неправильний URL)
**Рішення:** Перевірити `mobile/api/amo-crm.ts` → `buildAmoAuthUrl()`

---

## 7. 📝 Файли для перевірки

### Admin Panel Backend:
- [ ] `src/routes/amo-crm.routes.ts` - routes
- [ ] `src/services/amo-crm.service.ts` - service методи
- [ ] `src/entities/AmoCrmToken.ts` - entity з `userId`
- [ ] `src/server.ts` - підключення routes

### Environment:
- [ ] `.env` - змінні AMO CRM

### Database:
- [ ] Міграція для `user_id` в `amo_crm_tokens`

---

## 8. ✅ Швидка перевірка через curl

```bash
# 1. Перевірити статус (має бути доступний для користувача)
curl -X GET https://admin.foryou-realestate.com/api/amo-crm/status \
  -H "Authorization: Bearer <user_jwt_token>"

# 2. Перевірити callback (має перенаправляти)
curl -I "https://admin.foryou-realestate.com/api/amo-crm/callback?code=test&state=test"

# 3. Перевірити exchange-code (має приймати code)
curl -X POST https://admin.foryou-realestate.com/api/amo-crm/exchange-code \
  -H "Authorization: Bearer <user_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"code": "test"}'
```

---

**Останнє оновлення:** Грудень 2025
