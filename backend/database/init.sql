-- Ініціалізація бази даних для For You Real Estate

-- Увімкнення PostGIS розширення
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Створення enum для ролей користувачів
CREATE TYPE user_role AS ENUM ('CLIENT', 'BROKER', 'INVESTOR', 'ADMIN');

-- Створення enum для статусів користувачів
CREATE TYPE user_status AS ENUM ('PENDING', 'ACTIVE', 'BLOCKED', 'REJECTED');

-- Створення enum для типів нерухомості
CREATE TYPE property_type AS ENUM (
  'APARTMENT',
  'HOUSE',
  'COMMERCIAL',
  'LAND',
  'OFFICE',
  'WAREHOUSE',
  'OTHER'
);

-- Створення enum для статусів нерухомості
CREATE TYPE property_status AS ENUM (
  'DRAFT',
  'PUBLISHED',
  'SOLD',
  'RENTED',
  'ARCHIVED'
);

-- Створення enum для статусів заявок
CREATE TYPE lead_status AS ENUM (
  'NEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'CONTACTED',
  'QUALIFIED',
  'CONVERTED',
  'CLOSED',
  'REJECTED'
);

-- Комент для адміністраторів
COMMENT ON TYPE user_role IS 'Ролі користувачів у системі';
COMMENT ON TYPE user_status IS 'Статуси користувачів';
COMMENT ON TYPE property_type IS 'Типи нерухомості';
COMMENT ON TYPE property_status IS 'Статуси об''єктів нерухомості';
COMMENT ON TYPE lead_status IS 'Статуси заявок (лідів)';

