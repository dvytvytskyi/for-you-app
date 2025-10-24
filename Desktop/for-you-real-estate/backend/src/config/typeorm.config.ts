import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Завантажуємо .env для CLI команд
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'for_you_real_estate',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
  synchronize: false, // ВАЖЛИВО: в production завжди false
  logging: process.env.NODE_ENV === 'development',
});

