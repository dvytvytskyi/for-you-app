# 🔧 Callback з ручним поверненням в додаток

## 🎯 Вимоги

1. **Backend верифікує CRM** - обмінює code на токени та зберігає їх ДО показу HTML
2. **Показує кнопку "Return to App"** - без автоматичного redirect
3. **Користувач сам натискає кнопку** - повертається в додаток
4. **CRM вже підключена** - не з'являється знову повідомлення про підтвердження

---

## 📝 Оновлений код для callback endpoint

**Файл:** `admin-panel-backend/src/routes/amo-crm.routes.ts`

### Ключові зміни:

1. **Обміняти code на токени ПЕРЕД показом HTML** - щоб CRM була вже верифікована
2. **Одразу показувати кнопку "Return to App"** - без автоматичного redirect
3. **Кнопка використовує `window.open()`** - для відкриття deep link

---

## 🔧 Повний код

```typescript
router.get('/callback', async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      const deepLink = 'foryoure://amo-crm/callback?error=missing_code';
      return res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>AMO CRM Authorization</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: #f5f5f5;
              }
              .container {
                text-align: center;
                padding: 20px;
                max-width: 400px;
              }
              .error {
                color: #f44336;
                font-size: 18px;
                font-weight: 500;
                margin-bottom: 16px;
              }
              button {
                color: #007AFF;
                font-weight: 500;
                padding: 14px 28px;
                background: white;
                border: none;
                border-radius: 8px;
                display: inline-block;
                margin-top: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                cursor: pointer;
                font-size: 16px;
                min-width: 200px;
              }
              button:active {
                opacity: 0.8;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <p class="error">✗ Authorization code is missing</p>
              <p>Please tap the button below to return to the app:</p>
              <button onclick="window.open('${deepLink}', '_self')">Return to App</button>
            </div>
          </body>
        </html>
      `);
    }

    // ⚠️ ВАЖЛИВО: Обміняти code на токени ПЕРЕД показом HTML
    // Це гарантує, що CRM буде вже верифікована, коли користувач повернеться в додаток
    try {
      await amoCrmService.exchangeCode(code as string);
    } catch (error: any) {
      console.error('Error exchanging code:', error);
      const errorMsg = encodeURIComponent(error.message || 'auth_failed');
      const deepLink = `foryoure://amo-crm/callback?error=${errorMsg}`;
      
      return res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>AMO CRM Authorization Error</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: #f5f5f5;
              }
              .container {
                text-align: center;
                padding: 20px;
                max-width: 400px;
              }
              .error {
                color: #f44336;
                font-size: 18px;
                font-weight: 500;
                margin-bottom: 16px;
              }
              button {
                color: #007AFF;
                font-weight: 500;
                padding: 14px 28px;
                background: white;
                border: none;
                border-radius: 8px;
                display: inline-block;
                margin-top: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                cursor: pointer;
                font-size: 16px;
                min-width: 200px;
              }
              button:active {
                opacity: 0.8;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <p class="error">✗ Authorization failed</p>
              <p>${error.message || 'Failed to connect to AMO CRM'}</p>
              <p>Please tap the button below to return to the app:</p>
              <button onclick="window.open('${deepLink}', '_self')">Return to App</button>
            </div>
          </body>
        </html>
      `);
    }

    // ✅ CRM вже верифікована! Токени збережені в БД
    // Тепер показуємо сторінку з кнопкою для повернення в додаток
    // ⚠️ ВАЖЛИВО: Не передаємо code в deep link, бо токени вже збережені
    // Мобільний додаток просто оновить статус через GET /api/amo-crm/status
    const deepLink = `foryoure://amo-crm/callback?success=true&state=${state || ''}`;
    
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>AMO CRM Authorization</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: #f5f5f5;
            }
            .container {
              text-align: center;
              padding: 20px;
              max-width: 400px;
            }
            .success {
              color: #4CAF50;
              font-size: 18px;
              font-weight: 500;
              margin-bottom: 16px;
            }
            .message {
              color: #666;
              font-size: 16px;
              margin-bottom: 24px;
              line-height: 1.5;
            }
            button {
              color: #007AFF;
              font-weight: 500;
              padding: 14px 28px;
              background: white;
              border: none;
              border-radius: 8px;
              display: inline-block;
              margin-top: 20px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              cursor: pointer;
              font-size: 16px;
              min-width: 200px;
            }
            button:active {
              opacity: 0.8;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p class="success">✓ Authorization successful!</p>
            <p class="message">Your AMO CRM account has been successfully connected.</p>
            <p class="message">Please tap the button below to return to the app:</p>
            <button onclick="window.open('${deepLink}', '_self')">Return to App</button>
          </div>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error('Callback error:', error);
    const errorMsg = encodeURIComponent(error.message || 'auth_failed');
    const deepLink = `foryoure://amo-crm/callback?error=${errorMsg}`;
    
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>AMO CRM Authorization Error</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: #f5f5f5;
            }
            .container {
              text-align: center;
              padding: 20px;
              max-width: 400px;
            }
            .error {
              color: #f44336;
              font-size: 18px;
              font-weight: 500;
              margin-bottom: 16px;
            }
            button {
              color: #007AFF;
              font-weight: 500;
              padding: 14px 28px;
              background: white;
              border: none;
              border-radius: 8px;
              display: inline-block;
              margin-top: 20px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              cursor: pointer;
              font-size: 16px;
              min-width: 200px;
            }
            button:active {
              opacity: 0.8;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p class="error">✗ Authorization failed</p>
            <p>Please tap the button below to return to the app:</p>
            <button onclick="window.open('${deepLink}', '_self')">Return to App</button>
          </div>
        </body>
      </html>
    `);
  }
});
```

---

## 🔑 Ключові зміни

### 1. Обмін code на токени ПЕРЕД показом HTML

**Було (неправильно):**
```typescript
// Показуємо HTML
return res.send(`<html>...</html>`);
// Потім обмінюємо code (не спрацює, бо response вже відправлено)
```

**Стало (правильно):**
```typescript
// Спочатку обмінюємо code на токени
await amoCrmService.exchangeCode(code as string);
// ✅ CRM вже верифікована!
// Тепер показуємо HTML з кнопкою
return res.send(`<html>...</html>`);
```

### 2. Немає автоматичного redirect

**Було:**
```javascript
// Спробувати автоматичний redirect
location.href = deepLink;
// Показати кнопку через 2 секунди
setTimeout(...);
```

**Стало:**
```html
<!-- Одразу показуємо кнопку, без автоматичного redirect -->
<button onclick="window.open('foryoure://...', '_self')">Return to App</button>
```

### 3. Чітке повідомлення

```html
<p class="success">✓ Authorization successful!</p>
<p class="message">Your AMO CRM account has been successfully connected.</p>
<p class="message">Please tap the button below to return to the app:</p>
<button onclick="window.open('...', '_self')">Return to App</button>
```

---

## ✅ Переваги цього підходу

1. **CRM вже верифікована** - токени збережені ДО показу HTML
2. **Немає зависання** - кнопка одразу видима
3. **Користувач контролює процес** - сам вирішує, коли повертатися
4. **Не з'являється знову повідомлення** - CRM вже підключена
5. **Працює в Safari WebView** - `window.open()` працює надійно

---

## 🧪 Тестування

Після оновлення:

1. Відкрийте мобільний додаток
2. Натисніть "Підключити AMO CRM"
3. Авторизуйтесь в AMO CRM
4. Натисніть "РАЗРЕШИТЬ"
5. **Очікуваний результат:**
   - Backend обробляє callback та зберігає токени
   - Показується "✓ Authorization successful!"
   - Показується кнопка "Return to App"
   - **Немає автоматичного redirect**
   - Користувач натискає кнопку вручну
   - Повертається в додаток
   - **CRM вже підключена** - не з'являється знову повідомлення

---

## 📝 Примітки

1. **Важливо:** `await amoCrmService.exchangeCode(code)` має виконуватися ПЕРЕД `res.send()`
2. **Обробка помилок:** Якщо обмін code не вдався, показуємо помилку з кнопкою
3. **Deep link:** Передаємо `code` та `state` в deep link для обробки в додатку

---

---

## ✅ СТАТУС ВИРІШЕННЯ

**Дата:** Січень 2025

**Що зроблено:**
- ✅ Обмін code на токени перед показом HTML
- ✅ Прибрано автоматичний redirect
- ✅ Кнопка "Return to App" показується одразу
- ✅ Оновлено повідомлення для користувача
- ✅ Використано `window.open()` для Safari WebView

**Результат:**
- ✅ Backend обробляє callback і зберігає токени перед показом HTML
- ✅ CRM вже підключена, коли користувач повертається в додаток
- ✅ Кнопка "Return to App" видима одразу, без затримок
- ✅ Немає автоматичного redirect - користувач контролює процес
- ✅ Працює в Safari WebView через `window.open()`

**Переваги:**
1. ✅ CRM вже верифікована - токени збережені ДО показу HTML
2. ✅ Немає зависання - кнопка одразу видима
3. ✅ Користувач контролює процес - сам вирішує, коли повертатися
4. ✅ Не з'являється знову повідомлення - CRM вже підключена
5. ✅ Працює в Safari WebView - `window.open()` працює надійно

---

**Останнє оновлення:** Січень 2025
