# Налаштування інтеграції з AMO CRM

## 1. Отримання OAuth токенів

### Крок 1: Створення інтеграції в AMO CRM
1. Зайдіть в AMO CRM: `https://your-subdomain.amocrm.ru`
2. Перейдіть в **Налаштування** → **Інтеграції** → **API**
3. Створіть нову інтеграцію або використайте існуючу
4. Скопіюйте:
   - **Client ID** (ID інтеграції)
   - **Client Secret** (Секретний ключ)
   - **Authorization Code** (Код авторизації, діє 20 хвилин)

### Крок 2: Налаштування .env
Додайте в `backend/.env`:
```env
AMO_DOMAIN=your-subdomain.amocrm.ru
AMO_CLIENT_ID=your-client-id
AMO_CLIENT_SECRET=your-client-secret
AMO_REDIRECT_URI=http://localhost:3000/api/v1/integrations/amo-crm/callback
AMO_ACCOUNT_ID=your-account-id
AMO_API_DOMAIN=api-b.amocrm.ru
```

### Крок 3: Збереження токенів

#### Варіант А: Через OAuth flow (Production)
Відкрийте в браузері:
```
https://your-subdomain.amocrm.ru/oauth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/api/v1/integrations/amo-crm/callback
```

Після авторизації, токени будуть автоматично збережені в БД.

#### Варіант Б: Ручне збереження (Development)
Використайте curl:
```bash
curl -X POST http://localhost:3000/api/v1/integrations/amo-crm/set-tokens \
  -H "Content-Type: application/json" \
  -d '{
    "access_token": "YOUR_ACCESS_TOKEN",
    "refresh_token": "YOUR_REFRESH_TOKEN",
    "expires_in": 86400
  }'
```

## 2. Перевірка підключення

Перевірте, чи працює інтеграція:
```bash
curl http://localhost:3000/api/v1/integrations/amo-crm/test
```

Очікувана відповідь:
```json
{
  "message": "AMO CRM integration is ready",
  "status": "ok"
}
```

## 3. Тестування створення Lead

Створіть тестовий lead:
```bash
curl -X POST http://localhost:3000/api/v1/integrations/amo-crm/test-lead
```

Очікувана відповідь:
```json
{
  "message": "Lead успішно створено в AMO CRM",
  "amoLeadId": 12345,
  "status": "success"
}
```

## 4. Налаштування Webhook для двосторонньої синхронізації

### Крок 1: Налаштування в AMO CRM
1. Перейдіть в **Налаштування** → **API та Webhook**
2. Додайте новий webhook:
   - **URL**: `https://your-domain.com/api/v1/integrations/amo-crm/webhook`
   - **Події**: 
     - Сделки: Додавання, Оновлення, Зміна статусу
     - Контакти: Додавання, Оновлення (опціонально)

### Крок 2: Тестування webhook
Створіть або оновіть lead в AMO CRM вручну. Перевірте логи сервера - має з'явитися повідомлення:
```
📥 Обробка webhook з AMO CRM: {...}
Webhook оброблено: X успішно, 0 помилок
```

## 5. Автоматична синхронізація

Після налаштування:
- ✅ Leads створені через API автоматично синхронізуються з AMO CRM
- ✅ Оновлення статусів в нашій системі відправляються в AMO CRM
- ✅ Зміни в AMO CRM приходять через webhook (в стадії доопрацювання)

## 6. Структура даних Lead

При створенні lead в AMO CRM надсилається:
```json
{
  "name": "Ім'я клієнта - Назва об'єкту",
  "price": 0,
  "status_id": 123,
  "pipeline_id": 456
}
```

## 7. Troubleshooting

### Помилка: "Account not found"
- Переконайтеся, що `AMO_DOMAIN` правильний (subdomain вашого аккаунта)
- Використовуйте `https://your-subdomain.amocrm.ru`, а не `https://api-b.amocrm.ru`

### Помилка: "Failed to refresh token"
- Токен протермінувався або невалідний
- Отримайте новий Authorization Code (діє 20 хвилин) та збережіть токени знову

### Помилка: "Redirect URI is not associated with client"
- Переконайтеся, що `AMO_REDIRECT_URI` в `.env` співпадає з налаштуванням в AMO CRM
- Для development використайте: `http://localhost:3000/api/v1/integrations/amo-crm/callback`

## 8. API Endpoints

| Method | Endpoint | Опис |
|--------|----------|------|
| GET | `/api/v1/integrations/amo-crm/callback` | OAuth callback |
| POST | `/api/v1/integrations/amo-crm/webhook` | Webhook для подій AMO CRM |
| GET | `/api/v1/integrations/amo-crm/test` | Перевірка підключення |
| POST | `/api/v1/integrations/amo-crm/set-tokens` | Ручне збереження токенів (dev) |
| POST | `/api/v1/integrations/amo-crm/test-lead` | Тестове створення lead (dev) |

## 9. Документація AMO CRM API

- [Офіційна документація](https://www.amocrm.ru/developers/content/crm_platform/api-reference)
- [OAuth 2.0](https://www.amocrm.ru/developers/content/oauth/step-by-step)
- [Сделки (Leads)](https://www.amocrm.ru/developers/content/crm_platform/leads-api)
- [Webhooks](https://www.amocrm.ru/developers/content/crm_platform/webhooks-api)

