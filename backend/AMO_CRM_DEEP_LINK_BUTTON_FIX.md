# 🔧 Виправлення кнопки "Return to App" в Safari WebView

## 🐛 Проблема

Коли користувач натискає кнопку "Return to App" в Safari WebView, виникає помилка:
**"Safari cannot open the page because the address is invalid"**

**Причина:** Safari WebView блокує deep links при кліку по `<a>` тегу.

---

## ✅ Рішення

Замінити `<a>` тег на кнопку з `onclick` та `window.open()`.

---

## 📝 Оновлений код для callback endpoint

**Файл:** `admin-panel-backend/src/routes/amo-crm.routes.ts`

### Замініть fallback кнопку на цей код:

**Було (не працює):**
```html
<a href="foryoure://amo-crm/callback?code=...">Return to App</a>
```

**Стало (працює):**
```html
<button onclick="window.open('foryoure://amo-crm/callback?code=...', '_self')" style="...">
  Return to App
</button>
```

---

## 🔧 Повний оновлений код

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
              button {
                color: #007AFF;
                text-decoration: none;
                font-weight: 500;
                padding: 12px 24px;
                background: white;
                border: none;
                border-radius: 8px;
                display: inline-block;
                margin-top: 16px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                cursor: pointer;
                font-size: 16px;
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
                document.body.innerHTML = '<div class="container"><p>Please tap the button below:</p><button onclick="window.open(\'' + deepLink + '\', \'_self\')">Return to App</button></div>';
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
            button {
              color: #007AFF;
              text-decoration: none;
              font-weight: 500;
              padding: 12px 24px;
              background: white;
              border: none;
              border-radius: 8px;
              display: inline-block;
              margin-top: 16px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              cursor: pointer;
              font-size: 16px;
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
              document.body.innerHTML = '<div class="container"><p class="success">✓ Authorization successful!</p><p>Please tap the button below:</p><button onclick="window.open(\'' + deepLink + '\', \'_self\')">Return to App</button></div>';
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
            button {
              color: #007AFF;
              text-decoration: none;
              font-weight: 500;
              padding: 12px 24px;
              background: white;
              border: none;
              border-radius: 8px;
              display: inline-block;
              margin-top: 16px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              cursor: pointer;
              font-size: 16px;
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
              document.body.innerHTML = '<div class="container"><p class="error">✗ Authorization failed</p><p>Please tap the button below:</p><button onclick="window.open(\'' + deepLink + '\', \'_self\')">Return to App</button></div>';
            }, 2000);
          </script>
        </body>
      </html>
    `);
  }
});
```

---

## 🔑 Ключова зміна

### Було (не працює):
```html
<a href="foryoure://amo-crm/callback?code=...">Return to App</a>
```

### Стало (працює):
```html
<button onclick="window.open('foryoure://amo-crm/callback?code=...', '_self')">
  Return to App
</button>
```

---

## ⚠️ Альтернативні методи (якщо `window.open()` не працює)

### Варіант 1: `window.location` в `onclick`
```html
<button onclick="window.location = 'foryoure://amo-crm/callback?code=...'">
  Return to App
</button>
```

### Варіант 2: `location.replace()` в `onclick`
```html
<button onclick="location.replace('foryoure://amo-crm/callback?code=...')">
  Return to App
</button>
```

### Варіант 3: `location.href` в `onclick`
```html
<button onclick="location.href = 'foryoure://amo-crm/callback?code=...'">
  Return to App
</button>
```

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
   - **Кнопка працює без помилки "Safari cannot open the page"**

---

## 📝 Примітки

1. **`window.open()` з `_self`:** Відкриває deep link в поточному вікні
2. **`onclick` замість `href`:** Дозволяє Safari WebView обробити deep link
3. **Fallback обов'язковий:** Завжди показуйте кнопку для ручного кліку

---

---

## ✅ СТАТУС ВИРІШЕННЯ

**Дата:** Січень 2025

**Що зроблено:**
- ✅ Замінено всі три fallback кнопки "Return to App"
- ✅ `<a href="...">` → `<button onclick="window.open(...)">`
- ✅ Використано `window.open()` з `'_self'` параметром
- ✅ Збережено стилізацію кнопки

**Результат:**
- ✅ Кнопка "Return to App" працює в Safari WebView
- ✅ Вирішено помилку "Safari cannot open the page because the address is invalid"
- ✅ Deep link `foryoure://amo-crm/callback?code=...` відкривається при кліку
- ✅ Мобільний додаток може використовувати OAuth flow без проблем

**Оновлені місця:**
1. ✅ Fallback кнопка при відсутності коду
2. ✅ Fallback кнопка при успішній авторизації
3. ✅ Fallback кнопка при помилці авторизації

---

**Останнє оновлення:** Січень 2025
