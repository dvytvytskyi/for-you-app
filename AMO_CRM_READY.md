# ✅ AMO CRM - Готово до використання!

## 🎉 Що зроблено:

1. ✅ **Додано метод обміну API ключа** на OAuth код
2. ✅ **Налаштовано redirect URI** з доменом (не IP!)
3. ✅ **Nginx налаштовано** - `/api` проксує на backend (порт 3003)
4. ✅ **Код скомпільовано** без помилок

## 🔗 Endpoints:

### 1. Обмін API ключа на authorization code:

```bash
POST https://foryou-realestate.com/api/v1/integrations/amo-crm/exchange-api-key
Content-Type: application/json

{
  "login": "ваш-логін@example.com",
  "api_key": "ваш-api-ключ",
  "state": "опціональний-параметр"
}
```

**Відповідь:** `202 Accepted`

AMO CRM автоматично відправить authorization code на:
```
https://foryou-realestate.com/api/v1/integrations/amo-crm/callback?code=CODE&from_exchange=1
```

### 2. Callback endpoint (автоматичний):

```
GET https://foryou-realestate.com/api/v1/integrations/amo-crm/callback?code=CODE
```

Автоматично обміняє код на токени та збереже їх в БД.

### 3. Тестовий endpoint:

```bash
GET https://foryou-realestate.com/api/v1/integrations/amo-crm/test
```

## 📋 Налаштування в AMO CRM:

### Redirect URI (зареєструйте в AMO CRM):
```
https://foryou-realestate.com/api/v1/integrations/amo-crm/callback
```

### Дані інтеграції:
```
Domain: reforyou.amocrm.ru
Client ID: 2912780f-a1e4-4d5d-a069-ee01422d8bef
Client Secret: (в .env файлі)
```

## 🚀 Як використати:

1. **Отримайте API ключ** з AMO CRM:
   - Зайдіть в AMO CRM → Налаштування → API
   - Скопіюйте API ключ вашого користувача

2. **Обміняйте API ключ на authorization code:**
   ```bash
   curl -X POST https://foryou-realestate.com/api/v1/integrations/amo-crm/exchange-api-key \
     -H "Content-Type: application/json" \
     -d '{
       "login": "ваш-логін@reforyou.amocrm.ru",
       "api_key": "ваш-api-ключ"
     }'
   ```

3. **AMO CRM автоматично відправить код** на redirect URI

4. **Токени збережено!** Інтеграція готова до використання

## ⚠️ Важливо:

- Метод обміну API ключа можна викликати **не частіше ніж раз на 5 хвилин**
- Authorization code діє **20 хвилин**
- Токени автоматично оновлюються через refresh_token

## 🔧 Змінні в `.env` (вже налаштовано):

```env
AMO_DOMAIN=reforyou.amocrm.ru
AMO_CLIENT_ID=2912780f-a1e4-4d5d-a069-ee01422d8bef
AMO_CLIENT_SECRET=...
AMO_ACCOUNT_ID=31920194
AMO_API_DOMAIN=api-b.amocrm.ru
AMO_REDIRECT_URI=https://foryou-realestate.com/api/v1/integrations/amo-crm/callback
```

## 📝 Наступні кроки:

1. Отримайте API ключ з AMO CRM
2. Виконайте обмін API ключа через endpoint вище
3. Перевірте, що токени збережені в БД
4. Готово! Можна використовувати інтеграцію

