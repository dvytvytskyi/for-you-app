# 🔧 AMO CRM Mobile - Вимоги до Бекенду

## 📋 Огляд

Цей документ описує, що потрібно додати/змінити на бекенді для підтримки авторизації AMO CRM в мобільному додатку.

---

## ⚠️ Важливі зміни

### 1. Додати `userId` в `AmoCrmToken`

**Поточна структура:**
- Токени глобальні (один для всіх)

**Потрібна структура:**
- Кожен користувач (брокер) має свої токени

**Зміни в Entity:**

```typescript
@Entity('amo_crm_tokens')
export class AmoCrmToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string; // ⭐ ДОДАТИ

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User; // ⭐ ДОДАТИ

  @Column({ name: 'access_token', type: 'text' })
  accessToken: string;

  @Column({ name: 'refresh_token', type: 'text' })
  refreshToken: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  // ... інші поля
}
```

**SQL Міграція:**

```sql
-- Додати user_id до amo_crm_tokens
ALTER TABLE amo_crm_tokens 
ADD COLUMN user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE;

-- Створити індекс
CREATE INDEX idx_amo_crm_tokens_user_id ON amo_crm_tokens(user_id);

-- Видалити стару унікальність (якщо була)
-- Додати нову унікальність по user_id
CREATE UNIQUE INDEX idx_amo_crm_tokens_user_id_unique ON amo_crm_tokens(user_id);
```

---

### 2. Оновити Endpoints для підтримки користувачів

#### `GET /api/amo-crm/status`

**Поточна реалізація:** Тільки для адмінів

**Потрібна реалізація:** Для всіх авторизованих користувачів

```typescript
@Get('status')
@UseGuards(JwtAuthGuard) // ⚠️ Прибрати requireAdmin
async getConnectionStatus(@CurrentUser() user: User) {
  const status = await this.amoCrmService.getUserConnectionStatus(user.id);
  return {
    success: true,
    data: status,
  };
}
```

---

#### `POST /api/amo-crm/exchange-code`

**Новий endpoint** (якщо ще немає)

```typescript
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
```

---

#### `POST /api/amo-crm/disconnect`

**Новий endpoint** (якщо ще немає)

```typescript
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

### 3. Оновити AmoCrmService

#### Додати методи для роботи з користувачами:

```typescript
async getUserConnectionStatus(userId: string): Promise<{
  connected: boolean;
  hasTokens: boolean;
  domain: string;
  accountId: string;
}> {
  const token = await this.amoTokenRepository.findOne({
    where: { userId },
  });

  return {
    connected: !!token && token.expiresAt > new Date(),
    hasTokens: !!token,
    domain: process.env.AMO_DOMAIN || '',
    accountId: process.env.AMO_ACCOUNT_ID || '',
  };
}

async exchangeCodeForUser(userId: string, code: string): Promise<void> {
  // Обміняти code на токени
  const authResponse = await this.exchangeCode(code);
  
  // Зберегти токени для користувача
  await this.saveTokensForUser(userId, authResponse);
}

async saveTokensForUser(
  userId: string,
  authData: AmoAuthResponse,
): Promise<void> {
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
      tokenType: authData.token_type || 'Bearer',
    });
    await this.amoTokenRepository.save(token);
  }
}

async disconnectUser(userId: string): Promise<void> {
  await this.amoTokenRepository.delete({ userId });
}
```

#### Оновити `getAccessToken()` для підтримки userId:

```typescript
async getAccessToken(userId?: string): Promise<string> {
  // Якщо userId передано - отримати токен для користувача
  if (userId) {
    const token = await this.amoTokenRepository.findOne({
      where: { userId },
    });

    if (!token) {
      throw new Error('AMO CRM not connected for this user');
    }

    // Перевірити чи не закінчився токен
    if (token.expiresAt <= new Date()) {
      // Оновити токен
      await this.refreshTokenForUser(userId);
      const updatedToken = await this.amoTokenRepository.findOne({
        where: { userId },
      });
      return updatedToken!.accessToken;
    }

    return token.accessToken;
  }

  // Стара логіка для глобального токена (для адмінів)
  // ...
}
```

---

## 📝 Чеклист змін

### Database:
- [ ] Додати `user_id` в таблицю `amo_crm_tokens`
- [ ] Створити індекс `idx_amo_crm_tokens_user_id`
- [ ] Створити унікальний індекс `idx_amo_crm_tokens_user_id_unique`
- [ ] Виконати міграцію

### Entity:
- [ ] Додати `userId` в `AmoCrmToken` entity
- [ ] Додати зв'язок `ManyToOne` з `User`

### Service:
- [ ] Додати `getUserConnectionStatus(userId)`
- [ ] Додати `exchangeCodeForUser(userId, code)`
- [ ] Додати `saveTokensForUser(userId, authData)`
- [ ] Додати `disconnectUser(userId)`
- [ ] Оновити `getAccessToken()` для підтримки `userId`
- [ ] Додати `refreshTokenForUser(userId)`

### Controller:
- [ ] Оновити `GET /api/amo-crm/status` - прибрати `requireAdmin`
- [ ] Додати `POST /api/amo-crm/exchange-code` (якщо немає)
- [ ] Додати `POST /api/amo-crm/disconnect` (якщо немає)

### Тестування:
- [ ] Тест створення токенів для користувача
- [ ] Тест отримання статусу для користувача
- [ ] Тест обміну code на токени
- [ ] Тест відключення
- [ ] Тест оновлення токенів

---

## 🔄 Міграція існуючих даних

Якщо вже є глобальні токени, потрібно:

1. **Визначити який користувач має бути власником токенів**
   - Можливо адмін або перший користувач

2. **Призначити токени користувачу:**

```sql
-- Призначити всі токени адміну (або іншому користувачу)
UPDATE amo_crm_tokens 
SET user_id = (SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1)
WHERE user_id IS NULL;
```

---

## 📚 Приклади використання

### Отримати статус для користувача:

```bash
GET /api/amo-crm/status
Authorization: Bearer <user_jwt_token>

Response:
{
  "success": true,
  "data": {
    "connected": true,
    "hasTokens": true,
    "domain": "reforyou.amocrm.ru",
    "accountId": "31920194"
  }
}
```

### Обміняти code на токени:

```bash
POST /api/amo-crm/exchange-code
Authorization: Bearer <user_jwt_token>
Content-Type: application/json

{
  "code": "authorization_code_from_amo"
}

Response:
{
  "success": true,
  "message": "AMO CRM successfully connected"
}
```

### Відключити AMO CRM:

```bash
POST /api/amo-crm/disconnect
Authorization: Bearer <user_jwt_token>

Response:
{
  "success": true,
  "message": "AMO CRM disconnected"
}
```

---

**Останнє оновлення:** Грудень 2025
