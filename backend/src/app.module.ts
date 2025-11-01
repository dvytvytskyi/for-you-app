import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { LeadsModule } from './leads/leads.module';
import { AmoCrmModule } from './integrations/amo-crm/amo-crm.module';
import { AdminPanelModule } from './integrations/admin-panel/admin-panel.module';
import { FirebaseModule } from './integrations/firebase/firebase.module';
import { MediaModule } from './integrations/media/media.module';
import { DataSyncModule } from './integrations/data-sync/data-sync.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DocumentsModule } from './documents/documents.module';
import { databaseConfig } from './config/database.config';
import { redisConfig } from './config/redis.config';

@Module({
  imports: [
    // Глобальна конфігурація
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig, redisConfig],
    }),

    // Scheduler для CRON jobs
    ScheduleModule.forRoot(),

    // TypeORM з PostgreSQL + PostGIS
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        if (!dbConfig) {
          throw new Error('Database configuration is not defined');
        }
        return dbConfig;
      },
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get('THROTTLE_TTL') || 60,
          limit: configService.get('THROTTLE_LIMIT') || 100,
        },
      ],
    }),

    // Auth Module
    AuthModule,

    // Properties Module
    PropertiesModule,

    // Leads Module
    LeadsModule,

    // Integrations
    AmoCrmModule,
    AdminPanelModule,
    FirebaseModule,
    MediaModule,
    DataSyncModule,

    // Notifications
    NotificationsModule,

    // Activity Log (Global)
    ActivityLogModule,

    // Analytics
    AnalyticsModule,

    // Documents
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

