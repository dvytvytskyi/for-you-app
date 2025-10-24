import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { User } from '../database/entities/user.entity';
import { Property } from '../database/entities/property.entity';
import { Lead } from '../database/entities/lead.entity';
import { Favorite } from '../database/entities/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Property, Lead, Favorite])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}

