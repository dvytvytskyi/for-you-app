import { backendApiClient } from './backend-client';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Типи відповідно до бекенду
export enum DevicePlatform {
  IOS = 'ios',
  ANDROID = 'android',
  WEB = 'web',
}

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

export interface UserDevice {
  id: string;
  userId: string;
  fcmToken: string; // Може бути Expo Push Token або FCM token
  platform: DevicePlatform;
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  isActive: boolean;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  id: string;
  userId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  leadCreated: boolean;
  leadAssigned: boolean;
  leadStatusChanged: boolean;
  newProperty: boolean;
  priceChanged: boolean;
  favoritePropertyUpdated: boolean;
  newExclusiveProperty: boolean;
  systemNotifications: boolean;
  marketingNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationHistory {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  imageUrl?: string;
  isRead: boolean;
  readAt?: string;
  isSent: boolean;
  sentAt?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface RegisterDeviceDto {
  fcmToken: string; // Expo Push Token (формат: ExponentPushToken[xxxxx]) або FCM token
  platform: DevicePlatform;
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
}

export interface UpdateNotificationSettingsDto {
  pushEnabled?: boolean;
  emailEnabled?: boolean;
  leadCreated?: boolean;
  leadAssigned?: boolean;
  leadStatusChanged?: boolean;
  newProperty?: boolean;
  priceChanged?: boolean;
  favoritePropertyUpdated?: boolean;
  newExclusiveProperty?: boolean;
  systemNotifications?: boolean;
  marketingNotifications?: boolean;
}

export interface NotificationHistoryResponse {
  data: NotificationHistory[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UnreadCountResponse {
  count: number;
}

export const notificationsApi = {
  /**
   * Зареєструвати пристрій для push-сповіщень
   */
  async registerDevice(dto: RegisterDeviceDto): Promise<UserDevice> {
    const response = await backendApiClient.post<UserDevice>('/notifications/devices', dto);
    return response.data;
  },

  /**
   * Видалити пристрій (при logout)
   */
  async unregisterDevice(fcmToken: string): Promise<void> {
    await backendApiClient.delete(`/notifications/devices/${fcmToken}`);
  },

  /**
   * Отримати всі зареєстровані пристрої користувача
   */
  async getUserDevices(): Promise<UserDevice[]> {
    const response = await backendApiClient.get<UserDevice[]>('/notifications/devices');
    return response.data;
  },

  /**
   * Отримати налаштування сповіщень
   */
  async getSettings(): Promise<NotificationSettings> {
    const response = await backendApiClient.get<NotificationSettings>('/notifications/settings');
    return response.data;
  },

  /**
   * Оновити налаштування сповіщень
   */
  async updateSettings(dto: UpdateNotificationSettingsDto): Promise<NotificationSettings> {
    const response = await backendApiClient.put<NotificationSettings>('/notifications/settings', dto);
    return response.data;
  },

  /**
   * Отримати історію сповіщень
   */
  async getHistory(page: number = 1, limit: number = 20): Promise<NotificationHistoryResponse> {
    const response = await backendApiClient.get<NotificationHistoryResponse>('/notifications', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Отримати кількість непрочитаних сповіщень
   */
  async getUnreadCount(): Promise<number> {
    const response = await backendApiClient.get<UnreadCountResponse>('/notifications/unread-count');
    return response.data.count;
  },

  /**
   * Позначити сповіщення як прочитане
   */
  async markAsRead(notificationId: string): Promise<NotificationHistory> {
    const response = await backendApiClient.put<NotificationHistory>(
      `/notifications/${notificationId}/read`,
    );
    return response.data;
  },

  /**
   * Позначити всі сповіщення як прочитані
   */
  async markAllAsRead(): Promise<void> {
    await backendApiClient.put('/notifications/read-all');
  },

  /**
   * Визначити платформу пристрою
   */
  getDevicePlatform(): DevicePlatform {
    if (Platform.OS === 'ios') return DevicePlatform.IOS;
    if (Platform.OS === 'android') return DevicePlatform.ANDROID;
    return DevicePlatform.WEB;
  },

  /**
   * Отримати версію додатку
   */
  getAppVersion(): string {
    return Constants.expoConfig?.version || '1.0.0';
  },
};
