import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { Property } from '../database/entities/property.entity';
import { PropertyImage } from '../database/entities/property-image.entity';
import { PropertyAmenity } from '../database/entities/property-amenity.entity';
import { PaymentPlan } from '../database/entities/payment-plan.entity';
import { Developer } from '../database/entities/developer.entity';
import { Favorite } from '../database/entities/favorite.entity';
import { Lead } from '../database/entities/lead.entity';
import { BrokerClient } from '../database/entities/broker-client.entity';
import { AmoToken } from '../database/entities/amo-token.entity';
import { AmoPipeline } from '../database/entities/amo-pipeline.entity';
import { AmoStage } from '../database/entities/amo-stage.entity';
import { AmoUser } from '../database/entities/amo-user.entity';
import { AmoRole } from '../database/entities/amo-role.entity';
import { AmoContact } from '../database/entities/amo-contact.entity';
import { AmoTask } from '../database/entities/amo-task.entity';
import { UserDevice } from '../database/entities/user-device.entity';
import { NotificationSettings } from '../database/entities/notification-settings.entity';
import { NotificationHistory } from '../database/entities/notification-history.entity';
import { SyncLog } from '../database/entities/sync-log.entity';
import { ActivityLog } from '../database/entities/activity-log.entity';

export const databaseConfig = registerAs(
  'database',
  (): DataSourceOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'for_you_real_estate',
      entities: [User, Property, PropertyImage, PropertyAmenity, PaymentPlan, Developer, Favorite, Lead, BrokerClient, AmoToken, AmoPipeline, AmoStage, AmoUser, AmoRole, AmoContact, AmoTask, UserDevice, NotificationSettings, NotificationHistory, SyncLog, ActivityLog], // Явно вказуємо entities для NestJS
    migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
    synchronize: false, // ВАЖЛИВО: завжди false
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  }),
);

// Для TypeORM CLI
export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'for_you_real_estate',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
  synchronize: false,
  logging: false,
});

