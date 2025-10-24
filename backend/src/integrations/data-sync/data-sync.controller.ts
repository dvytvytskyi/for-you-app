import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { DataSyncService } from './data-sync.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../database/entities/user.entity';

@ApiTags('Data Sync')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/sync')
export class DataSyncController {
  constructor(private readonly dataSyncService: DataSyncService) {}

  @Post('properties')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Ручна синхронізація properties з XML (тільки для ADMIN)' })
  @ApiResponse({ status: 200, description: 'Синхронізація запущена успішно' })
  async syncProperties() {
    const syncLog = await this.dataSyncService.syncPropertiesManually();
    return {
      message: 'Синхронізація завершена',
      syncLog,
    };
  }

  @Get('logs')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Отримати історію синхронізацій' })
  async getSyncLogs() {
    return this.dataSyncService.getSyncLogs(50);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Отримати статистику синхронізацій' })
  async getSyncStats() {
    return this.dataSyncService.getSyncStats();
  }
}

