import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserDevice } from '../database/entities/user-device.entity';
import { NotificationSettings } from '../database/entities/notification-settings.entity';
import { NotificationHistory, NotificationType } from '../database/entities/notification-history.entity';
import { FirebaseService } from '../integrations/firebase/firebase.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';

export interface SendNotificationOptions {
  userIds: string[];
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  imageUrl?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(UserDevice)
    private userDeviceRepository: Repository<UserDevice>,

    @InjectRepository(NotificationSettings)
    private notificationSettingsRepository: Repository<NotificationSettings>,

    @InjectRepository(NotificationHistory)
    private notificationHistoryRepository: Repository<NotificationHistory>,

    private firebaseService: FirebaseService,
  ) {}

  /**
   * Реєстрація пристрою користувача
   */
  async registerDevice(userId: string, dto: RegisterDeviceDto): Promise<UserDevice> {
    // Перевіряємо чи існує пристрій з таким FCM токеном
    let device = await this.userDeviceRepository.findOne({
      where: { userId, fcmToken: dto.fcmToken },
    });

    if (device) {
      // Оновлюємо існуючий пристрій
      device.platform = dto.platform;
      if (dto.deviceModel !== undefined) device.deviceModel = dto.deviceModel;
      if (dto.osVersion !== undefined) device.osVersion = dto.osVersion;
      if (dto.appVersion !== undefined) device.appVersion = dto.appVersion;
      device.isActive = true;
      device.lastUsedAt = new Date();
    } else {
      // Створюємо новий пристрій
      device = this.userDeviceRepository.create({
        userId,
        fcmToken: dto.fcmToken,
        platform: dto.platform,
        deviceModel: dto.deviceModel,
        osVersion: dto.osVersion,
        appVersion: dto.appVersion,
        lastUsedAt: new Date(),
      });
    }

    return this.userDeviceRepository.save(device);
  }

  /**
   * Видалення пристрою (при logout)
   */
  async unregisterDevice(userId: string, fcmToken: string): Promise<void> {
    await this.userDeviceRepository.delete({ userId, fcmToken });
  }

  /**
   * Отримати всі пристрої користувача
   */
  async getUserDevices(userId: string): Promise<UserDevice[]> {
    return this.userDeviceRepository.find({
      where: { userId, isActive: true },
      order: { lastUsedAt: 'DESC' },
    });
  }

  /**
   * Отримати налаштування сповіщень користувача
   */
  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    let settings = await this.notificationSettingsRepository.findOne({
      where: { userId },
    });

    if (!settings) {
      // Створюємо налаштування зі значеннями за замовчуванням
      settings = this.notificationSettingsRepository.create({ userId });
      await this.notificationSettingsRepository.save(settings);
    }

    return settings;
  }

  /**
   * Оновити налаштування сповіщень
   */
  async updateNotificationSettings(
    userId: string,
    dto: UpdateNotificationSettingsDto,
  ): Promise<NotificationSettings> {
    let settings = await this.notificationSettingsRepository.findOne({
      where: { userId },
    });

    if (!settings) {
      settings = this.notificationSettingsRepository.create({ userId, ...dto });
    } else {
      Object.assign(settings, dto);
    }

    return this.notificationSettingsRepository.save(settings);
  }

  /**
   * Отримати історію сповіщень користувача
   */
  async getNotificationHistory(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: NotificationHistory[]; total: number; page: number; totalPages: number }> {
    const [data, total] = await this.notificationHistoryRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Позначити сповіщення як прочитане
   */
  async markAsRead(userId: string, notificationId: string): Promise<NotificationHistory> {
    const notification = await this.notificationHistoryRepository.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Сповіщення не знайдено');
    }

    notification.isRead = true;
    notification.readAt = new Date();

    return this.notificationHistoryRepository.save(notification);
  }

  /**
   * Позначити всі сповіщення як прочитані
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationHistoryRepository.update(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
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
      this.logger.log('Немає користувачів з увімкненими сповіщеннями для цього типу');
      return;
    }

    // Отримуємо активні пристрої користувачів
    const devices = await this.userDeviceRepository.find({
      where: { userId: In(enabledUserIds), isActive: true },
    });

    if (devices.length === 0) {
      this.logger.log('Немає активних пристроїв для відправки');
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

    // Відправляємо push через Firebase
    const tokens = devices.map((d) => d.fcmToken);

    const result = await this.firebaseService.sendMulticastNotification({
      tokens,
      title,
      body,
      data: data ? this.convertDataToStrings(data) : undefined,
      imageUrl,
    });

    // Позначаємо успішно відправлені сповіщення
    if (result.successCount > 0) {
      await this.notificationHistoryRepository.update(
        { userId: In(enabledUserIds), type, isSent: false },
        { isSent: true, sentAt: new Date() },
      );
    }

    // Деактивуємо невалідні токени
    if (result.invalidTokens.length > 0) {
      await this.userDeviceRepository.update(
        { fcmToken: In(result.invalidTokens) },
        { isActive: false },
      );
    }

    this.logger.log(
      `✅ Відправлено ${result.successCount} сповіщень, ${result.failureCount} помилок, ${result.invalidTokens.length} невалідних токенів`,
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
      [NotificationType.SYSTEM]: 'systemNotifications',
      [NotificationType.MARKETING]: 'marketingNotifications',
    };

    const key = typeMap[type];
    return key ? (settings[key] as boolean) : true;
  }

  /**
   * Конвертувати дані в strings (Firebase вимагає)
   */
  private convertDataToStrings(data: Record<string, any>): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = typeof value === 'string' ? value : JSON.stringify(value);
    }
    return result;
  }

  /**
   * Отримати кількість непрочитаних сповіщень
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationHistoryRepository.count({
      where: { userId, isRead: false },
    });
  }
}

