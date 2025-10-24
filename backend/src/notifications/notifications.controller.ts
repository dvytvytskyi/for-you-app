import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // =====================
  // DEVICES
  // =====================

  @Post('devices')
  @ApiOperation({ summary: 'Зареєструвати пристрій для push-сповіщень' })
  async registerDevice(@CurrentUser('id') userId: string, @Body() dto: RegisterDeviceDto) {
    return this.notificationsService.registerDevice(userId, dto);
  }

  @Delete('devices/:fcmToken')
  @ApiOperation({ summary: 'Видалити пристрій (logout)' })
  async unregisterDevice(@CurrentUser('id') userId: string, @Param('fcmToken') fcmToken: string) {
    await this.notificationsService.unregisterDevice(userId, fcmToken);
    return { message: 'Пристрій успішно видалено' };
  }

  @Get('devices')
  @ApiOperation({ summary: 'Отримати всі зареєстровані пристрої' })
  async getUserDevices(@CurrentUser('id') userId: string) {
    return this.notificationsService.getUserDevices(userId);
  }

  // =====================
  // SETTINGS
  // =====================

  @Get('settings')
  @ApiOperation({ summary: 'Отримати налаштування сповіщень' })
  async getNotificationSettings(@CurrentUser('id') userId: string) {
    return this.notificationsService.getNotificationSettings(userId);
  }

  @Put('settings')
  @ApiOperation({ summary: 'Оновити налаштування сповіщень' })
  async updateNotificationSettings(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateNotificationSettingsDto,
  ) {
    return this.notificationsService.updateNotificationSettings(userId, dto);
  }

  // =====================
  // HISTORY
  // =====================

  @Get()
  @ApiOperation({ summary: 'Отримати історію сповіщень' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async getNotificationHistory(
    @CurrentUser('id') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.notificationsService.getNotificationHistory(userId, page, limit);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Отримати кількість непрочитаних сповіщень' })
  async getUnreadCount(@CurrentUser('id') userId: string) {
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Позначити сповіщення як прочитане' })
  async markAsRead(@CurrentUser('id') userId: string, @Param('id') notificationId: string) {
    return this.notificationsService.markAsRead(userId, notificationId);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Позначити всі сповіщення як прочитані' })
  async markAllAsRead(@CurrentUser('id') userId: string) {
    await this.notificationsService.markAllAsRead(userId);
    return { message: 'Всі сповіщення позначено як прочитані' };
  }
}

