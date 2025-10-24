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

export const databaseConfig = registerAs(
  'database',
  (): DataSourceOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'for_you_real_estate',
      entities: [User, Property, PropertyImage, PropertyAmenity, PaymentPlan, Developer, Favorite, Lead, BrokerClient, AmoToken], // Явно вказуємо entities для NestJS
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

