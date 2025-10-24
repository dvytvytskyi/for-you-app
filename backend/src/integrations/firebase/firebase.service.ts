import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

export interface SendNotificationDto {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

export interface SendMulticastNotificationDto {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {
    this.initializeFirebase();
  }

  /**
   * Ініціалізація Firebase Admin SDK
   */
  private initializeFirebase() {
    try {
      const serviceAccountPath = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');

      if (serviceAccountPath) {
        // Ініціалізація через файл service account
        const serviceAccount = require(serviceAccountPath);
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId,
        });
      } else {
        // Ініціалізація через змінні середовища (для production)
        const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');
        const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');

        if (!privateKey || !clientEmail || !projectId) {
          this.logger.warn('Firebase credentials not found. Push notifications will be disabled.');
          return;
        }

        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
          projectId,
        });
      }

      this.logger.log('✅ Firebase initialized successfully');
    } catch (error) {
      this.logger.error('❌ Failed to initialize Firebase:', error.message);
    }
  }

  /**
   * Відправити push-повідомлення на один пристрій
   */
  async sendNotification(dto: SendNotificationDto): Promise<boolean> {
    if (!this.firebaseApp) {
      this.logger.warn('Firebase not initialized. Skipping notification.');
      return false;
    }

    try {
      const message: admin.messaging.Message = {
        token: dto.token,
        notification: {
          title: dto.title,
          body: dto.body,
          ...(dto.imageUrl && { imageUrl: dto.imageUrl }),
        },
        data: dto.data || {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            clickAction: 'FLUTTER_NOTIFICATION_CLICK',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`✅ Notification sent successfully: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Failed to send notification: ${error.message}`);
      
      // Якщо токен недійсний, повертаємо false (щоб можна було його видалити)
      if (error.code === 'messaging/invalid-registration-token' || 
          error.code === 'messaging/registration-token-not-registered') {
        return false;
      }

      throw error;
    }
  }

  /**
   * Відправити push-повідомлення на декілька пристроїв (multicast)
   */
  async sendMulticastNotification(dto: SendMulticastNotificationDto): Promise<{
    successCount: number;
    failureCount: number;
    invalidTokens: string[];
  }> {
    if (!this.firebaseApp) {
      this.logger.warn('Firebase not initialized. Skipping multicast notification.');
      return { successCount: 0, failureCount: dto.tokens.length, invalidTokens: [] };
    }

    if (dto.tokens.length === 0) {
      return { successCount: 0, failureCount: 0, invalidTokens: [] };
    }

    try {
      const message: admin.messaging.MulticastMessage = {
        tokens: dto.tokens,
        notification: {
          title: dto.title,
          body: dto.body,
          ...(dto.imageUrl && { imageUrl: dto.imageUrl }),
        },
        data: dto.data || {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            clickAction: 'FLUTTER_NOTIFICATION_CLICK',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().sendEachForMulticast(message);

      const invalidTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const error = resp.error;
          if (error?.code === 'messaging/invalid-registration-token' || 
              error?.code === 'messaging/registration-token-not-registered') {
            invalidTokens.push(dto.tokens[idx]);
          }
        }
      });

      this.logger.log(
        `✅ Multicast sent: ${response.successCount} success, ${response.failureCount} failed, ${invalidTokens.length} invalid tokens`,
      );

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        invalidTokens,
      };
    } catch (error) {
      this.logger.error(`❌ Failed to send multicast notification: ${error.message}`);
      throw error;
    }
  }

  /**
   * Broadcast повідомлення на багато пристроїв (в батчах по 500)
   */
  async sendBroadcast(tokens: string[], title: string, body: string, data?: Record<string, string>): Promise<number> {
    if (tokens.length === 0) return 0;

    let totalSuccess = 0;
    const batchSize = 500; // Firebase limit

    for (let i = 0; i < tokens.length; i += batchSize) {
      const batch = tokens.slice(i, i + batchSize);
      const result = await this.sendMulticastNotification({
        tokens: batch,
        title,
        body,
        data,
      });
      totalSuccess += result.successCount;
    }

    return totalSuccess;
  }
}

