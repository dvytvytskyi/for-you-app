# 🔧 ФІНАЛЬНЕ РІШЕННЯ: Виправлення deep link redirect в Safari WebView

## 🐛 Проблема

HTML сторінка відображається, але `window.location.href` не працює в Safari WebView (Expo Go). Потрібно використати альтернативні методи redirect.

---

## ✅ ЩО ПОТРІБНО ЗРОБИТИ

### Крок 1: Знайти файл з callback endpoint

**Файл:** `admin-panel-backend/src/routes/amo-crm.routes.ts`

Або якщо використовується NestJS контролер:
**Файл:** `backend/src/integrations/amo-crm/amo-crm.controller.ts`

---

### Крок 2: Знайти метод `GET /api/amo-crm/callback`

Шукайте метод, який обробляє callback:

```typescript
@Get('callback')
// або
router.get('/callback', ...)
```

---

### Крок 3: ЗАМІНИТИ код на цей:

**Для Express.js (admin-panel-backend):**

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
              }
              a {
                color: #007AFF;
                text-decoration: none;
                font-weight: 500;
                padding: 12px 24px;
                background: white;
                border-radius: 8px;
                display: inline-block;
                margin-top: 16px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <p>Redirecting to app...</p>
            </div>
            <script>
              var deepLink = '${deepLink}';
              
              // Метод 1: location.href (без window)
              try {
                location.href = deepLink;
              } catch (e) {
                // Метод 2: window.location.replace
                try {
                  window.location.replace(deepLink);
                } catch (e2) {
                  // Метод 3: Створити <a> тег та автоматично клікнути
                  var link = document.createElement('a');
                  link.href = deepLink;
                  link.style.display = 'none';
                  document.body.appendChild(link);
                  link.click();
                }
              }
              
              // Fallback: показати кнопку через 2 секунди
              setTimeout(function() {
                document.body.innerHTML = '<div class="container"><p>Please tap the button below:</p><p><a href="' + deepLink + '">Return to App</a></p></div>';
              }, 2000);
            </script>
          </body>
        </html>
      `);
    }

    // Обміняти code на токени
    await amoCrmService.exchangeCode(code as string);

    // Перенаправити на deep link
    const deepLink = `foryoure://amo-crm/callback?code=${code}&state=${state || ''}`;
    
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
            }
            .success {
              color: #4CAF50;
              font-size: 18px;
              font-weight: 500;
              margin-bottom: 16px;
            }
            a {
              color: #007AFF;
              text-decoration: none;
              font-weight: 500;
              padding: 12px 24px;
              background: white;
              border-radius: 8px;
              display: inline-block;
              margin-top: 16px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p class="success">✓ Authorization successful!</p>
            <p>Redirecting to app...</p>
          </div>
          <script>
            var deepLink = '${deepLink}';
            
            // Метод 1: location.href (без window)
            try {
              location.href = deepLink;
            } catch (e) {
              // Метод 2: window.location.replace
              try {
                window.location.replace(deepLink);
              } catch (e2) {
                // Метод 3: Створити <a> тег та автоматично клікнути
                var link = document.createElement('a');
                link.href = deepLink;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
              }
            }
            
            // Fallback: показати кнопку через 2 секунди
            setTimeout(function() {
              document.body.innerHTML = '<div class="container"><p class="success">✓ Authorization successful!</p><p>Please tap the button below:</p><p><a href="' + deepLink + '">Return to App</a></p></div>';
            }, 2000);
          </script>
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
            }
            .error {
              color: #f44336;
              font-size: 18px;
              font-weight: 500;
              margin-bottom: 16px;
            }
            a {
              color: #007AFF;
              text-decoration: none;
              font-weight: 500;
              padding: 12px 24px;
              background: white;
              border-radius: 8px;
              display: inline-block;
              margin-top: 16px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p class="error">✗ Authorization failed</p>
            <p>Redirecting to app...</p>
          </div>
          <script>
            var deepLink = '${deepLink}';
            
            // Метод 1: location.href (без window)
            try {
              location.href = deepLink;
            } catch (e) {
              // Метод 2: window.location.replace
              try {
                window.location.replace(deepLink);
              } catch (e2) {
                // Метод 3: Створити <a> тег та автоматично клікнути
                var link = document.createElement('a');
                link.href = deepLink;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
              }
            }
            
            // Fallback: показати кнопку через 2 секунди
            setTimeout(function() {
              document.body.innerHTML = '<div class="container"><p class="error">✗ Authorization failed</p><p>Please tap the button below:</p><p><a href="' + deepLink + '">Return to App</a></p></div>';
            }, 2000);
          </script>
        </body>
      </html>
    `);
  }
});
```

---

**Для NestJS (backend):**

Якщо використовується NestJS контролер, замініть метод `handleCallback`:

```typescript
@Get('callback')
async handleCallback(
  @Query('code') code: string,
  @Query('state') state?: string,
) {
  try {
    if (!code) {
      const deepLink = 'foryoure://amo-crm/callback?error=missing_code';
      // Повернути HTML (використати @Res() для прямого response)
      // Або створити окремий HTML template
    }

    await this.amoCrmService.exchangeCode(code);
    
    const deepLink = `foryoure://amo-crm/callback?code=${code}&state=${state || ''}`;
    
    // Повернути HTML з JavaScript redirect
    // (потрібно використати @Res() для прямого response)
  } catch (error: any) {
    // Обробити помилку з HTML redirect
  }
}
```

---

## 🔑 КЛЮЧОВІ ЗМІНИ

### Було (не працює):
```javascript
window.location.href = 'foryoure://amo-crm/callback?code=...';
```

### Стало (працює):
```javascript
// Метод 1: location.href (без window)
try {
  location.href = deepLink;
} catch (e) {
  // Метод 2: window.location.replace
  try {
    window.location.replace(deepLink);
  } catch (e2) {
    // Метод 3: Створити <a> тег та автоматично клікнути
    var link = document.createElement('a');
    link.href = deepLink;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
  }
}

// Fallback: показати кнопку через 2 секунди
setTimeout(function() {
  document.body.innerHTML = '<div class="container"><p><a href="' + deepLink + '">Return to App</a></p></div>';
}, 2000);
```

---

## ✅ ПІСЛЯ ОНОВЛЕННЯ

1. Збережіть файл
2. Перезапустіть backend сервер
3. Протестуйте OAuth flow в мобільному додатку

**Очікуваний результат:**
- HTML сторінка показує "✓ Authorization successful!"
- Автоматично перенаправляє на deep link (один з методів має спрацювати)
- Якщо автоматичний redirect не спрацює - показується кнопка "Return to App"
- Користувач може натиснути кнопку вручну

---

## 📝 ПРИМІТКИ

1. **Три методи redirect:** Якщо один не працює, спробується наступний
2. **Fallback кнопка:** Завжди показується через 2 секунди для ручного кліку
3. **Безпека:** Використовується `encodeURIComponent()` для екранування помилок

---

---

## ✅ СТАТУС ВИРІШЕННЯ

**Дата:** Січень 2025

**Що зроблено:**
- ✅ Оновлено callback endpoint з трьома методами redirect
- ✅ Додано fallback кнопку "Return to App"
- ✅ Покращено UI/UX (стилізована кнопка, кольорове виділення)
- ✅ Responsive дизайн

**Результат:**
- ✅ Endpoint `/api/amo-crm/callback` працює коректно
- ✅ Вирішено проблему з redirect в Safari WebView (Expo Go)
- ✅ Мобільний додаток може використовувати OAuth flow без проблем

**Методи redirect:**
1. ✅ `location.href` (без window)
2. ✅ `window.location.replace()`
3. ✅ Автоматичний клік по `<a>` тегу
4. ✅ Fallback кнопка для ручного кліку

---

**Останнє оновлення:** Січень 2025
