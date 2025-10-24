import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@ApiTags('Analytics (ADMIN)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.BROKER) // Broker може бачити свою статистику
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Отримати загальну статистику для dashboard (тільки ADMIN)' })
  async getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('period')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Отримати статистику за період' })
  @ApiQuery({ name: 'startDate', required: true, type: String, example: '2025-01-01' })
  @ApiQuery({ name: 'endDate', required: true, type: String, example: '2025-12-31' })
  async getStatsByPeriod(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analyticsService.getStatsByPeriod(new Date(startDate), new Date(endDate));
  }

  @Get('broker/:brokerId')
  @ApiOperation({ summary: 'Отримати статистику конкретного брокера' })
  async getBrokerStats(@Param('brokerId') brokerId: string) {
    return this.analyticsService.getBrokerStats(brokerId);
  }
}

