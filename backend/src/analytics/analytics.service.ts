import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User, UserRole } from '../database/entities/user.entity';
import { Property } from '../database/entities/property.entity';
import { Lead, LeadStatus } from '../database/entities/lead.entity';
import { Favorite } from '../database/entities/favorite.entity';

export interface DashboardStats {
  // Users
  totalUsers: number;
  usersByRole: { role: string; count: number }[];
  newUsersThisMonth: number;
  
  // Properties
  totalProperties: number;
  activeProperties: number;
  exclusiveProperties: number;
  soldOutProperties: number;
  
  // Leads
  totalLeads: number;
  leadsByStatus: { status: string; count: number }[];
  newLeadsThisMonth: number;
  conversionRate: number; // % leads що стали SUCCESS
  
  // Favorites
  totalFavorites: number;
  topFavoritedProperties: { propertyId: string; propertyTitle: string; count: number }[];
  
  // Performance
  averageLeadResponseTime?: number; // в годинах
  topBrokers: { brokerId: string; brokerName: string; leadsCount: number; successCount: number; conversionRate: number }[];
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  /**
   * Отримати dashboard статистику
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Users stats
    const totalUsers = await this.userRepository.count();
    
    const usersByRole = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    const newUsersThisMonth = await this.userRepository.count({
      where: {
        createdAt: Between(startOfMonth, endOfMonth),
      },
    });

    // Properties stats
    const totalProperties = await this.propertyRepository.count();
    const activeProperties = await this.propertyRepository.count({
      where: { isArchived: false, isSoldOut: false },
    });
    const exclusiveProperties = await this.propertyRepository.count({
      where: { isExclusive: true, isArchived: false },
    });
    const soldOutProperties = await this.propertyRepository.count({
      where: { isSoldOut: true },
    });

    // Leads stats
    const totalLeads = await this.leadRepository.count();
    
    const leadsByStatus = await this.leadRepository
      .createQueryBuilder('lead')
      .select('lead.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('lead.status')
      .getRawMany();

    const newLeadsThisMonth = await this.leadRepository.count({
      where: {
        createdAt: Between(startOfMonth, endOfMonth),
      },
    });

    // Conversion rate (CLOSED вважаємо успішними)
    const successLeads = await this.leadRepository.count({
      where: { status: LeadStatus.CLOSED },
    });
    const conversionRate = totalLeads > 0 ? (successLeads / totalLeads) * 100 : 0;

    // Favorites stats
    const totalFavorites = await this.favoriteRepository.count();
    
    const topFavoritedPropertiesRaw = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoin('favorite.property', 'property')
      .select('favorite.propertyId', 'propertyId')
      .addSelect('property.titleEn', 'propertyTitle')
      .addSelect('COUNT(*)', 'count')
      .groupBy('favorite.propertyId')
      .addGroupBy('property.titleEn')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    const topFavoritedProperties = topFavoritedPropertiesRaw.map((f) => ({
      propertyId: f.propertyId,
      propertyTitle: f.propertyTitle || 'Unknown',
      count: parseInt(f.count),
    }));

    // Top Brokers
    const topBrokersRaw = await this.leadRepository
      .createQueryBuilder('lead')
      .leftJoin('lead.broker', 'broker')
      .select('lead.brokerId', 'brokerId')
      .addSelect('broker.firstName', 'firstName')
      .addSelect('broker.lastName', 'lastName')
      .addSelect('COUNT(*)', 'leadsCount')
      .addSelect(
        'SUM(CASE WHEN lead.status = :successStatus THEN 1 ELSE 0 END)',
        'successCount',
      )
      .where('lead.brokerId IS NOT NULL')
      .setParameter('successStatus', LeadStatus.CLOSED)
      .groupBy('lead.brokerId')
      .addGroupBy('broker.firstName')
      .addGroupBy('broker.lastName')
      .orderBy('leadsCount', 'DESC')
      .limit(10)
      .getRawMany();

    const topBrokers = topBrokersRaw.map((b) => {
      const leadsCount = parseInt(b.leadsCount);
      const successCount = parseInt(b.successCount || '0');
      const conversionRate = leadsCount > 0 ? (successCount / leadsCount) * 100 : 0;

      return {
        brokerId: b.brokerId,
        brokerName: `${b.firstName} ${b.lastName}`.trim(),
        leadsCount,
        successCount,
        conversionRate: Math.round(conversionRate * 100) / 100,
      };
    });

    return {
      totalUsers,
      usersByRole: usersByRole.map((u) => ({
        role: u.role,
        count: parseInt(u.count),
      })),
      newUsersThisMonth,
      
      totalProperties,
      activeProperties,
      exclusiveProperties,
      soldOutProperties,
      
      totalLeads,
      leadsByStatus: leadsByStatus.map((l) => ({
        status: l.status,
        count: parseInt(l.count),
      })),
      newLeadsThisMonth,
      conversionRate: Math.round(conversionRate * 100) / 100,
      
      totalFavorites,
      topFavoritedProperties,
      
      topBrokers,
    };
  }

  /**
   * Отримати статистику по періоду
   */
  async getStatsByPeriod(startDate: Date, endDate: Date) {
    const leads = await this.leadRepository.count({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });

    const users = await this.userRepository.count({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });

    const properties = await this.propertyRepository.count({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });

    return {
      period: { startDate, endDate },
      leads,
      users,
      properties,
    };
  }

  /**
   * Отримати статистику для конкретного брокера
   */
  async getBrokerStats(brokerId: string) {
    const totalLeads = await this.leadRepository.count({
      where: { brokerId },
    });

    const leadsByStatus = await this.leadRepository
      .createQueryBuilder('lead')
      .select('lead.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('lead.brokerId = :brokerId', { brokerId })
      .groupBy('lead.status')
      .getRawMany();

    const successLeads = await this.leadRepository.count({
      where: { brokerId, status: LeadStatus.CLOSED },
    });

    const conversionRate = totalLeads > 0 ? (successLeads / totalLeads) * 100 : 0;

    return {
      brokerId,
      totalLeads,
      leadsByStatus: leadsByStatus.map((l) => ({
        status: l.status,
        count: parseInt(l.count),
      })),
      successLeads,
      conversionRate: Math.round(conversionRate * 100) / 100,
    };
  }
}

