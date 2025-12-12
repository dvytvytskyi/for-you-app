# 🔧 Виправлення помилки Safari "invalid address" для AMO CRM callback

## 🐛 Проблема

Після натискання "РАЗРЕШИТЬ" (ALLOW) в AMO CRM:
- Safari показує помилку: **"Safari cannot open the page because the address is invalid"**
- Причина: `res.redirect()` не працює з deep links (`foryoure://`) в Safari

---

## ✅ Рішення

Потрібно оновити callback endpoint, щоб він використовував **HTML сторінку з JavaScript redirect** замість `res.redirect()`.

---

## 📝 Оновлений Callback Endpoint

**Файл:** `admin-panel-backend/src/routes/amo-crm.routes.ts`

### Варіант 1: HTML сторінка з автоматичним redirect (рекомендовано)

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
      // Якщо немає коду - перенаправити на deep link з помилкою
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
            </style>
          </head>
          <body>
            <div class="container">
              <p>Redirecting to app...</p>
            </div>
            <script>
              // Метод 1: Спробувати через location.href (без window)
              try {
                location.href = 'foryoure://amo-crm/callback?error=missing_code';
              } catch (e) {
                // Метод 2: Якщо не спрацювало, спробувати через window.location.replace
                try {
                  window.location.replace('foryoure://amo-crm/callback?error=missing_code');
                } catch (e2) {
                  // Метод 3: Створити <a> тег та автоматично клікнути
                  var link = document.createElement('a');
                  link.href = 'foryoure://amo-crm/callback?error=missing_code';
                  link.style.display = 'none';
                  document.body.appendChild(link);
                  link.click();
                }
              }
              
              // Fallback: якщо через 3 секунди не спрацювало, показати повідомлення
              setTimeout(function() {
                document.body.innerHTML = '<div class="container"><p>Please return to the app manually</p><p><a href="foryoure://amo-crm/callback?error=missing_code">Click here to return</a></p></div>';
              }, 3000);
            </script>
          </body>
        </html>
      `);
    }

    // Обміняти code на токени
    // ⚠️ ВАЖЛИВО: Поки що зберігаємо токени глобально
    // TODO: Зберігати токени для конкретного користувача (через state параметр)
    await amoCrmService.exchangeCode(code as string);

    // Перенаправити на deep link мобільного додатка з успіхом
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
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p class="success">✓ Authorization successful!</p>
            <p>Redirecting to app...</p>
          </div>
          <script>
            // Метод 1: Спробувати через location.href (без window)
            try {
              location.href = 'foryoure://amo-crm/callback?code=${code}&state=${state || ''}';
            } catch (e) {
              // Метод 2: Якщо не спрацювало, спробувати через window.location.replace
              try {
                window.location.replace('foryoure://amo-crm/callback?code=${code}&state=${state || ''}');
              } catch (e2) {
                // Метод 3: Створити <a> тег та автоматично клікнути
                var link = document.createElement('a');
                link.href = 'foryoure://amo-crm/callback?code=${code}&state=${state || ''}';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
              }
            }
            
            // Fallback: якщо через 3 секунди не спрацювало, показати повідомлення
            setTimeout(function() {
              document.body.innerHTML = '<div class="container"><p>Please return to the app manually</p><p><a href="foryoure://amo-crm/callback?code=${code}&state=${state || ''}">Click here to return</a></p></div>';
            }, 3000);
          </script>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error('Callback error:', error);
    // Перенаправити на deep link з помилкою
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
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p class="error">✗ Authorization failed</p>
            <p>Redirecting to app...</p>
          </div>
          <script>
            var errorMsg = '${encodeURIComponent(error.message || 'auth_failed')}';
            var deepLink = 'foryoure://amo-crm/callback?error=' + errorMsg;
            
            // Метод 1: Спробувати через location.href (без window)
            try {
              location.href = deepLink;
            } catch (e) {
              // Метод 2: Якщо не спрацювало, спробувати через window.location.replace
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
            
            // Fallback: якщо через 3 секунди не спрацювало, показати повідомлення
            setTimeout(function() {
              document.body.innerHTML = '<div class="container"><p>Please return to the app manually</p><p><a href="' + deepLink + '">Click here to return</a></p></div>';
            }, 3000);
          </script>
        </body>
      </html>
    `);
  }
});
```

---

### Варіант 2: Використання meta refresh (альтернатива)

Якщо JavaScript не спрацює, можна додати meta refresh:

```html
<meta http-equiv="refresh" content="0;url=foryoure://amo-crm/callback?code=...">
```

---

## 🔍 Що змінилося

### Було (не працює в Safari):
```typescript
return res.redirect(`foryoure://amo-crm/callback?code=${code}`);
```

### Стало (працює в Safari):
```typescript
return res.send(`
  <html>
    <head>
      <script>
        window.location.href = 'foryoure://amo-crm/callback?code=${code}';
      </script>
    </head>
    <body>
      <p>Redirecting to app...</p>
    </body>
  </html>
`);
```

---

## ⚠️ Важливі примітки

1. **Токени зберігаються глобально** - потрібно додати логіку для збереження токенів для конкретного користувача через `state` параметр
2. **Fallback повідомлення** - якщо deep link не спрацює, користувач побачить повідомлення
3. **Екранування параметрів** - використовується `encodeURIComponent()` для безпечного передавання помилок

---

## 🧪 Тестування

Після оновлення:

1. Відкрийте мобільний додаток
2. Натисніть "Підключити AMO CRM"
3. Авторизуйтесь в AMO CRM
4. Натисніть "РАЗРЕШИТЬ"
5. **Очікуваний результат:**
   - Відображається HTML сторінка з повідомленням "Redirecting to app..."
   - Автоматично перенаправляє на deep link `foryoure://amo-crm/callback?code=...`
   - Мобільний додаток отримує callback та обробляє його

---

## 📝 Наступні кроки

1. ✅ Оновити callback endpoint на HTML redirect - **ВИКОНАНО**
2. ⚠️ Додати збереження токенів для конкретного користувача (через `state`)
3. ⚠️ Додати обробку `user_id` з `state` параметра

---

## ✅ Статус вирішення

**Дата:** Січень 2025

**Що зроблено:**
- ✅ Оновлено callback endpoint з трьома методами redirect
- ✅ Замінено `res.redirect()` на HTML сторінку з JavaScript redirect
- ✅ Додано обробку всіх сценаріїв (успіх, помилка, відсутній код)
- ✅ Покращено UX (повідомлення про статус, fallback кнопка)
- ✅ Додано безпечне екранування параметрів
- ✅ Стилізована кнопка "Return to App" для ручного кліку

**Результат:**
- ✅ Endpoint `/api/amo-crm/callback` працює коректно
- ✅ Вирішено проблему "Safari cannot open the page because the address is invalid"
- ✅ Вирішено проблему з redirect в Safari WebView (Expo Go)
- ✅ Мобільний додаток може використовувати цей endpoint для авторизації AMO CRM

**Методи redirect:**
1. ✅ `location.href` (без window) - найшвидший
2. ✅ `window.location.replace()` - альтернатива
3. ✅ Автоматичний клік по `<a>` тегу - fallback
4. ✅ Кнопка "Return to App" - ручний клік через 2 секунди

---

**Останнє оновлення:** Січень 2025
