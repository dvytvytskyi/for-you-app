# Повна інструкція: Налаштування нотифікацій на бекенді (Express.js)

Ця інструкція описує, як додати функціональність відправки push-сповіщень з адмін-панелі на бекенді (Express.js).

---

## 📋 Передумови

Перед початком переконайтеся, що у вас є:

1. **Express.js проект** з TypeORM
2. **PostgreSQL база даних** з підключенням
3. **JWT Authentication** з middleware
4. **User entity** з ролями (ADMIN, BROKER, INVESTOR, CLIENT)

---

## 🎯 Що буде додано

1. **Entities** для нотифікацій:
   - `UserDevice` (таблиця `user_devices`)
   - `NotificationSettings` (таблиця `notification_settings`)
   - `NotificationHistory` (таблиця `notification_history`) з enum `NotificationType`

2. **Services**:
   - `ExpoPushService` для роботи з Expo Push API
   - `NotificationsService` для відправки сповіщень

3. **Middleware**:
   - `requireAdmin` для перевірки ролі ADMIN

4. **Routes**:
   - `POST /api/notifications/send` (тільки для ADMIN)

---

## 📝 Крок 1: Встановлення залежностей

Переконайтеся, що встановлено `axios`:

```bash
cd admin-panel-backend
npm install axios
```

Якщо `axios` вже встановлений, перейдіть до наступного кроку.

---

## 📝 Крок 2: Створити Entities

### 2.1. UserDevice Entity

**Створіть файл:** `admin-panel-backend/src/entities/UserDevice.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './User';

export enum DevicePlatform {
  IOS = 'ios',
  ANDROID = 'android',
  WEB = 'web',
}

@Entity('user_devices')
@Index(['userId', 'isActive'])
export class UserDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'fcm_token', type: 'text' })
  fcmToken: string; // Може бути Expo Push Token або Firebase FCM Token

  @Column({
    type: 'enum',
    enum: DevicePlatform,
    nullable: true,
  })
  platform: DevicePlatform;

  @Column({ name: 'device_model', nullable: true })
  deviceModel?: string;

  @Column({ name: 'os_version', nullable: true })
  osVersion?: string;

  @Column({ name: 'app_version', nullable: true })
  appVersion?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'last_used_at', type: 'timestamp', nullable: true })
  lastUsedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 2.2. NotificationSettings Entity

**Створіть файл:** `admin-panel-backend/src/entities/NotificationSettings.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity('notification_settings')
export class NotificationSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Загальні налаштування
  @Column({ name: 'push_enabled', default: true })
  pushEnabled: boolean;

  @Column({ name: 'email_enabled', default: true })
  emailEnabled: boolean;

  // Налаштування для Leads
  @Column({ name: 'lead_created', default: true })
  leadCreated: boolean;

  @Column({ name: 'lead_assigned', default: true })
  leadAssigned: boolean;

  @Column({ name: 'lead_status_changed', default: true })
  leadStatusChanged: boolean;

  // Налаштування для Properties
  @Column({ name: 'new_property', default: true })
  newProperty: boolean;

  @Column({ name: 'price_changed', default: true })
  priceChanged: boolean;

  // Налаштування для Exclusive (для інвесторів)
  @Column({ name: 'new_exclusive_property', default: true })
  newExclusiveProperty: boolean;

  // Системні сповіщення
  @Column({ name: 'system', default: true })
  system: boolean;

  @Column({ name: 'marketing', default: false })
  marketing: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 2.3. NotificationHistory Entity

**Створіть файл:** `admin-panel-backend/src/entities/NotificationHistory.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from './User';

export enum NotificationType {
  LEAD_CREATED = 'lead_created',
  LEAD_ASSIGNED = 'lead_assigned',
  LEAD_STATUS_CHANGED = 'lead_status_changed',
  NEW_PROPERTY = 'new_property',
  PRICE_CHANGED = 'price_changed',
  NEW_EXCLUSIVE_PROPERTY = 'new_exclusive_property',
  SYSTEM = 'system',
  MARKETING = 'marketing',
}

@Entity('notification_history')
@Index(['userId', 'isRead'])
@Index(['userId', 'createdAt'])
export class NotificationHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any>;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ name: 'read_at', type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ name: 'is_sent', default: false })
  isSent: boolean;

  @Column({ name: 'sent_at', type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

**Примітка:** Переконайтеся, що у вас є `User` entity. Якщо структура відрізняється, адаптуйте зв'язки.

---

## 📝 Крок 3: Оновити конфігурацію бази даних

**Файл:** `admin-panel-backend/src/config/database.ts` (або ваш файл конфігурації)

**Додайте нові entities до масиву `entities`:**

```typescript
import { UserDevice } from '../entities/UserDevice';
import { NotificationSettings } from '../entities/NotificationSettings';
import { NotificationHistory } from '../entities/NotificationHistory';

// В конфігурації TypeORM додайте:
entities: [
  // ... інші entities
  UserDevice,
  NotificationSettings,
  NotificationHistory,
],
```

---

## 📝 Крок 4: Створити ExpoPushService

**Створіть файл:** `admin-panel-backend/src/services/expo-push.service.ts`

```typescript
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export interface ExpoPushMessage {
  to: string | string[];
  sound?: 'default';
  title?: string;
  body?: string;
  data?: Record<string, any>;
  badge?: number;
  priority?: 'default' | 'normal' | 'high';
  channelId?: string;
  categoryId?: string;
  mutableContent?: boolean;
}

export interface ExpoPushResponse {
  data: Array<{
    status: 'ok' | 'error';
    id?: string;
    message?: string;
    details?: {
      error?: 'DeviceNotRegistered' | 'InvalidCredentials' | 'MessageTooBig' | 'MessageRateExceeded';
    };
  }>;
}

export class ExpoPushService {
  private readonly expoApiUrl = 'https://exp.host/--/api/v2/push/send';
  private readonly accessToken?: string;

  constructor() {
    this.accessToken = process.env.EXPO_ACCESS_TOKEN;
  }

  /**
   * Відправити push-сповіщення через Expo Push API
   */
  async sendNotification(messages: ExpoPushMessage[]): Promise<ExpoPushResponse> {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      };

      // Додаємо Access Token якщо він є (для production)
      if (this.accessToken) {
        headers.Authorization = `Bearer ${this.accessToken}`;
      }

      const response = await axios.post<ExpoPushResponse>(
        this.expoApiUrl,
        messages,
        { headers },
      );

      const result = response.data;

      // Логуємо результати
      const successCount = result.data.filter((r) => r.status === 'ok').length;
      const errorCount = result.data.filter((r) => r.status === 'error').length;

      console.log(
        `✅ Expo Push sent: ${successCount} success, ${errorCount} errors`,
      );

      // Логуємо помилки детально
      result.data.forEach((item, index) => {
        if (item.status === 'error') {
          console.warn(
            `⚠️ Push ${index} failed: ${item.message} (${item.details?.error || 'unknown'})`,
          );
        }
      });

      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data || error.message || 'Unknown error';
      console.error(`❌ Failed to send Expo Push notification: ${JSON.stringify(errorMessage)}`);
      throw error;
    }
  }

  /**
   * Відправити одне сповіщення
   */
  async sendSingleNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<boolean> {
    const result = await this.sendNotification([
      {
        to: token,
        sound: 'default',
        title,
        body,
        data,
        priority: 'high',
      },
    ]);

    return result.data[0]?.status === 'ok';
  }

  /**
   * Відправити сповіщення на декілька пристроїв
   */
  async sendMulticastNotification(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<{
    successCount: number;
    failureCount: number;
    invalidTokens: string[];
  }> {
    if (tokens.length === 0) {
      return { successCount: 0, failureCount: 0, invalidTokens: [] };
    }

    // Expo Push API підтримує до 100 токенів в одному запиті
    const batchSize = 100;
    let totalSuccess = 0;
    let totalFailure = 0;
    const invalidTokens: string[] = [];

    for (let i = 0; i < tokens.length; i += batchSize) {
      const batch = tokens.slice(i, i + batchSize);

      const messages: ExpoPushMessage[] = batch.map((token) => ({
        to: token,
        sound: 'default',
        title,
        body,
        data,
        priority: 'high',
      }));

      const result = await this.sendNotification(messages);

      result.data.forEach((item, index) => {
        if (item.status === 'ok') {
          totalSuccess++;
        } else {
          totalFailure++;
          // Якщо токен недійсний, додаємо його до списку для видалення
          if (
            item.details?.error === 'DeviceNotRegistered' ||
            item.message?.includes('Invalid token')
          ) {
            invalidTokens.push(batch[index]);
          }
        }
      });
    }

    return {
      successCount: totalSuccess,
      failureCount: totalFailure,
      invalidTokens,
    };
  }
}
```

---

## 📝 Крок 5: Створити NotificationsService

**Створіть файл:** `admin-panel-backend/src/services/notifications.service.ts`

```typescript
import { AppDataSource } from '../config/database';
import { UserDevice } from '../entities/UserDevice';
import { NotificationSettings } from '../entities/NotificationSettings';
import { NotificationHistory, NotificationType } from '../entities/NotificationHistory';
import { ExpoPushService } from './expo-push.service';
import { In } from 'typeorm';

export interface SendNotificationOptions {
  userIds: string[];
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  imageUrl?: string;
}

export class NotificationsService {
  private expoPushService: ExpoPushService;
  private userDeviceRepository;
  private notificationSettingsRepository;
  private notificationHistoryRepository;

  constructor() {
    this.expoPushService = new ExpoPushService();
    this.userDeviceRepository = AppDataSource.getRepository(UserDevice);
    this.notificationSettingsRepository = AppDataSource.getRepository(NotificationSettings);
    this.notificationHistoryRepository = AppDataSource.getRepository(NotificationHistory);
  }

  /**
   * Відправити push-сповіщення користувачам
   */
  async sendNotification(options: SendNotificationOptions): Promise<void> {
    const { userIds, type, title, body, data, imageUrl } = options;

    // Отримуємо всіх користувачів з активними налаштуваннями push
    const settings = await this.notificationSettingsRepository.find({
      where: { userId: In(userIds), pushEnabled: true },
    });

    const enabledUserIds = settings
      .filter((s) => this.isNotificationTypeEnabled(s, type))
      .map((s) => s.userId);

    if (enabledUserIds.length === 0) {
      console.log('Немає користувачів з увімкненими сповіщеннями для цього типу');
      return;
    }

    // Отримуємо активні пристрої користувачів
    const devices = await this.userDeviceRepository.find({
      where: { userId: In(enabledUserIds), isActive: true },
      order: { lastUsedAt: 'DESC' },
    });

    if (devices.length === 0) {
      console.log('Немає активних пристроїв для відправки');
      return;
    }

    // Створюємо історію сповіщень для всіх користувачів
    const historyEntries = enabledUserIds.map((userId) =>
      this.notificationHistoryRepository.create({
        userId,
        type,
        title,
        body,
        data,
        imageUrl,
      }),
    );

    await this.notificationHistoryRepository.save(historyEntries);

    // Відправляємо push через відповідний сервіс
    const tokens = devices.map((d) => d.fcmToken);

    // Розділяємо токени на Expo Push Token та FCM token
    const expoTokens: string[] = [];
    const fcmTokens: string[] = [];

    tokens.forEach((token) => {
      if (this.isExpoPushToken(token)) {
        expoTokens.push(token);
      } else {
        fcmTokens.push(token);
      }
    });

    let totalSuccess = 0;
    let totalFailure = 0;
    const invalidTokens: string[] = [];

    // Відправляємо через Expo Push API
    if (expoTokens.length > 0) {
      try {
        const expoResult = await this.expoPushService.sendMulticastNotification(
          expoTokens,
          title,
          body,
          data ? this.convertDataToStrings(data) : undefined,
        );
        totalSuccess += expoResult.successCount;
        totalFailure += expoResult.failureCount;
        invalidTokens.push(...expoResult.invalidTokens);
      } catch (error: any) {
        console.error(`❌ Failed to send Expo Push notifications: ${error.message}`);
        totalFailure += expoTokens.length;
      }
    }

    // Відправляємо через Firebase (якщо є FCM токени)
    // TODO: Додати Firebase FCM підтримку, якщо потрібно
    if (fcmTokens.length > 0) {
      console.warn(`⚠️ Firebase FCM tokens detected but not implemented: ${fcmTokens.length} tokens`);
      // Тут можна додати Firebase FCM логіку
    }

    // Позначаємо успішно відправлені сповіщення
    if (totalSuccess > 0) {
      await this.notificationHistoryRepository.update(
        { userId: In(enabledUserIds), type, isSent: false },
        { isSent: true, sentAt: new Date() },
      );
    }

    // Деактивуємо невалідні токени
    if (invalidTokens.length > 0) {
      await this.userDeviceRepository.update(
        { fcmToken: In(invalidTokens) },
        { isActive: false },
      );
    }

    console.log(
      `✅ Відправлено ${totalSuccess} сповіщень, ${totalFailure} помилок, ${invalidTokens.length} невалідних токенів`,
    );
  }

  /**
   * Перевірити чи увімкнений тип сповіщення
   */
  private isNotificationTypeEnabled(settings: NotificationSettings, type: NotificationType): boolean {
    const typeMap: Record<NotificationType, keyof NotificationSettings> = {
      [NotificationType.LEAD_CREATED]: 'leadCreated',
      [NotificationType.LEAD_ASSIGNED]: 'leadAssigned',
      [NotificationType.LEAD_STATUS_CHANGED]: 'leadStatusChanged',
      [NotificationType.NEW_PROPERTY]: 'newProperty',
      [NotificationType.PRICE_CHANGED]: 'priceChanged',
      [NotificationType.NEW_EXCLUSIVE_PROPERTY]: 'newExclusiveProperty',
      [NotificationType.SYSTEM]: 'system',
      [NotificationType.MARKETING]: 'marketing',
    };

    const key = typeMap[type];
    return key ? (settings[key] as boolean) : true;
  }

  /**
   * Конвертувати дані в strings (Expo Push API вимагає)
   */
  private convertDataToStrings(data: Record<string, any>): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = typeof value === 'string' ? value : JSON.stringify(value);
    }
    return result;
  }

  /**
   * Перевірити чи токен є Expo Push Token
   */
  private isExpoPushToken(token: string): boolean {
    return token.startsWith('ExponentPushToken[') || token.startsWith('ExpoPushToken[');
  }
}
```

---

## 📝 Крок 6: Створити/Оновити Middleware для Admin

**Файл:** `admin-panel-backend/src/middleware/auth.ts` (або ваш файл з middleware)

**Додайте функцію `requireAdmin`:**

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Інтерфейс для розширення Request з user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware для перевірки JWT токену
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Токен не надано',
      });
    }

    const jwtSecret = process.env.ADMIN_JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as any;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Недійсний токен',
    });
  }
};

/**
 * Middleware для перевірки ролі ADMIN
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Необхідна автентифікація',
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Доступ заборонено. Потрібна роль ADMIN',
    });
  }

  next();
};
```

**Примітка:** Адаптуйте цей код під вашу структуру автентифікації, якщо вона відрізняється.

---

## 📝 Крок 7: Створити Routes для Notifications

**Створіть файл:** `admin-panel-backend/src/routes/notifications.routes.ts`

```typescript
import { Router, Request, Response } from 'express';
import { NotificationsService, SendNotificationOptions } from '../services/notifications.service';
import { NotificationType } from '../entities/NotificationHistory';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const notificationsService = new NotificationsService();

/**
 * POST /api/notifications/send
 * Відправити push-сповіщення користувачам (тільки ADMIN)
 */
router.post(
  '/send',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { userIds, type, title, body, data, imageUrl } = req.body;

      // Валідація
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'userIds має бути масивом з хоча б одним ID',
        });
      }

      if (!type || !title || !body) {
        return res.status(400).json({
          success: false,
          message: 'type, title та body є обов\'язковими полями',
        });
      }

      // Перевірка типу сповіщення
      if (!Object.values(NotificationType).includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Недійсний тип сповіщення. Доступні: ${Object.values(NotificationType).join(', ')}`,
        });
      }

      const options: SendNotificationOptions = {
        userIds,
        type,
        title,
        body,
        data,
        imageUrl,
      };

      await notificationsService.sendNotification(options);

      return res.json({
        success: true,
        data: {
          sentTo: userIds.length,
        },
        message: 'Сповіщення успішно відправлено',
      });
    } catch (error: any) {
      console.error('Error sending notification:', error);
      return res.status(500).json({
        success: false,
        message: 'Помилка при відправці сповіщень',
        error: error.message,
      });
    }
  },
);

export default router;
```

---

## 📝 Крок 8: Підключити Routes до Server

**Файл:** `admin-panel-backend/src/server.ts` (або ваш головний файл сервера)

**Додайте імпорт та підключення routes:**

```typescript
import notificationsRoutes from './routes/notifications.routes';

// ... інші імпорти

// Після інших routes додайте:
app.use('/api/notifications', notificationsRoutes);
```

**Повний приклад:**

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';

// Import routes
import authRoutes from './routes/auth.routes';
import propertiesRoutes from './routes/properties.routes';
import notificationsRoutes from './routes/notifications.routes'; // <-- Додати

// ... інші routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/notifications', notificationsRoutes); // <-- Додати

// ... інші routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  });
```

---

## 🗄️ Крок 9: Створення таблиць в базі даних

Після додавання entities, TypeORM автоматично створить таблиці при наступному запуску (якщо `synchronize: true` в конфігурації).

**АБО** створіть міграцію:

```bash
npm run migration:generate -- src/migrations/CreateNotificationTables
npm run migration:run
```

**АБО** виконайте SQL вручну:

```sql
-- Enum для типів сповіщень
CREATE TYPE notification_type AS ENUM (
  'lead_created',
  'lead_assigned',
  'lead_status_changed',
  'new_property',
  'price_changed',
  'new_exclusive_property',
  'system',
  'marketing'
);

-- Таблиця пристроїв користувачів
CREATE TABLE IF NOT EXISTS user_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fcm_token TEXT NOT NULL,
  platform VARCHAR(50),
  device_model VARCHAR(255),
  os_version VARCHAR(255),
  app_version VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблиця налаштувань сповіщень
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  push_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  lead_created BOOLEAN DEFAULT true,
  lead_assigned BOOLEAN DEFAULT true,
  lead_status_changed BOOLEAN DEFAULT true,
  new_property BOOLEAN DEFAULT true,
  price_changed BOOLEAN DEFAULT true,
  new_exclusive_property BOOLEAN DEFAULT true,
  system BOOLEAN DEFAULT true,
  marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблиця історії сповіщень
CREATE TABLE IF NOT EXISTS notification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  image_url TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Індекси для швидкого пошуку
CREATE INDEX IF NOT EXISTS idx_user_devices_user_id ON user_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_user_devices_active ON user_devices(is_active);
CREATE INDEX IF NOT EXISTS idx_notification_history_user_id ON notification_history(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_history_type ON notification_history(type);
CREATE INDEX IF NOT EXISTS idx_notification_history_sent ON notification_history(is_sent);
```

---

## ⚙️ Крок 10: Налаштування .env (опціонально)

**Файл:** `admin-panel-backend/.env`

Додайте (опціонально для production):

```env
EXPO_ACCESS_TOKEN=your-expo-access-token
```

**Примітка:** 
- Expo Access Token не обов'язковий для розробки
- Рекомендується для production для забезпечення надійності та відстеження
- Отримати токен можна на https://expo.dev/accounts/[your-account]/settings/access-tokens

---

## ✅ Перевірка

Після виконання всіх кроків:

1. **Перезапустіть бекенд сервер**

```bash
npm run dev
```

2. **Протестуйте endpoint:**

**POST** `http://localhost:4000/api/notifications/send`

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json
```

**Body:**
```json
{
  "userIds": ["user-id-1", "user-id-2"],
  "type": "system",
  "title": "Нова нерухомість",
  "body": "З'явилася нова нерухомість, яка може вас зацікавити",
  "data": {
    "propertyId": "123",
    "url": "/property/123"
  },
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sentTo": 2
  },
  "message": "Сповіщення успішно відправлено"
}
```

### 3. Тестування через curl (командний рядок)

#### Production (https://admin.foryou-realestate.com)

**Крок 1: Отримати admin token**

```bash
curl -X POST https://admin.foryou-realestate.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@foryou-realestate.com","password":"Admin123!"}'
```

**Відповідь:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-id",
      "email": "admin@foryou-realestate.com",
      "role": "ADMIN"
    }
  }
}
```

**Крок 2: Відправити сповіщення** (замініть `<TOKEN>` на отриманий token)

```bash
curl -X POST https://admin.foryou-realestate.com/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "userIds": ["user-id-1", "user-id-2"],
    "type": "system",
    "title": "Test Notification",
    "body": "This is a test notification",
    "data": {"propertyId": "123"},
    "imageUrl": "https://example.com/image.jpg"
  }'
```

**Відповідь:**
```json
{
  "success": true,
  "data": {
    "sentTo": 2
  },
  "message": "Сповіщення успішно відправлено"
}
```

#### Local Development (http://localhost:4000)

**Крок 1: Отримати admin token**

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@foryou-realestate.com","password":"Admin123!"}'
```

**Крок 2: Відправити сповіщення** (замініть `<TOKEN>` на отриманий token)

```bash
curl -X POST http://localhost:4000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "userIds": ["user-id-1", "user-id-2"],
    "type": "system",
    "title": "Test Notification",
    "body": "This is a test notification",
    "data": {"propertyId": "123"},
    "imageUrl": "https://example.com/image.jpg"
  }'
```

#### Зручний спосіб: Збереження token в змінну

```bash
# Отримати token та зберегти в змінну
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@foryou-realestate.com","password":"Admin123!"}' \
  | jq -r '.data.token')

# Використати змінну для відправки сповіщення
curl -X POST http://localhost:4000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userIds": ["user-id-1", "user-id-2"],
    "type": "system",
    "title": "Test Notification",
    "body": "This is a test notification",
    "data": {"propertyId": "123"},
    "imageUrl": "https://example.com/image.jpg"
  }'
```

**Примітка:** Для використання `jq` встановіть його: `brew install jq` (macOS) або `apt-get install jq` (Linux).

---

## 🔧 Як це працює

1. **Адмінка** викликає `POST /api/notifications/send` з даними сповіщення
2. **Бекенд** перевіряє права доступу (тільки користувачі з роллю `ADMIN`)
3. **NotificationsService** відправляє сповіщення:
   - Якщо токен пристрою починається з `ExponentPushToken[` або `ExpoPushToken[` → використовує **Expo Push API**
   - Інакше (наприклад, Firebase FCM Token) → можна додати **Firebase Admin SDK** (зараз не реалізовано)
4. **Сповіщення** зберігаються в базі даних для історії кожного користувача
5. **Мобільний додаток** отримує сповіщення та показує їх

---

## 📋 Типи сповіщень (NotificationType)

Доступні типи сповіщень:

- `lead_created` - Створення заявки
- `lead_assigned` - Призначення заявки
- `lead_status_changed` - Зміна статусу заявки
- `new_property` - Нова нерухомість
- `price_changed` - Зміна ціни
- `new_exclusive_property` - Нова ексклюзивна нерухомість
- `system` - Системні сповіщення
- `marketing` - Маркетингові сповіщення

---

## ⚠️ Важливі примітки

1. **Endpoint доступний тільки для користувачів з роллю `ADMIN`**

2. **Сповіщення відправляються тільки користувачам з увімкненими push-сповіщеннями**

3. **Сповіщення зберігаються в історії для подальшого перегляду**

4. **Невалідні токени автоматично деактивуються**

5. **Expo Push API підтримує до 100 токенів в одному запиті** (обробка батчами вже реалізована)

6. **Firebase FCM підтримка**: Зараз не реалізована, але можна додати в `NotificationsService` (див. коментарі в коді)

---

## 🐛 Можливі проблеми

### Проблема: "Cannot find module 'axios'"

**Рішення:** Встановіть axios:

```bash
npm install axios
```

### Проблема: "Table 'user_devices' does not exist"

**Рішення:** Створіть таблиці в базі даних (див. розділ "Створення таблиць в базі даних")

### Проблема: "Forbidden: Admin access required"

**Рішення:** Переконайтеся, що користувач має ролю `ADMIN` в базі даних

### Проблема: "Немає активних пристроїв для відправки"

**Рішення:** Переконайтеся, що:
- Користувачі мають зареєстровані пристрої в таблиці `user_devices`
- Пристрої мають `is_active = true`
- Токени валідні (Expo Push Token або FCM Token)

### Проблема: "Cannot find module '../config/database'"

**Рішення:** Переконайтеся, що шлях до файлу конфігурації бази даних правильний. Адаптуйте імпорти під структуру вашого проекту.

---

## 📚 Додаткові ресурси

- [Expo Push Notifications API](https://docs.expo.dev/push-notifications/sending-notifications/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Express.js Documentation](https://expressjs.com/)
- [TypeORM Documentation](https://typeorm.io/)

---

## 🔄 Наступні кроки (опціонально)

1. **Додати Firebase FCM підтримку**:
   - Встановити `firebase-admin`
   - Створити `FirebaseService`
   - Інтегрувати в `NotificationsService`

2. **Додати ендпоінти для управління пристроями**:
   - `POST /api/devices/register` - Реєстрація пристрою
   - `DELETE /api/devices/:id` - Видалення пристрою

3. **Додати ендпоінти для налаштувань сповіщень**:
   - `GET /api/notifications/settings` - Отримати налаштування
   - `PATCH /api/notifications/settings` - Оновити налаштування

4. **Додати ендпоінти для історії сповіщень**:
   - `GET /api/notifications/history` - Отримати історію сповіщень

---

**Останнє оновлення**: Грудень 2025
