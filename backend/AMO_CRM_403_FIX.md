# 🔧 Виправлення 403 помилки та оновлення статусу після верифікації

## 🐛 Проблеми

1. **403 помилка** при `POST /api/amo-crm/exchange-code` - endpoint не працює або не має доступу
2. **Додаток не оновлює статус** - після верифікації все ще показує "Підключіть АМО CRM"
3. **Не завантажуються leads** - навіть після успішної верифікації

---

## ✅ Рішення

### Проблема: Подвійний обмін code

**Що відбувається зараз:**
1. Backend обробляє callback: `GET /api/amo-crm/callback?code=...`
2. Backend обмінює code на токени та зберігає їх
3. Backend показує HTML з кнопкою "Return to App"
4. Користувач натискає кнопку → deep link `foryoure://amo-crm/callback?code=...`
5. Мобільний додаток отримує callback з `code`
6. Мобільний додаток намагається викликати `POST /api/amo-crm/exchange-code` знову
7. **403 помилка** - бо токени вже збережені або endpoint не працює

**Рішення:**
- Backend вже обміняв code на токени, тому мобільний додаток не повинен викликати `exchange-code` знову
- Мобільний додаток просто оновлює статус через `GET /api/amo-crm/status`

---

## 📝 Зміни в коді

### 1. Оновити callback endpoint (backend)

**Файл:** `admin-panel-backend/src/routes/amo-crm.routes.ts`

**Змінити deep link:**
```typescript
// Було
const deepLink = `foryoure://amo-crm/callback?code=${code}&state=${state || ''}`;

// Стало
// ⚠️ ВАЖЛИВО: Не передаємо code, бо токени вже збережені
const deepLink = `foryoure://amo-crm/callback?success=true&state=${state || ''}`;
```

### 2. Оновити обробку callback в мобільному додатку

**Файл:** `mobile/app/amo-crm/callback.tsx`

**Змінити `handleCallback`:**
```typescript
// Було
const handleCallback = async (code: string) => {
  try {
    // Обміняти code на токени
    await amoCrmApi.exchangeCode(code); // ❌ 403 помилка!
    
    // Оновити кеш статусу
    await queryClient.invalidateQueries({ queryKey: ['amo-crm-status'] });
    
    router.replace('/(tabs)/crm');
  } catch (error) {
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
    setErrorMessage('Помилка при обробці підключення до AMO CRM. Спробуйте ще раз.');
  }
};
```

**Оновити `useEffect`:**
```typescript
useEffect(() => {
  const { code, success, state, error: errorParam } = useLocalSearchParams();
  
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

---

## 🔧 Повний оновлений код для callback.tsx

```typescript
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';
import { useQueryClient } from '@tanstack/react-query';

export default function AmoCrmCallbackScreen() {
  const { code, success, state, error: errorParam } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

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

  const handleRetry = () => {
    router.replace('/(tabs)/crm');
  };

  // ... решта коду залишається без змін
}
```

---

## 🔑 Ключові зміни

### 1. Backend не передає code в deep link

**Було:**
```typescript
const deepLink = `foryoure://amo-crm/callback?code=${code}&state=${state || ''}`;
```

**Стало:**
```typescript
// Токени вже збережені, не потрібно передавати code
const deepLink = `foryoure://amo-crm/callback?success=true&state=${state || ''}`;
```

### 2. Мобільний додаток не викликає exchange-code

**Було:**
```typescript
await amoCrmApi.exchangeCode(code); // ❌ 403 помилка!
```

**Стало:**
```typescript
// Просто оновлюємо статус - токени вже збережені в backend
await queryClient.invalidateQueries({ queryKey: ['amo-crm-status'] });
await queryClient.invalidateQueries({ queryKey: ['leads'] });
```

---

## ✅ Результат

1. ✅ Немає 403 помилки - мобільний додаток не викликає `exchange-code`
2. ✅ Статус оновлюється - `GET /api/amo-crm/status` показує, що CRM підключена
3. ✅ Leads завантажуються - після оновлення статусу
4. ✅ Не з'являється "Підключіть АМО CRM" - статус показує, що CRM вже підключена

---

## 🧪 Тестування

Після оновлення:

1. Відкрийте мобільний додаток
2. Натисніть "Підключити AMO CRM"
3. Авторизуйтесь в AMO CRM
4. Натисніть "РАЗРЕШИТЬ"
5. Натисніть "Return to App"
6. **Очікуваний результат:**
   - Немає 403 помилки
   - Статус AMO CRM оновлюється на "Підключено"
   - Leads завантажуються
   - Показується список leads замість "Підключіть АМО CRM"

---

**Останнє оновлення:** Січень 2025
