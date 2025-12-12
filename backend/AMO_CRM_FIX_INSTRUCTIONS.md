# 🔧 Інструкції: Виправлення AMO CRM - Відображення leads після верифікації

## 🎯 Мета

Після верифікації AMO CRM мають відображатися leads замість екрану "Підключіть АМО CRM".

---

## 🐛 Проблеми

1. **403 помилка** при `POST /api/amo-crm/exchange-code`
2. **Не показуються leads** - після верифікації все ще "Підключіть АМО CRM"
3. **Статус не оновлюється** - після повернення з callback

---

## ✅ ЩО ПОТРІБНО ЗРОБИТИ

### 📁 Файл 1: Backend - Callback Endpoint

**Шлях:** `admin-panel-backend/src/routes/amo-crm.routes.ts`

**Знайти метод:** `router.get('/callback', ...)`

**Знайти рядок:**
```typescript
const deepLink = `foryoure://amo-crm/callback?code=${code}&state=${state || ''}`;
```

**Замінити на:**
```typescript
// ⚠️ ВАЖЛИВО: Не передаємо code, бо токени вже збережені в БД
// Backend вже обміняв code на токени ПЕРЕД показом HTML
const deepLink = `foryoure://amo-crm/callback?success=true&state=${state || ''}`;
```

**Повний контекст:**
```typescript
router.get('/callback', async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      // ... обробка помилки ...
    }

    // ⚠️ ВАЖЛИВО: Спочатку обмінюємо code на токени
    await amoCrmService.exchangeCode(code as string);
    // ✅ CRM вже верифікована! Токени збережені в БД

    // Тепер показуємо HTML з кнопкою
    // ⚠️ ВАЖЛИВО: Не передаємо code в deep link
    const deepLink = `foryoure://amo-crm/callback?success=true&state=${state || ''}`;
    
    return res.send(`
      <!DOCTYPE html>
      <html>
        <!-- ... HTML з кнопкою "Return to App" ... -->
        <button onclick="window.open('${deepLink}', '_self')">Return to App</button>
      </html>
    `);
  } catch (error: any) {
    // ... обробка помилки ...
  }
});
```

---

### 📁 Файл 2: Мобільний додаток - Callback Screen

**Шлях:** `mobile/app/amo-crm/callback.tsx`

**Змінити `useLocalSearchParams`:**
```typescript
// Було
const { code, state, error: errorParam } = useLocalSearchParams();

// Стало
const { code, success, state, error: errorParam } = useLocalSearchParams();
```

**Змінити `useEffect`:**
```typescript
// Було
useEffect(() => {
  if (errorParam) {
    setStatus('error');
    return;
  }
  if (code && typeof code === 'string') {
    handleCallback(code);
  }
}, [code, errorParam]);

// Стало
useEffect(() => {
  if (errorParam) {
    setStatus('error');
    setErrorMessage('Помилка авторизації. Спробуйте ще раз.');
    return;
  }

  // Якщо success=true - backend вже обміняв code на токени
  if (success === 'true') {
    handleCallback(undefined, success);
  } else if (code && typeof code === 'string') {
    // Якщо є code - спробувати обміняти (fallback для старих версій)
    handleCallback(code, undefined);
  } else {
    setStatus('error');
    setErrorMessage('Код авторизації відсутній.');
  }
}, [code, success, errorParam]);
```

**Змінити `handleCallback`:**
```typescript
// Було
const handleCallback = async (code: string) => {
  try {
    setStatus('processing');
    
    // Обміняти code на токени
    await amoCrmApi.exchangeCode(code); // ❌ 403 помилка!
    
    // Оновити кеш статусу
    await queryClient.invalidateQueries({ queryKey: ['amo-crm-status'] });
    
    setStatus('success');
    setTimeout(() => {
      router.replace('/(tabs)/crm');
    }, 1500);
  } catch (error: any) {
    // ...
  }
};

// Стало
const handleCallback = async (code: string | undefined, success: string | undefined) => {
  try {
    setStatus('processing');
    
    // ⚠️ ВАЖЛИВО: Backend вже обміняв code на токени в callback endpoint
    // Токени вже збережені в БД, тому нам не потрібно викликати exchange-code знову
    // Просто оновлюємо статус та повертаємося на CRM сторінку
    
    // Оновити кеш статусу - це викличе GET /api/amo-crm/status
    await queryClient.invalidateQueries({ queryKey: ['amo-crm-status'] });
    
    // Також оновити leads, щоб вони завантажилися
    await queryClient.invalidateQueries({ queryKey: ['leads'] });
    
    setStatus('success');
    
    // Повернутися на CRM сторінку через 1 секунду
    setTimeout(() => {
      router.replace('/(tabs)/crm');
    }, 1000);
  } catch (error: any) {
    console.error('Error processing callback:', error);
    setStatus('error');
    setErrorMessage(
      error?.response?.data?.message || 
      error?.message || 
      'Помилка при обробці підключення до AMO CRM. Спробуйте ще раз.'
    );
  }
};
```

---

### 📁 Файл 3: Мобільний додаток - CRM Screen

**Шлях:** `mobile/app/(tabs)/crm.tsx`

**Додати імпорти:**
```typescript
// Було
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';

// Стало
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
```

**Додати після `useQuery` для `amoStatus`:**
```typescript
// Знайти рядок після:
const { data: amoStatus, isLoading: amoStatusLoading, refetch: refetchAmoStatus } = useQuery({
  // ...
});

// Додати після нього:
// Оновити статус AMO CRM при фокусі на сторінку (після повернення з callback)
useFocusEffect(
  useCallback(() => {
    // Оновити статус AMO CRM при поверненні на сторінку
    if (!authLoading && isAuthenticated) {
      refetchAmoStatus();
    }
  }, [authLoading, isAuthenticated, refetchAmoStatus])
);
```

---

## 🔑 Ключові зміни

### 1. Backend: Не передає code в deep link

**Чому:**
- Backend вже обміняв `code` на токени ПЕРЕД показом HTML
- Токени збережені в БД
- Не потрібно передавати `code` в додаток

**Що змінити:**
```typescript
// Було
const deepLink = `foryoure://amo-crm/callback?code=${code}&state=${state || ''}`;

// Стало
const deepLink = `foryoure://amo-crm/callback?success=true&state=${state || ''}`;
```

### 2. Мобільний додаток: Не викликає exchange-code

**Чому:**
- Токени вже збережені в backend
- Просто оновлюємо статус через `GET /api/amo-crm/status`
- Немає 403 помилки

**Що змінити:**
```typescript
// Було
await amoCrmApi.exchangeCode(code); // ❌ 403 помилка!

// Стало
// Просто оновлюємо статус - токени вже збережені
await queryClient.invalidateQueries({ queryKey: ['amo-crm-status'] });
await queryClient.invalidateQueries({ queryKey: ['leads'] });
```

### 3. Оновлення статусу при поверненні на CRM сторінку

**Чому:**
- Після повернення з callback статус може не оновитися автоматично
- `useFocusEffect` гарантує оновлення при фокусі на сторінку

**Що додати:**
```typescript
useFocusEffect(
  useCallback(() => {
    if (!authLoading && isAuthenticated) {
      refetchAmoStatus();
    }
  }, [authLoading, isAuthenticated, refetchAmoStatus])
);
```

---

## ✅ Чеклист виконання

### Backend:
- [ ] Відкрити `admin-panel-backend/src/routes/amo-crm.routes.ts`
- [ ] Знайти метод `router.get('/callback', ...)`
- [ ] Знайти рядок з `deepLink = 'foryoure://amo-crm/callback?code=...'`
- [ ] Замінити на `deepLink = 'foryoure://amo-crm/callback?success=true&...'`
- [ ] Перевірити, що `await amoCrmService.exchangeCode(code)` викликається ПЕРЕД `res.send()`
- [ ] Зберегти файл
- [ ] Перезапустити backend

### Мобільний додаток:
- [ ] Відкрити `mobile/app/amo-crm/callback.tsx`
- [ ] Додати `success` в `useLocalSearchParams()`
- [ ] Оновити `useEffect` для обробки `success === 'true'`
- [ ] Оновити `handleCallback` - прибрати виклик `amoCrmApi.exchangeCode()`
- [ ] Додати `invalidateQueries` для `['leads']`
- [ ] Зберегти файл

- [ ] Відкрити `mobile/app/(tabs)/crm.tsx`
- [ ] Додати імпорти `useCallback` та `useFocusEffect`
- [ ] Додати `useFocusEffect` для оновлення статусу
- [ ] Зберегти файл

---

## 🧪 Тестування

Після виконання всіх змін:

1. **Перезапустити backend** (якщо змінювали)
2. **Перезапустити мобільний додаток** (якщо змінювали)
3. Відкрити мобільний додаток
4. Натиснути "Підключити AMO CRM"
5. Авторизуватись в AMO CRM
6. Натиснути "РАЗРЕШИТЬ"
7. Натиснути "Return to App"
8. **Очікуваний результат:**
   - ✅ Немає 403 помилки
   - ✅ Статус AMO CRM оновлюється на "Підключено"
   - ✅ Leads завантажуються
   - ✅ Показується список leads замість "Підключіть АМО CRM"

---

## 📝 Примітки

### Чому не передаємо code в deep link?

1. **Backend вже обміняв code** - токени збережені в БД
2. **Немає потреби обмінювати знову** - це викликає 403 помилку
3. **Просто оновлюємо статус** - через `GET /api/amo-crm/status`

### Чому useFocusEffect?

1. **Гарантує оновлення** - при поверненні на сторінку
2. **Автоматично спрацьовує** - не потрібно вручну оновлювати
3. **Працює з React Query** - інвалідує кеш та завантажує нові дані

---

## 🔍 Діагностика

### Якщо все ще показується "Підключіть АМО CRM":

1. Перевірте, чи оновили deep link в backend (`?success=true`)
2. Перевірте, чи `useFocusEffect` додано в `crm.tsx`
3. Перевірте логи - чи викликається `GET /api/amo-crm/status`
4. Перевірте, чи токени збережені в БД для користувача

### Якщо все ще 403 помилка:

1. Перевірте, чи прибрали виклик `amoCrmApi.exchangeCode()` з `callback.tsx`
2. Перевірте, чи обробляєте `success === 'true'` в `useEffect`

### Якщо leads не завантажуються:

1. Перевірте, чи додали `invalidateQueries({ queryKey: ['leads'] })` в `callback.tsx`
2. Перевірте, чи `GET /api/v1/leads` працює (перевірте в браузері з JWT токеном)
3. Перевірте, чи користувач має доступ до leads (перевірте права доступу)

---

## 📁 Файли для зміни

1. ✅ `admin-panel-backend/src/routes/amo-crm.routes.ts` - змінити deep link
2. ✅ `mobile/app/amo-crm/callback.tsx` - прибрати виклик exchange-code
3. ✅ `mobile/app/(tabs)/crm.tsx` - додати useFocusEffect

---

**Останнє оновлення:** Січень 2025
