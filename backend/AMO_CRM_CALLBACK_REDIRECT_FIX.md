# 🔧 Виправлення Callback для Мобільного Додатка

## Проблема

Коли користувач авторизується в AMO CRM через мобільний додаток:
1. Відкривається браузер з OAuth
2. Користувач авторизується
3. AMO CRM перенаправляє на `https://admin.foryou-realestate.com/api/amo-crm/callback?code=...`
4. **Проблема:** Callback повертає JSON, а не перенаправляє на deep link мобільного додатка

## Рішення

Оновити callback endpoint щоб він перенаправляв на deep link після успішного обміну коду на токени.

---

## Оновлений Callback Endpoint

**Файл:** `admin-panel-backend/src/routes/amo-crm.routes.ts`

```typescript
/**
 * GET /api/amo-crm/callback
 * OAuth callback endpoint
 * Перенаправляє на deep link мобільного додатка після успішної авторизації
 */
router.get('/callback', async (req: Request, res: Response) => {
  try {
    const { code, from_exchange, state } = req.query;

    if (!code) {
      // Якщо немає коду - перенаправити на deep link з помилкою
      return res.redirect('foryoure://amo-crm/callback?error=missing_code');
    }

    // Обміняти code на токени
    await amoCrmService.exchangeCode(code as string);

    // Перенаправити на deep link мобільного додатка з успіхом
    return res.redirect(`foryoure://amo-crm/callback?code=${code}&state=${state || ''}`);
  } catch (error: any) {
    // Перенаправити на deep link з помилкою
    return res.redirect(`foryoure://amo-crm/callback?error=${encodeURIComponent(error.message || 'auth_failed')}`);
  }
});
```

---

## Альтернативне рішення (HTML сторінка з автоматичним redirect)

Якщо `res.redirect()` не працює з deep links, можна використати HTML сторінку з JavaScript redirect:

```typescript
router.get('/callback', async (req: Request, res: Response) => {
  try {
    const { code, from_exchange, state } = req.query;

    if (!code) {
      return res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>AMO CRM Authorization</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body>
            <script>
              window.location.href = 'foryoure://amo-crm/callback?error=missing_code';
            </script>
            <p>Redirecting to app...</p>
          </body>
        </html>
      `);
    }

    // Обміняти code на токени
    await amoCrmService.exchangeCode(code as string);

    // Перенаправити на deep link
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>AMO CRM Authorization</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
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
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>AMO CRM Authorization</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <script>
            window.location.href = 'foryoure://amo-crm/callback?error=${encodeURIComponent(error.message || 'auth_failed')}';
          </script>
          <p>Redirecting to app...</p>
        </body>
      </html>
    `);
  }
});
```

---

## Перевірка

Після оновлення:
1. Користувач натискає "Підключити AMO CRM" в додатку
2. Відкривається браузер з OAuth
3. Користувач авторизується
4. AMO CRM перенаправляє на `https://admin.foryou-realestate.com/api/amo-crm/callback?code=...`
5. **Callback автоматично перенаправляє на `foryoure://amo-crm/callback?code=...`**
6. Мобільний додаток обробляє deep link
7. Обміняє code на токени через API

---

**Останнє оновлення:** Грудень 2025
