# Налаштування Push-сповіщень (Notifications)

## Архітектура

Для Expo додатків використовується **Expo Push Notifications API** - це стандартний та найпростіший спосіб для Expo додатків. Не потрібно налаштування Firebase на мобільному додатку.

### Як це працює:

1. **Мобільний додаток** використовує `expo-notifications` для отримання Expo Push Token
2. **Бекенд** використовує Expo Push API для відправки сповіщень
3. Expo автоматично обробляє доставку на iOS (через APNs) та Android (через FCM)

## Що потрібно налаштувати на бекенді

### Варіант 1: Використовувати Expo Push API (рекомендовано)

Бекенд відправляє сповіщення через Expo Push API. Це простіше і не потребує Firebase налаштувань.

#### Налаштування:

1. **Отримайте Expo Access Token (опціонально, для production):**
   - Перейдіть на [Expo Dashboard](https://expo.dev/accounts/[your-account]/settings/access-tokens)
   - Створіть новий Access Token з правами на відправку сповіщень
   - Скопіюйте токен

2. **Додайте в `.env` файл бекенду (опціонально):**
   ```env
   EXPO_ACCESS_TOKEN=your-expo-access-token
   ```
   
   **Примітка:** Access Token не обов'язковий для розробки, але рекомендується для production.

3. **Готово!** Бекенд вже налаштований:
   - `ExpoPushService` створено в `backend/src/integrations/expo-push/`
   - `NotificationsService` автоматично використовує Expo Push API для Expo Push Token
   - Firebase залишається для FCM токенів (якщо потрібно)

### Варіант 2: Залишити Firebase (якщо вже налаштовано)

Якщо Firebase вже налаштований і працює, можна залишити його, але потрібно:

1. **Налаштувати Firebase credentials** (як описано нижче)
2. **Мобільний додаток** буде отримувати FCM token через `expo-notifications`
3. **Бекенд** продовжує використовувати Firebase Admin SDK

#### Firebase налаштування (якщо використовуєте Варіант 2):

##### Через файл Service Account (рекомендовано для розробки):

1. Перейдіть в [Firebase Console](https://console.firebase.google.com/)
2. Виберіть ваш проект або створіть новий
3. Перейдіть в **Project Settings** → **Service Accounts**
4. Натисніть **Generate New Private Key**
5. Збережіть JSON файл (наприклад, `firebase-service-account.json`)
6. Розмістіть файл в папці `backend/` (додайте до `.gitignore`!)
7. Додайте в `.env` файл:
   ```env
   FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
   FIREBASE_PROJECT_ID=your-project-id
   ```

##### Через змінні середовища (рекомендовано для production):

1. Отримайте Service Account JSON з Firebase Console
2. Витягніть з нього:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (замініть `\n` на реальні переноси рядків або використовуйте `\\n`)
3. Додайте в `.env` файл:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

## Рекомендація: Використовувати Expo Push API

**Переваги Expo Push API:**
- ✅ Не потрібно налаштування Firebase на мобільному додатку
- ✅ Не потрібно налаштування APNs сертифікатів
- ✅ Простіше в налаштуванні
- ✅ Автоматична обробка iOS та Android
- ✅ Безкоштовно до 1 мільйона сповіщень на місяць
- ✅ Працює з Expo Go для розробки

**Недоліки:**
- ⚠️ Залежність від Expo сервісу
- ⚠️ Для production може знадобитися Expo EAS Build

**Важливо:** Бекенд автоматично визначає тип токену:
- Якщо токен починається з `ExponentPushToken[` - використовується Expo Push API
- Якщо токен інший формат - використовується Firebase (якщо налаштовано)

## Структура API

### Endpoints

- `POST /api/v1/notifications/devices` - Реєстрація пристрою (зберігає Expo Push Token)
- `DELETE /api/v1/notifications/devices/:token` - Видалення пристрою
- `GET /api/v1/notifications/devices` - Отримати всі пристрої
- `GET /api/v1/notifications/settings` - Отримати налаштування
- `PUT /api/v1/notifications/settings` - Оновити налаштування
- `GET /api/v1/notifications` - Історія сповіщень (з пагінацією)
- `GET /api/v1/notifications/unread-count` - Кількість непрочитаних
- `PUT /api/v1/notifications/:id/read` - Позначити як прочитане
- `PUT /api/v1/notifications/read-all` - Позначити всі як прочитані

### Типи сповіщень

- `lead_created` - Створення нової заявки
- `lead_assigned` - Призначення заявки брокеру
- `lead_status_changed` - Зміна статусу заявки
- `new_property` - Нова нерухомість
- `price_changed` - Зміна ціни
- `new_exclusive_property` - Нова ексклюзивна нерухомість
- `system` - Системні сповіщення
- `marketing` - Маркетингові сповіщення

## Мобільний додаток

API клієнт створено в `mobile/api/notifications.ts`. 

Для використання потрібно:
1. Встановити `expo-notifications`: `npx expo install expo-notifications`
2. Отримати Expo Push Token через `expo-notifications`
3. Зареєструвати пристрій через `notificationsApi.registerDevice()` з Expo Push Token
4. Налаштувати обробку сповіщень через `expo-notifications`

## Додаткові ресурси

- [Expo Push Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo Push API Documentation](https://docs.expo.dev/push-notifications/sending-notifications/)
- [Expo Push Notification Tool](https://expo.dev/notifications)
