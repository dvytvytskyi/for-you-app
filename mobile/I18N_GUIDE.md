# 🌍 Internationalization (i18n) Guide

## Архітектура перекладів

Проект використовує **i18n-js** + **expo-localization** + **Zustand** для керування перекладами.

### Підтримувані мови:
- 🇬🇧 **English** (`en`) - за замовчуванням
- 🇺🇦 **Ukrainian** (`ua`)
- 🇷🇺 **Russian** (`ru`)

---

## 📁 Структура файлів

```
/mobile
  /locales
    /en
      common.json      # Загальні тексти (кнопки, помилки)
      profile.json     # Екрани профілю
      # auth.json      # (TODO) Екрани авторизації
      # home.json      # (TODO) Головний екран
      # properties.json # (TODO) Нерухомість
    /ua
      common.json
      profile.json
      # ...
    /ru
      common.json
      profile.json
      # ...
  /store
    languageStore.ts   # Zustand store для мови
  /utils
    i18n.ts           # Конфігурація i18n
```

---

## 🚀 Як використовувати

### 1. У компонентах (з реактивністю)

```typescript
import { useTranslation } from '@/utils/i18n';

export default function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <Text>{t('common.save')}</Text>
    <Text>{t('profile.editProfile')}</Text>
  );
}
```

### 2. Поза компонентами (без реактивності)

```typescript
import { t } from '@/utils/i18n';

// В функціях, Alert.alert, тощо
Alert.alert(t('common.success'), t('profile.passwordChangedSuccess'));
```

### 3. Зміна мови

```typescript
import { useLanguageStore } from '@/store/languageStore';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguageStore();
  
  return (
    <Button onPress={() => setLanguage('ua')}>
      Українська
    </Button>
  );
}
```

### 4. Отримання поточної мови

```typescript
import { useLanguageStore } from '@/store/languageStore';

const currentLanguage = useLanguageStore.getState().language;
```

---

## 📝 Додавання нових перекладів

### Крок 1: Додайте ключі до JSON файлів

**en/common.json:**
```json
{
  "myNewKey": "My New Text"
}
```

**ua/common.json:**
```json
{
  "myNewKey": "Мій новий текст"
}
```

**ru/common.json:**
```json
{
  "myNewKey": "Мой новый текст"
}
```

### Крок 2: Використайте у компоненті

```typescript
<Text>{t('common.myNewKey')}</Text>
```

---

## 📦 Додавання нового модуля перекладів

### Приклад: Додаємо переклади для екранів auth

1. **Створіть файли:**
   - `/locales/en/auth.json`
   - `/locales/ua/auth.json`
   - `/locales/ru/auth.json`

2. **Додайте переклади в кожен файл:**

```json
// en/auth.json
{
  "login": "Login",
  "register": "Register",
  "forgotPassword": "Forgot Password?"
}
```

3. **Імпортуйте в `utils/i18n.ts`:**

```typescript
import enAuth from '@/locales/en/auth.json';
import uaAuth from '@/locales/ua/auth.json';
import ruAuth from '@/locales/ru/auth.json';

export const i18n = new I18n({
  en: {
    common: enCommon,
    profile: enProfile,
    auth: enAuth,  // ← додайте
  },
  ua: {
    common: uaCommon,
    profile: uaProfile,
    auth: uaAuth,  // ← додайте
  },
  ru: {
    common: ruCommon,
    profile: ruProfile,
    auth: ruAuth,  // ← додайте
  },
});
```

4. **Використайте:**

```typescript
<Text>{t('auth.login')}</Text>
```

---

## 🎯 Приклади використання

### Alert з перекладами

```typescript
const { t } = useTranslation();

Alert.alert(
  t('common.warning'),
  t('common.unsavedChangesMessage'),
  [
    { text: t('common.cancel'), style: 'cancel' },
    { text: t('common.ok'), onPress: handleConfirm }
  ]
);
```

### Переклади з параметрами

```typescript
// В JSON:
{
  "welcome": "Welcome, {{name}}!"
}

// У компоненті:
t('common.welcome', { name: 'John' })
// Результат: "Welcome, John!"
```

### Умовні переклади

```typescript
const role = user.role;
const text = t(`profile.${role}Description`);
```

---

## ✅ Готові модулі

- ✅ **common** - загальні тексти
- ✅ **profile** - всі екрани профілю
- ✅ **home** - головний екран Dashboard
- ✅ **auth** - всі екрани авторизації (intro, login, sign-up-general, sign-up-details, sign-up-investor, sign-up-agent)
- ✅ **tabs** - всі tab екрани (properties, liked, collections, crm, map)

## 📋 TODO: Треба застосувати

Файли перекладів створені, тепер потрібно застосувати їх у компонентах:

- ⏳ **auth екрани** - додати useTranslation() та замінити тексти
- ⏳ **tab екрани** - додати useTranslation() та замінити тексти
- ⏳ **UI компоненти** - SearchBar, PropertyTypeFilter, Header тощо

---

## 🔄 Автоматична ініціалізація

Мова ініціалізується автоматично при старті додатку:

1. Перевіряє збережену мову в AsyncStorage
2. Якщо немає - використовує мову пристрою
3. Fallback на англійську якщо мова не підтримується

---

## 🛠️ Налагодження

### Перевірити поточну мову:
```typescript
console.log(useLanguageStore.getState().language);
```

### Очистити збережену мову:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.removeItem('language-storage');
```

### Перевірити чи ключ існує:
```typescript
const exists = i18n.translations[i18n.locale]?.common?.myKey;
console.log('Key exists:', exists);
```

---

## 📚 Ресурси

- [i18n-js Documentation](https://github.com/fnando/i18n-js)
- [expo-localization](https://docs.expo.dev/versions/latest/sdk/localization/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

**Створено:** 30 Жовтня 2025
**Статус:** ✅ Готово до використання

