# 🔐 AMO CRM Авторизація в Мобільному Додатку

## 📋 Огляд

Цей документ описує, як реалізувати авторизацію AMO CRM для агентів (брокерів) в мобільному додатку.

---

## 🎯 Як це працює в більшості додатків

### Варіанти авторизації:

1. **OAuth2 через системний браузер + Deep Linking** ⭐ (Найкраще)
   - Відкривається системний браузер
   - Користувач авторизується в AMO CRM
   - Redirect на deep link: `foryouapp://amo-crm/callback?code=...`
   - Додаток обробляє callback

2. **OAuth2 через WebView** (Простіше, але менш безпечно)
   - Відкривається WebView всередині додатка
   - Користувач авторизується
   - Перехоплюється redirect URL

3. **API ключ** (Найпростіше, але найменш безпечно)
   - Користувач вводить API ключ вручну
   - Обмін API ключа на OAuth токени

**Рекомендація:** Використовувати **OAuth2 через системний браузер + Deep Linking** (варіант 1).

---

## 🏗️ Архітектура

```
Mobile App → Backend API → AMO CRM OAuth
     ↓              ↓
  WebView      Exchange Code
     ↓              ↓
  Callback    Save Tokens
     ↓              ↓
  Success     Return Status
```

---

## 📱 Реалізація в Мобільному Додатку

### Крок 1: Перевірка статусу підключення

При заході на CRM сторінку перевіряємо чи користувач підключений до AMO CRM.

**Backend endpoint:**
```typescript
GET /api/v1/integrations/amo-crm/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "connected": false,
    "hasTokens": false,
    "domain": "reforyou.amocrm.ru",
    "accountId": "31920194"
  }
}
```

---

### Крок 2: Екран авторизації AMO CRM

Якщо `connected: false`, показуємо екран авторизації.

**UI компонент:** `mobile/components/amo-crm/AmoCrmAuthScreen.tsx`

```typescript
interface AmoCrmAuthScreenProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AmoCrmAuthScreen({ onSuccess, onCancel }: AmoCrmAuthScreenProps) {
  // Показуємо:
  // 1. Іконку AMO CRM
  // 2. Текст: "Підключіть свій акаунт AMO CRM"
  // 3. Кнопку "Підключити"
  // 4. Інструкції
}
```

---

### Крок 3: OAuth Flow

#### Варіант A: Через системний браузер (Рекомендовано)

**1. Створити OAuth URL:**

```typescript
const buildAmoAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: '2912780f-a1e4-4d5d-a069-ee01422d8bef',
    redirect_uri: 'foryouapp://amo-crm/callback',
    response_type: 'code',
    state: generateState(), // Для безпеки
  });
  
  return `https://reforyou.amocrm.ru/oauth?${params.toString()}`;
};
```

**2. Відкрити системний браузер:**

```typescript
import * as Linking from 'expo-linking';

const handleConnect = async () => {
  const authUrl = buildAmoAuthUrl();
  await Linking.openURL(authUrl);
};
```

**3. Налаштувати Deep Link:**

**`app.json` або `app.config.js`:**
```json
{
  "expo": {
    "scheme": "foryouapp",
    "ios": {
      "associatedDomains": ["applinks:foryouapp.com"]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "foryouapp",
              "host": "amo-crm",
              "pathPrefix": "/callback"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

**4. Обробити callback:**

**`mobile/app/amo-crm/callback.tsx`:**
```typescript
import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { amoCrmApi } from '@/api/amo-crm';

export default function AmoCrmCallbackScreen() {
  const { code, state } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (code) {
      handleCallback(code as string);
    }
  }, [code]);

  const handleCallback = async (code: string) => {
    try {
      // Відправити code на backend для обміну на токени
      await amoCrmApi.exchangeCode(code);
      
      // Повернутися на CRM сторінку
      router.replace('/(tabs)/crm');
    } catch (error) {
      console.error('Error exchanging code:', error);
      router.replace('/(tabs)/crm?error=auth_failed');
    }
  };

  return <ActivityIndicator />;
}
```

---

#### Варіант B: Через WebView (Альтернатива)

**1. Створити WebView компонент:**

```typescript
import { WebView } from 'react-native-webview';

export function AmoCrmAuthWebView({ onSuccess, onCancel }: Props) {
  const authUrl = buildAmoAuthUrl();

  const handleNavigationStateChange = (navState: any) => {
    const url = navState.url;
    
    // Перехоплюємо redirect URL
    if (url.includes('foryouapp://amo-crm/callback')) {
      const code = extractCodeFromUrl(url);
      if (code) {
        onSuccess(code);
      }
    }
  };

  return (
    <WebView
      source={{ uri: authUrl }}
      onNavigationStateChange={handleNavigationStateChange}
      startInLoadingState
    />
  );
}
```

---

### Крок 4: API клієнт для авторизації

**Оновити `mobile/api/amo-crm.ts`:**

```typescript
export const amoCrmApi = {
  // ... існуючі методи

  /**
   * Перевірити статус підключення AMO CRM
   */
  async getConnectionStatus(): Promise<{
    connected: boolean;
    hasTokens: boolean;
    domain: string;
    accountId: string;
  }> {
    const response = await backendApiClient.get('/integrations/amo-crm/status');
    return response.data.data;
  },

  /**
   * Обміняти authorization code на токени
   */
  async exchangeCode(code: string): Promise<void> {
    await backendApiClient.post('/integrations/amo-crm/exchange-code', {
      code,
    });
  },

  /**
   * Відключити AMO CRM
   */
  async disconnect(): Promise<void> {
    await backendApiClient.post('/integrations/amo-crm/disconnect');
  },
};
```

---

### Крок 5: Backend Endpoints

**Додати в `backend/src/integrations/amo-crm/amo-crm.controller.ts`:**

```typescript
/**
 * GET /integrations/amo-crm/status
 * Перевірити статус підключення для поточного користувача
 */
@Get('status')
@UseGuards(JwtAuthGuard)
async getConnectionStatus(@CurrentUser() user: User) {
  const status = await this.amoCrmService.getUserConnectionStatus(user.id);
  return {
    success: true,
    data: status,
  };
}

/**
 * POST /integrations/amo-crm/exchange-code
 * Обміняти authorization code на токени (для конкретного користувача)
 */
@Post('exchange-code')
@UseGuards(JwtAuthGuard)
async exchangeCode(
  @CurrentUser() user: User,
  @Body() body: { code: string },
) {
  await this.amoCrmService.exchangeCodeForUser(user.id, body.code);
  return {
    success: true,
    message: 'AMO CRM successfully connected',
  };
}

/**
 * POST /integrations/amo-crm/disconnect
 * Відключити AMO CRM для користувача
 */
@Post('disconnect')
@UseGuards(JwtAuthGuard)
async disconnect(@CurrentUser() user: User) {
  await this.amoCrmService.disconnectUser(user.id);
  return {
    success: true,
    message: 'AMO CRM disconnected',
  };
}
```

---

### Крок 6: Зберігання токенів для кожного користувача

**Оновити `AmoToken` entity:**

```typescript
@Entity('amo_tokens')
export class AmoToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string; // ID користувача (брокера)

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'access_token', type: 'text' })
  accessToken: string;

  @Column({ name: 'refresh_token', type: 'text' })
  refreshToken: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  // ... інші поля
}
```

**Оновити `AmoCrmService`:**

```typescript
async getUserConnectionStatus(userId: string) {
  const token = await this.amoTokenRepository.findOne({
    where: { userId },
  });

  return {
    connected: !!token && token.expiresAt > new Date(),
    hasTokens: !!token,
    domain: process.env.AMO_DOMAIN,
    accountId: process.env.AMO_ACCOUNT_ID,
  };
}

async exchangeCodeForUser(userId: string, code: string) {
  // Обміняти code на токени
  const authResponse = await this.exchangeCode(code);
  
  // Зберегти токени для користувача
  await this.saveTokensForUser(userId, authResponse);
}

async saveTokensForUser(userId: string, authData: AmoAuthResponse) {
  const expiresAt = new Date(Date.now() + authData.expires_in * 1000);
  
  const existingToken = await this.amoTokenRepository.findOne({
    where: { userId },
  });

  if (existingToken) {
    existingToken.accessToken = authData.access_token;
    existingToken.refreshToken = authData.refresh_token;
    existingToken.expiresAt = expiresAt;
    await this.amoTokenRepository.save(existingToken);
  } else {
    const token = this.amoTokenRepository.create({
      userId,
      accessToken: authData.access_token,
      refreshToken: authData.refresh_token,
      expiresAt,
    });
    await this.amoTokenRepository.save(token);
  }
}
```

---

## 🎨 UI/UX Flow

### Сценарій 1: Перший вхід на CRM сторінку

1. Користувач заходить на `/crm`
2. Перевіряємо статус: `GET /api/v1/integrations/amo-crm/status`
3. Якщо `connected: false`:
   - Показуємо екран авторизації
   - Кнопка "Підключити AMO CRM"
   - Інструкції: "Для роботи з CRM потрібно підключити ваш акаунт AMO CRM"
4. Користувач натискає "Підключити"
5. Відкривається системний браузер з OAuth
6. Користувач авторизується в AMO CRM
7. Redirect на `foryouapp://amo-crm/callback?code=...`
8. Додаток обробляє callback
9. Повертаємося на CRM сторінку
10. Показуємо успішне повідомлення

### Сценарій 2: Вже підключений

1. Користувач заходить на `/crm`
2. Перевіряємо статус: `connected: true`
3. Показуємо звичайний CRM екран
4. Можна додати індикатор: "✅ Підключено до AMO CRM"

---

## 📝 Компоненти для створення

### 1. `AmoCrmAuthScreen.tsx`

```typescript
export function AmoCrmAuthScreen({ onConnect, onCancel }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="business-outline" size={64} />
      <Text style={styles.title}>Підключіть AMO CRM</Text>
      <Text style={styles.description}>
        Для роботи з CRM потрібно підключити ваш акаунт AMO CRM
      </Text>
      <Button onPress={onConnect}>Підключити</Button>
      <Button variant="outline" onPress={onCancel}>Скасувати</Button>
    </View>
  );
}
```

### 2. `AmoCrmStatusBadge.tsx`

```typescript
export function AmoCrmStatusBadge({ connected }: { connected: boolean }) {
  if (!connected) return null;
  
  return (
    <View style={styles.badge}>
      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
      <Text style={styles.text}>Підключено до AMO CRM</Text>
    </View>
  );
}
```

### 3. Оновити `crm.tsx`

```typescript
const { data: amoStatus } = useQuery({
  queryKey: ['amo-crm-status'],
  queryFn: () => amoCrmApi.getConnectionStatus(),
});

if (!amoStatus?.connected) {
  return <AmoCrmAuthScreen onConnect={handleConnect} />;
}

return (
  <View>
    <AmoCrmStatusBadge connected={amoStatus.connected} />
    {/* Звичайний CRM екран */}
  </View>
);
```

---

## 🔒 Безпека

### 1. State параметр
- Генерувати випадковий `state` для кожного OAuth запиту
- Перевіряти `state` при callback
- Захист від CSRF атак

### 2. Токени
- Зберігати токени в БД (не в мобільному додатку)
- Кожен користувач має свої токени
- Автоматичне оновлення через `refresh_token`

### 3. Deep Linking
- Валідація URL при callback
- Перевірка `code` параметра
- Обробка помилок

---

## ✅ Чеклист реалізації

### Backend:
- [ ] Додати `userId` в `AmoToken` entity
- [ ] Створити `getUserConnectionStatus(userId)`
- [ ] Створити `exchangeCodeForUser(userId, code)`
- [ ] Створити `disconnectUser(userId)`
- [ ] Endpoint: `GET /integrations/amo-crm/status`
- [ ] Endpoint: `POST /integrations/amo-crm/exchange-code`
- [ ] Endpoint: `POST /integrations/amo-crm/disconnect`

### Mobile:
- [ ] Налаштувати deep linking (`foryouapp://amo-crm/callback`)
- [ ] Створити `AmoCrmAuthScreen` компонент
- [ ] Створити `AmoCrmStatusBadge` компонент
- [ ] Створити `amo-crm/callback.tsx` екран
- [ ] Оновити `amo-crm.ts` API клієнт
- [ ] Оновити `crm.tsx` для перевірки статусу
- [ ] Додати обробку помилок

### Тестування:
- [ ] Тест першого підключення
- [ ] Тест callback обробки
- [ ] Тест відключення
- [ ] Тест оновлення токенів
- [ ] Тест помилок авторизації

---

## 📚 Корисні посилання

- [Expo Linking](https://docs.expo.dev/versions/latest/sdk/linking/)
- [Deep Linking в React Native](https://reactnative.dev/docs/linking)
- [OAuth2 в AMO CRM](https://www.amocrm.ru/developers/content/oauth/step-by-step)

---

**Останнє оновлення:** Грудень 2025
