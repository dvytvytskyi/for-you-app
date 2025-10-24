import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog, ActivityAction, ActivityEntity } from '../database/entities/activity-log.entity';

interface CreateActivityLogDto {
  userId?: string;
  action: ActivityAction;
  entityType: ActivityEntity;
  entityId?: string;
  description?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class ActivityLogService {
  private readonly logger = new Logger(ActivityLogService.name);

  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  /**
   * Створити запис активності
   */
  async log(dto: CreateActivityLogDto): Promise<ActivityLog | null> {
    try {
      const log = this.activityLogRepository.create(dto);
      return await this.activityLogRepository.save(log);
    } catch (error) {
      this.logger.error(`Failed to create activity log: ${error.message}`);
      // Не кидаємо помилку, щоб не зламати основний flow
      return null;
    }
  }

  /**
   * Отримати логи (пагінована)
   */
  async getLogs(options: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: ActivityAction;
    entityType?: ActivityEntity;
    entityId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    data: ActivityLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 50, userId, action, entityType, entityId, startDate, endDate } = options;

    const queryBuilder = this.activityLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user')
      .orderBy('log.createdAt', 'DESC');

    // Фільтри
    if (userId) {
      queryBuilder.andWhere('log.userId = :userId', { userId });
    }

    if (action) {
      queryBuilder.andWhere('log.action = :action', { action });
    }

    if (entityType) {
      queryBuilder.andWhere('log.entityType = :entityType', { entityType });
    }

    if (entityId) {
      queryBuilder.andWhere('log.entityId = :entityId', { entityId });
    }

    if (startDate) {
      queryBuilder.andWhere('log.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('log.createdAt <= :endDate', { endDate });
    }

    // Pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }

  /**
   * Отримати статистику активності
   */
  async getStats(options?: {
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    totalActions: number;
    actionBreakdown: { action: string; count: number }[];
    entityBreakdown: { entityType: string; count: number }[];
    topUsers: { userId: string; userName: string; count: number }[];
  }> {
    const { userId, startDate, endDate } = options || {};

    const queryBuilder = this.activityLogRepository.createQueryBuilder('log');

    if (userId) {
      queryBuilder.andWhere('log.userId = :userId', { userId });
    }

    if (startDate) {
      queryBuilder.andWhere('log.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('log.createdAt <= :endDate', { endDate });
    }

    // Total actions
    const totalActions = await queryBuilder.getCount();

    // Action breakdown
    const actionBreakdown = await this.activityLogRepository
      .createQueryBuilder('log')
      .select('log.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.action')
      .orderBy('count', 'DESC')
      .getRawMany();

    // Entity breakdown
    const entityBreakdown = await this.activityLogRepository
      .createQueryBuilder('log')
      .select('log.entityType', 'entityType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.entityType')
      .orderBy('count', 'DESC')
      .getRawMany();

    // Top users (якщо не фільтруємо по userId)
    let topUsers: { userId: string; userName: string; count: number }[] = [];
    if (!userId) {
      const rawTopUsers = await this.activityLogRepository
        .createQueryBuilder('log')
        .leftJoin('log.user', 'user')
        .select('log.userId', 'userId')
        .addSelect('user.firstName', 'firstName')
        .addSelect('user.lastName', 'lastName')
        .addSelect('COUNT(*)', 'count')
        .where('log.userId IS NOT NULL')
        .groupBy('log.userId')
        .addGroupBy('user.firstName')
        .addGroupBy('user.lastName')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany();

      topUsers = rawTopUsers.map((u) => ({
        userId: u.userId,
        userName: `${u.firstName} ${u.lastName}`.trim(),
        count: parseInt(u.count),
      }));
    }

    return {
      totalActions,
      actionBreakdown: actionBreakdown.map((a) => ({
        action: a.action,
        count: parseInt(a.count),
      })),
      entityBreakdown: entityBreakdown.map((e) => ({
        entityType: e.entityType,
        count: parseInt(e.count),
      })),
      topUsers,
    };
  }

  /**
   * Отримати активність конкретної сутності
   */
  async getEntityActivity(entityType: ActivityEntity, entityId: string): Promise<ActivityLog[]> {
    return this.activityLogRepository.find({
      where: { entityType, entityId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  /**
   * Видалити старі логи (наприклад, старші за 90 днів)
   */
  async cleanOldLogs(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.activityLogRepository
      .createQueryBuilder()
      .delete()
      .where('createdAt < :cutoffDate', { cutoffDate })
      .execute();

    this.logger.log(`Deleted ${result.affected} old activity logs (older than ${daysToKeep} days)`);
    return result.affected || 0;
  }
}

