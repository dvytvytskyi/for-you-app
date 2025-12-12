# 🔧 Виправлення помилки "Cannot GET /api/v1/integrations/amo-crm/callback"

## 🐛 Проблема

Після авторизації в AMO CRM користувач отримує помилку:
```
Cannot GET /api/v1/integrations/amo-crm/callback
```

**Причина:** AMO CRM перенаправляє на неправильний URL.

---

## 🔍 Діагностика

### Проблема 1: Неправильний Redirect URI в AMO CRM

AMO CRM намагається перенаправити на:
```
https://foryou-realestate.com/api/v1/integrations/amo-crm/callback
```

Але endpoint має бути на **admin-panel-backend**:
```
https://admin.foryou-realestate.com/api/amo-crm/callback
```

---

## ✅ Рішення

### Крок 1: Оновити Redirect URI в AMO CRM

1. Зайдіть в AMO CRM: `https://reforyou.amocrm.ru`
2. Перейдіть: **Налаштування** → **Інтеграції** → **API**
3. Знайдіть інтеграцію з Client ID: `2912780f-a1e4-4d5d-a069-ee01422d8bef`
4. Оновіть **Redirect URI** на:
   ```
   https://admin.foryou-realestate.com/api/amo-crm/callback
   ```
5. Збережіть зміни

**Важливо:** Redirect URI має точно співпадати!

---

### Крок 2: Перевірка endpoint на admin-panel-backend

**Файл:** `admin-panel-backend/src/routes/amo-crm.routes.ts`

Переконайтеся, що endpoint існує та правильно працює:

```typescript
/**
 * GET /api/amo-crm/callback
 * OAuth callback endpoint
 * Перенаправляє на deep link мобільного додатка після успішної авторизації
 */
router.get('/callback', async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      // Перенаправити на deep link з помилкою
      return res.redirect('foryoure://amo-crm/callback?error=missing_code');
    }

    // ⚠️ ВАЖЛИВО: Потрібно отримати user_id для збереження токенів
    // Але в callback немає JWT токену!
    // Рішення: передавати user_id через state параметр
    
    // Обміняти code на токени (поки без user_id - зберігати глобально або через state)
    // TODO: Реалізувати отримання user_id з state
    
    // Перенаправити на deep link мобільного додатка з успіхом
    return res.redirect(`foryoure://amo-crm/callback?code=${code}&state=${state || ''}`);
  } catch (error: any) {
    console.error('Callback error:', error);
    // Перенаправити на deep link з помилкою
    return res.redirect(`foryoure://amo-crm/callback?error=${encodeURIComponent(error.message || 'auth_failed')}`);
  }
});
```

---

### Крок 3: Альтернативне рішення (HTML redirect)

Якщо `res.redirect()` не працює з deep links, використайте HTML сторінку:

```typescript
router.get('/callback', async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>AMO CRM Authorization</title>
          </head>
          <body>
            <script>
              window.location.href = 'foryoure://amo-crm/callback?error=missing_code';
            </script>
            <p>Redirecting...</p>
          </body>
        </html>
      `);
    }

    // Обміняти code на токени
    // TODO: Реалізувати збереження токенів для користувача

    // Перенаправити через HTML
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>AMO CRM Authorization</title>
        </head>
        <body>
          <script>
            window.location.href = 'foryoure://amo-crm/callback?code=${code}&state=${state || ''}';
          </script>
          <p>Redirecting to app...</p>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error('Callback error:', error);
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>AMO CRM Authorization Error</title>
        </head>
        <body>
          <script>
            window.location.href = 'foryoure://amo-crm/callback?error=${encodeURIComponent(error.message || 'auth_failed')}';
          </script>
          <p>Error: ${error.message}</p>
        </body>
      </html>
    `);
  }
});
```

---

### Крок 4: Передача user_id через state

Оновіть `buildAmoAuthUrl()` в мобільному додатку:

**Файл:** `mobile/api/amo-crm.ts`

```typescript
export async function buildAmoAuthUrl(): Promise<string> {
  // Отримати user_id з токену або з authStore
  const { user } = useAuthStore.getState();
  const userId = user?.id;
  
  const state = generateState();
  
  // Додати user_id до state (encode в base64 або JSON)
  const stateWithUserId = JSON.stringify({
    state: state,
    userId: userId,
  });
  const encodedState = Buffer.from(stateWithUserId).toString('base64');
  
  // Зберегти state для перевірки
  await SecureStore.setItemAsync('amo_crm_oauth_state', state);
  
  const params = new URLSearchParams({
    client_id: '2912780f-a1e4-4d5d-a069-ee01422d8bef',
    state: encodedState, // Передаємо encoded state з user_id
    mode: 'popup',
  });
  
  return `https://www.amocrm.ru/oauth?${params.toString()}`;
}
```

В callback endpoint:

```typescript
router.get('/callback', async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.redirect('foryoure://amo-crm/callback?error=missing_code');
    }

    // Декодувати state
    let userId: string | undefined;
    if (state) {
      try {
        const decodedState = JSON.parse(Buffer.from(state as string, 'base64').toString());
        userId = decodedState.userId;
      } catch (e) {
        console.error('Error decoding state:', e);
      }
    }

    // Обміняти code на токени
    if (userId) {
      // Зберегти токени для користувача
      await amoCrmService.exchangeCodeForUser(userId, code as string);
    } else {
      // Зберегти глобально (fallback)
      await amoCrmService.exchangeCode(code as string);
    }

    // Перенаправити на deep link
    return res.redirect(`foryoure://amo-crm/callback?code=${code}&state=${state || ''}`);
  } catch (error: any) {
    console.error('Callback error:', error);
    return res.redirect(`foryoure://amo-crm/callback?error=${encodeURIComponent(error.message || 'auth_failed')}`);
  }
});
```

---

## 🧪 Тестування

### Тест 1: Перевірка endpoint

```bash
curl -I "https://admin.foryou-realestate.com/api/amo-crm/callback?code=test&state=test"
```

**Очікувана відповідь:**
```
HTTP/1.1 302 Found
Location: foryoure://amo-crm/callback?code=test&state=test
```

### Тест 2: Повний OAuth flow

1. Відкрити OAuth URL в браузері
2. Авторизуватися в AMO CRM
3. Перевірити, що перенаправляє на `foryoure://amo-crm/callback`
4. Перевірити, що мобільний додаток обробляє deep link

---

## 📋 Чеклист виправлення

- [ ] Redirect URI в AMO CRM оновлено на `https://admin.foryou-realestate.com/api/amo-crm/callback`
- [ ] Endpoint `GET /api/amo-crm/callback` існує на admin-panel-backend
- [ ] Endpoint перенаправляє на deep link `foryoure://amo-crm/callback`
- [ ] Endpoint обмінює code на токени
- [ ] Endpoint зберігає токени для користувача (через state або інший спосіб)
- [ ] Мобільний додаток обробляє deep link `foryoure://amo-crm/callback`

---

## ⚠️ Важливі моменти

1. **Redirect URI має точно співпадати** з тим, що вказано в AMO CRM налаштуваннях
2. **Callback має перенаправляти на deep link**, а не повертати JSON
3. **user_id потрібно передавати через state**, бо в callback немає JWT токену
4. **Deep link має бути зареєстрований** в мобільному додатку

---

**Останнє оновлення:** Січень 2025
