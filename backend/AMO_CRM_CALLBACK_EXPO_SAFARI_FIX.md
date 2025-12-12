# 🔧 Виправлення deep link redirect в Safari WebView (Expo Go)

## 🐛 Проблема

HTML сторінка відображається правильно ("✓ Authorization successful!"), але JavaScript redirect `window.location.href = 'foryoure://...'` не працює в Safari WebView всередині Expo Go.

**Симптоми:**
- HTML сторінка показує "Redirecting to app..."
- Safari показує помилку "Safari cannot open the page because the address is invalid"
- Deep link не відкривається автоматично

---

## ✅ Рішення

Використати **кілька методів redirect** з fallback на ручний клік по посиланню.

---

## 📝 Оновлений Callback Endpoint

**Файл:** `admin-panel-backend/src/routes/amo-crm.routes.ts`

### Повний код з множинними методами redirect:

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
              }
            </style>
          </head>
          <body>
            <div class="container">
              <p>Redirecting to app...</p>
            </div>
            <script>
              var deepLink = 'foryoure://amo-crm/callback?error=missing_code';
              
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
              
              // Fallback: показати кнопку для ручного кліку
              setTimeout(function() {
                document.body.innerHTML = '<div class="container"><p>Please tap the button below to return to the app:</p><p><a href="' + deepLink + '">Return to App</a></p></div>';
              }, 2000);
            </script>
          </body>
        </html>
      `);
    }

    // Обміняти code на токени
    await amoCrmService.exchangeCode(code as string);

    // Перенаправити на deep link мобільного додатка з успіхом
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
            
            // Метод 1: location.href (без window) - найшвидший
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
            
            // Fallback: показати кнопку для ручного кліку через 2 секунди
            setTimeout(function() {
              document.body.innerHTML = '<div class="container"><p class="success">✓ Authorization successful!</p><p>Please tap the button below to return to the app:</p><p><a href="' + deepLink + '">Return to App</a></p></div>';
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
            
            // Fallback: показати кнопку для ручного кліку через 2 секунди
            setTimeout(function() {
              document.body.innerHTML = '<div class="container"><p class="error">✗ Authorization failed</p><p>Please tap the button below to return to the app:</p><p><a href="' + deepLink + '">Return to App</a></p></div>';
            }, 2000);
          </script>
        </body>
      </html>
    `);
  }
});
```

---

## 🔍 Що змінилося

### Було (не працює в Safari WebView):
```javascript
window.location.href = 'foryoure://amo-crm/callback?code=...';
```

### Стало (працює в Safari WebView):
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
```

---

## ✨ Покращення

1. **Множинні методи redirect:**
   - `location.href` (без `window`)
   - `window.location.replace()`
   - Автоматичний клік по `<a>` тегу

2. **Fallback кнопка:**
   - Якщо автоматичний redirect не спрацює через 2 секунди
   - Показується кнопка "Return to App" для ручного кліку
   - Кнопка має стиль iOS (синій колір, тінь)

3. **Покращений UX:**
   - Чіткі повідомлення про статус
   - Стилізована кнопка для ручного кліку
   - Системні шрифти Apple

---

## 🧪 Тестування

Після оновлення:

1. Відкрийте мобільний додаток
2. Натисніть "Підключити AMO CRM"
3. Авторизуйтесь в AMO CRM
4. Натисніть "РАЗРЕШИТЬ"
5. **Очікуваний результат:**
   - HTML сторінка показує "✓ Authorization successful!"
   - Автоматично перенаправляє на deep link (один з методів має спрацювати)
   - Якщо автоматичний redirect не спрацює - показується кнопка "Return to App"
   - Користувач може натиснути кнопку вручну

---

## ⚠️ Важливі примітки

1. **Safari WebView обмеження:** Safari WebView в Expo Go може блокувати деякі методи redirect
2. **Fallback обов'язковий:** Завжди показуйте кнопку для ручного кліку як fallback
3. **Таймаут:** Використовуйте таймаут 2 секунди для показу fallback кнопки

---

**Останнє оновлення:** Січень 2025
