# AMO CRM - Обмін API ключа на OAuth код

## ✅ Що зроблено:

1. ✅ Додано метод `exchangeApiKeyForCode` в сервіс
2. ✅ Додано endpoint `POST /api/v1/integrations/amo-crm/exchange-api-key` 
3. ✅ Оновлено callback endpoint для обробки параметра `from_exchange=1`
4. ✅ Налаштовано nginx для проксування на домен `https://foryou-realestate.com`
5. ✅ Redirect URI оновлено на домен: `https://foryou-realestate.com/api/v1/integrations/amo-crm/callback`

## 🔐 Як отримати authorization code:

### Варіант 1: Через обмін API ключа (рекомендовано)

**Потрібно:**
- Логін користувача AMO CRM
- API ключ користувача (з налаштувань AMO CRM → API)

**Крок 1:** Обміняти API ключ на authorization code:

```bash
curl -X POST https://foryou-realestate.com/api/v1/integrations/amo-crm/exchange-api-key \
  -H "Content-Type: application/json" \
  -d '{
    "login": "your-email@example.com",
    "api_key": "your-api-key-here"
  }'
```

**Відповідь:** `202 Accepted`

**Крок 2:** AMO CRM автоматично відправить authorization code на redirect URI:
```
https://foryou-realestate.com/api/v1/integrations/amo-crm/callback?code=CODE&from_exchange=1
```

**Крок 3:** Callback автоматично обміняє код на токени та збереже їх в БД.

### Варіант 2: Стандартний OAuth flow

Якщо AMO CRM підтримує стандартний OAuth, використовуйте URL авторизації:
```
https://reforyou.amocrm.ru/oauth2/authorize?client_id=2912780f-a1e4-4d5d-a069-ee01422d8bef&response_type=code&redirect_uri=https://foryou-realestate.com/api/v1/integrations/amo-crm/callback
```

## 📋 Налаштування в AMO CRM:

### Redirect URI має бути зареєстрований:

```
https://foryou-realestate.com/api/v1/integrations/amo-crm/callback
```

### Дані інтеграції:

```
Client ID (client_uuid): 2912780f-a1e4-4d5d-a069-ee01422d8bef
Client Secret: VfzqqKrfDD78ROmXTMUJkPAauTrYYNHQBAsWaLSYxQNvcQSB9i3xBFVTlcBifumd
Domain: reforyou.amocrm.ru
```

## 🔧 Змінні в `.env`:

```env
AMO_DOMAIN=reforyou.amocrm.ru
AMO_CLIENT_ID=2912780f-a1e4-4d5d-a069-ee01422d8bef
AMO_CLIENT_SECRET=VfzqqKrfDD78ROmXTMUJkPAauTrYYNHQBAsWaLSYxQNvcQSB9i3xBFVTlcBifumd
AMO_ACCOUNT_ID=31920194
AMO_API_DOMAIN=api-b.amocrm.ru
AMO_REDIRECT_URI=https://foryou-realestate.com/api/v1/integrations/amo-crm/callback
```

## 🧪 Тестування:

### 1. Перевірка підключення:
```bash
curl https://foryou-realestate.com/api/v1/integrations/amo-crm/test
```

### 2. Обмін API ключа:
```bash
curl -X POST https://foryou-realestate.com/api/v1/integrations/amo-crm/exchange-api-key \
  -H "Content-Type: application/json" \
  -d '{
    "login": "ваш-логін@example.com",
    "api_key": "ваш-api-ключ"
  }'
```

## ⚠️ Важливо:

1. **Метод обміну API ключа** можна викликати не частіше ніж раз на 5 хвилин для одного користувача
2. **Authorization code** буде відправлено на redirect URI автоматично
3. **Callback endpoint** автоматично обміняє код на токени
4. **Токени зберігаються** в БД і автоматично оновлюються

## 📝 Структура запитів:

### POST /api/v1/integrations/amo-crm/exchange-api-key

**Body:**
```json
{
  "login": "user@example.com",
  "api_key": "api-key-string",
  "state": "optional-state-parameter"
}
```

**Response:**
```json
{
  "message": "API key exchange request accepted",
  "status": "accepted",
  "note": "Authorization code will be sent to redirect URI"
}
```

### GET /api/v1/integrations/amo-crm/callback?code=...&from_exchange=1

**Автоматично викликається AMO CRM** після обміну API ключа.

**Response:**
```json
{
  "message": "AMO CRM successfully connected",
  "status": "success",
  "fromExchange": true
}
```

