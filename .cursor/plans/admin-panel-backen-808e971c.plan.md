<!-- 808e971c-0ca1-4570-b259-a2500ea6b2fb 5eaf0dff-49cc-4c61-89dc-64d5bef95318 -->
# Admin Panel System: Complete Implementation Plan

## Architecture Overview

```
Mobile App → Backend (NestJS, існуючий) → Admin Panel Backend (новий Express.js) → Admin Panel DB
                                                    ↑
                             Admin Panel Frontend (Next.js) ─┘
```

**Проекти:**

- `/admin-panel-backend/` - новий Express.js + TypeORM + PostgreSQL
- `/admin-panel/` - існуючий Next.js (frontend)
- `/backend/` - існуючий NestJS (тільки додамо API client для Admin Panel)

**Authentication:**

- Admin Panel Frontend ↔ Admin Panel Backend: JWT (NextAuth)
- Backend (NestJS) ↔ Admin Panel Backend: API Key в headers

---

## Phase 1: Admin Panel Backend - Setup

### Step 1.1: Project Initialization

**Create structure:**

```bash
mkdir admin-panel-backend
cd admin-panel-backend
npm init -y
```

**Install dependencies:**

```bash
npm install express cors dotenv typeorm pg bcrypt jsonwebtoken
npm install -D typescript @types/express @types/node @types/cors @types/bcrypt @types/jsonwebtoken ts-node-dev
```

**Files to create:**

`admin-panel-backend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

`admin-panel-backend/package.json` scripts:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

`admin-panel-backend/.env`:

```
PORT=4000
DATABASE_URL=postgresql://admin:admin123@localhost:5433/admin_panel
ADMIN_JWT_SECRET=admin-jwt-secret-key
API_KEY=your-secure-api-key-for-main-backend
ADMIN_EMAIL=admin@foryou.ae
ADMIN_PASSWORD=Admin123!
UPLOAD_DIR=./uploads
```

`admin-panel-backend/.gitignore`:

```
node_modules/
dist/
.env
uploads/
```

### Step 1.2: Database Configuration

**Files to create:**

`admin-panel-backend/src/config/database.ts`:

```typescript
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
});
```

`admin-panel-backend/ormconfig.json`:

```json
{
  "type": "postgres",
  "url": "postgresql://admin:admin123@localhost:5433/admin_panel",
  "entities": ["src/entities/**/*.ts"],
  "migrations": ["src/migrations/**/*.ts"],
  "cli": {
    "migrationsDir": "src/migrations"
  }
}
```

### Step 1.3: Middleware & Utils

**Files to create:**

`admin-panel-backend/src/middleware/auth.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const authenticateAPIKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ message: 'Invalid API Key' });
  }
  next();
};
```

`admin-panel-backend/src/utils/conversions.ts`:

```typescript
export class Conversions {
  static readonly USD_TO_AED = 3.67;
  static readonly SQM_TO_SQFT = 10.764;

  static usdToAed(usd: number): number {
    return Math.round(usd * this.USD_TO_AED);
  }

  static sqmToSqft(sqm: number): number {
    return Math.round(sqm * this.SQM_TO_SQFT);
  }
}
```

`admin-panel-backend/src/utils/response.ts`:

```typescript
export const successResponse = (data: any, message = 'Success') => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message: string, statusCode = 500) => ({
  success: false,
  message,
  statusCode,
});
```

### Step 1.4: Main Server

**File:** `admin-panel-backend/src/server.ts`

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';

// Import routes (will create later)
import authRoutes from './routes/auth.routes';
import propertiesRoutes from './routes/properties.routes';
import settingsRoutes from './routes/settings.routes';
import coursesRoutes from './routes/courses.routes';
import newsRoutes from './routes/news.routes';
import supportRoutes from './routes/support.routes';
import usersRoutes from './routes/users.routes';
import uploadRoutes from './routes/upload.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected');
    app.listen(PORT, () => {
      console.log(`🚀 Admin Panel Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
  });
```

---

## Phase 2: Admin Panel Backend - Entities

### Step 2.1: Settings Entities

**Files to create:**

`admin-panel-backend/src/entities/Country.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { City } from './City';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nameEn: string;

  @Column()
  nameRu: string;

  @Column()
  nameAr: string;

  @Column({ unique: true })
  code: string;

  @OneToMany(() => City, city => city.country)
  cities: City[];
}
```

`admin-panel-backend/src/entities/City.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Country } from './Country';
import { Area } from './Area';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  countryId: string;

  @ManyToOne(() => Country, country => country.cities)
  country: Country;

  @Column()
  nameEn: string;

  @Column()
  nameRu: string;

  @Column()
  nameAr: string;

  @OneToMany(() => Area, area => area.city)
  areas: Area[];
}
```

`admin-panel-backend/src/entities/Area.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { City } from './City';

@Entity('areas')
export class Area {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cityId: string;

  @ManyToOne(() => City, city => city.areas)
  city: City;

  @Column()
  nameEn: string;

  @Column()
  nameRu: string;

  @Column()
  nameAr: string;
}
```

`admin-panel-backend/src/entities/Facility.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('facilities')
export class Facility {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nameEn: string;

  @Column()
  nameRu: string;

  @Column()
  nameAr: string;

  @Column()
  iconName: string;
}
```

`admin-panel-backend/src/entities/Developer.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('developers')
export class Developer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo: string;

  @Column('text', { nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

### Step 2.2: Property Entities

**Files to create:**

`admin-panel-backend/src/entities/Property.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Country } from './Country';
import { City } from './City';
import { Area } from './Area';
import { Developer } from './Developer';
import { Facility } from './Facility';
import { PropertyUnit } from './PropertyUnit';

export enum PropertyType {
  OFF_PLAN = 'off-plan',
  SECONDARY = 'secondary',
}

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PropertyType })
  propertyType: PropertyType;

  @Column()
  name: string;

  @Column('simple-array')
  photos: string[];

  @Column('uuid')
  countryId: string;
  @ManyToOne(() => Country)
  country: Country;

  @Column('uuid')
  cityId: string;
  @ManyToOne(() => City)
  city: City;

  @Column('uuid')
  areaId: string;
  @ManyToOne(() => Area)
  area: Area;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column('text')
  description: string;

  @Column('uuid', { nullable: true })
  developerId: string;
  @ManyToOne(() => Developer)
  developer: Developer;

  // Off-Plan fields
  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  priceFrom: number;

  @Column('int', { nullable: true })
  bedroomsFrom: number;

  @Column('int', { nullable: true })
  bedroomsTo: number;

  @Column('int', { nullable: true })
  bathroomsFrom: number;

  @Column('int', { nullable: true })
  bathroomsTo: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  sizeFrom: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  sizeTo: number;

  @Column('text', { nullable: true })
  paymentPlan: string;

  @OneToMany(() => PropertyUnit, unit => unit.property, { cascade: true })
  units: PropertyUnit[];

  // Secondary fields
  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  price: number;

  @Column('int', { nullable: true })
  bedrooms: number;

  @Column('int', { nullable: true })
  bathrooms: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  size: number;

  @ManyToMany(() => Facility)
  @JoinTable()
  facilities: Facility[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

`admin-panel-backend/src/entities/PropertyUnit.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Property } from './Property';

export enum UnitType {
  APARTMENT = 'apartment',
  VILLA = 'villa',
  PENTHOUSE = 'penthouse',
  TOWNHOUSE = 'townhouse',
  OFFICE = 'office',
}

@Entity('property_units')
export class PropertyUnit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  propertyId: string;
  @ManyToOne(() => Property, property => property.units, { onDelete: 'CASCADE' })
  property: Property;

  @Column()
  unitId: string;

  @Column({ type: 'enum', enum: UnitType })
  type: UnitType;

  @Column()
  planImage: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalSize: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  balconySize: number;

  @Column('decimal', { precision: 15, scale: 2 })
  price: number;
}
```

### Step 2.3: Knowledge Base Entities

**Files to create:**

`admin-panel-backend/src/entities/Course.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CourseContent } from './CourseContent';
import { CourseLink } from './CourseLink';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('int', { default: 0 })
  order: number;

  @OneToMany(() => CourseContent, content => content.course, { cascade: true })
  contents: CourseContent[];

  @OneToMany(() => CourseLink, link => link.course, { cascade: true })
  links: CourseLink[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

`admin-panel-backend/src/entities/CourseContent.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Course } from './Course';

export enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity('course_contents')
export class CourseContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  courseId: string;
  @ManyToOne(() => Course, course => course.contents, { onDelete: 'CASCADE' })
  course: Course;

  @Column({ type: 'enum', enum: ContentType })
  type: ContentType;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column('int')
  order: number;
}
```

`admin-panel-backend/src/entities/CourseLink.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Course } from './Course';

@Entity('course_links')
export class CourseLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  courseId: string;
  @ManyToOne(() => Course, course => course.links, { onDelete: 'CASCADE' })
  course: Course;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column('int')
  order: number;
}
```

### Step 2.4: News Entities

**Files to create:**

`admin-panel-backend/src/entities/News.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { NewsContent } from './NewsContent';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column('timestamptz', { nullable: true })
  publishedAt: Date;

  @OneToMany(() => NewsContent, content => content.news, { cascade: true })
  contents: NewsContent[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

`admin-panel-backend/src/entities/NewsContent.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { News } from './News';

export enum NewsContentType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity('news_contents')
export class NewsContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  newsId: string;
  @ManyToOne(() => News, news => news.contents, { onDelete: 'CASCADE' })
  news: News;

  @Column({ type: 'enum', enum: NewsContentType })
  type: NewsContentType;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column('int')
  order: number;
}
```

### Step 2.5: Support Entities

**Files to create:**

`admin-panel-backend/src/entities/SupportRequest.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { SupportResponse } from './SupportResponse';

export enum SupportStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('support_requests')
export class SupportRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column()
  subject: string;

  @Column('text')
  message: string;

  @Column({ type: 'enum', enum: SupportStatus, default: SupportStatus.PENDING })
  status: SupportStatus;

  @Column({ default: 'normal' })
  priority: string;

  @OneToMany(() => SupportResponse, response => response.request, { cascade: true })
  responses: SupportResponse[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

`admin-panel-backend/src/entities/SupportResponse.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { SupportRequest } from './SupportRequest';

@Entity('support_responses')
export class SupportResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  supportRequestId: string;
  @ManyToOne(() => SupportRequest, request => request.responses, { onDelete: 'CASCADE' })
  request: SupportRequest;

  @Column('uuid', { nullable: true })
  userId: string;

  @Column('text')
  message: string;

  @Column({ default: false })
  isFromAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
```

### Step 2.6: Run Migrations

```bash
cd admin-panel-backend
npx typeorm migration:generate -n InitialSchema
npx typeorm migration:run
```

### Step 2.7: Seed Default Data

**File:** `admin-panel-backend/src/seeds/seed.ts`

```typescript
import { AppDataSource } from '../config/database';
import { Country } from '../entities/Country';
import { City } from '../entities/City';
import { Area } from '../entities/Area';
import { Facility } from '../entities/Facility';

async function seed() {
  await AppDataSource.initialize();

  // Create UAE
  const country = await AppDataSource.getRepository(Country).save({
    nameEn: 'United Arab Emirates',
    nameRu: 'Объединенные Арабские Эмираты',
    nameAr: 'الإمارات العربية المتحدة',
    code: 'AE',
  });

  // Create Dubai
  const city = await AppDataSource.getRepository(City).save({
    countryId: country.id,
    nameEn: 'Dubai',
    nameRu: 'Дубай',
    nameAr: 'دبي',
  });

  // Create Areas
  const areas = [
    'Downtown Dubai', 'Palm Jumeirah', 'Dubai Marina', 'JBR',
    'Business Bay', 'JLT', 'Arabian Ranches', 'Dubai Hills'
  ];
  
  for (const areaName of areas) {
    await AppDataSource.getRepository(Area).save({
      cityId: city.id,
      nameEn: areaName,
      nameRu: areaName,
      nameAr: areaName,
    });
  }

  // Create Facilities
  const facilities = [
    { nameEn: 'Swimming Pool', iconName: 'water' },
    { nameEn: 'Gym', iconName: 'fitness' },
    { nameEn: 'Parking', iconName: 'car' },
    { nameEn: '24/7 Security', iconName: 'shield-checkmark' },
    { nameEn: 'Kids Play Area', iconName: 'happy' },
    { nameEn: 'BBQ Area', iconName: 'flame' },
  ];

  for (const facility of facilities) {
    await AppDataSource.getRepository(Facility).save({
      ...facility,
      nameRu: facility.nameEn,
      nameAr: facility.nameEn,
    });
  }

  console.log('✅ Seed completed');
  process.exit(0);
}

seed();
```

Run: `npx ts-node src/seeds/seed.ts`

---

## Phase 3: Admin Panel Backend - Routes & Controllers

### Step 3.1: Auth Routes

**File:** `admin-panel-backend/src/routes/auth.routes.ts`

```typescript
import express from 'express';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse } from '../utils/response';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, process.env.ADMIN_JWT_SECRET!, { expiresIn: '7d' });
    return res.json(successResponse({ token }, 'Login successful'));
  }

  return res.status(401).json(errorResponse('Invalid credentials', 401));
});

export default router;
```

### Step 3.2: Settings Routes

**File:** `admin-panel-backend/src/routes/settings.routes.ts`

```typescript
import express from 'express';
import { AppDataSource } from '../config/database';
import { Country } from '../entities/Country';
import { City } from '../entities/City';
import { Area } from '../entities/Area';
import { Facility } from '../entities/Facility';
import { Developer } from '../entities/Developer';
import { authenticateJWT, authenticateAPIKey } from '../middleware/auth';
import { successResponse } from '../utils/response';

const router = express.Router();

// Protect all routes with JWT or API Key
router.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey) return authenticateAPIKey(req, res, next);
  return authenticateJWT(req, res, next);
});

// Countries
router.get('/countries', async (req, res) => {
  const countries = await AppDataSource.getRepository(Country).find({ relations: ['cities'] });
  res.json(successResponse(countries));
});

// Cities
router.get('/cities', async (req, res) => {
  const { countryId } = req.query;
  const where = countryId ? { countryId } : {};
  const cities = await AppDataSource.getRepository(City).find({ where, relations: ['areas'] });
  res.json(successResponse(cities));
});

// Areas
router.get('/areas', async (req, res) => {
  const { cityId } = req.query;
  const where = cityId ? { cityId } : {};
  const areas = await AppDataSource.getRepository(Area).find({ where });
  res.json(successResponse(areas));
});

// Facilities
router.get('/facilities', async (req, res) => {
  const facilities = await AppDataSource.getRepository(Facility).find();
  res.json(successResponse(facilities));
});

router.post('/facilities', async (req, res) => {
  const facility = await AppDataSource.getRepository(Facility).save(req.body);
  res.json(successResponse(facility));
});

// Developers
router.get('/developers', async (req, res) => {
  const developers = await AppDataSource.getRepository(Developer).find();
  res.json(successResponse(developers));
});

router.post('/developers', async (req, res) => {
  const developer = await AppDataSource.getRepository(Developer).save(req.body);
  res.json(successResponse(developer));
});

export default router;
```

### Step 3.3: Properties Routes

**File:** `admin-panel-backend/src/routes/properties.routes.ts`

```typescript
import express from 'express';
import { AppDataSource } from '../config/database';
import { Property } from '../entities/Property';
import { authenticateJWT, authenticateAPIKey } from '../middleware/auth';
import { successResponse } from '../utils/response';
import { Conversions } from '../utils/conversions';

const router = express.Router();

router.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey) return authenticateAPIKey(req, res, next);
  return authenticateJWT(req, res, next);
});

// Get all properties
router.get('/', async (req, res) => {
  const { propertyType, developerId, cityId } = req.query;
  const where: any = {};
  if (propertyType) where.propertyType = propertyType;
  if (developerId) where.developerId = developerId;
  if (cityId) where.cityId = cityId;

  const properties = await AppDataSource.getRepository(Property).find({
    where,
    relations: ['country', 'city', 'area', 'developer', 'facilities', 'units'],
  });

  // Add conversions
  const propertiesWithConversions = properties.map(p => ({
    ...p,
    priceFromAED: p.priceFrom ? Conversions.usdToAed(p.priceFrom) : null,
    priceAED: p.price ? Conversions.usdToAed(p.price) : null,
    sizeFromSqft: p.sizeFrom ? Conversions.sqmToSqft(p.sizeFrom) : null,
    sizeToSqft: p.sizeTo ? Conversions.sqmToSqft(p.sizeTo) : null,
    sizeSqft: p.size ? Conversions.sqmToSqft(p.size) : null,
  }));

  res.json(successResponse(propertiesWithConversions));
});

// Get property by ID
router.get('/:id', async (req, res) => {
  const property = await AppDataSource.getRepository(Property).findOne({
    where: { id: req.params.id },
    relations: ['country', 'city', 'area', 'developer', 'facilities', 'units'],
  });
  res.json(successResponse(property));
});

// Create property
router.post('/', async (req, res) => {
  const property = await AppDataSource.getRepository(Property).save(req.body);
  res.json(successResponse(property));
});

// Update property
router.patch('/:id', async (req, res) => {
  await AppDataSource.getRepository(Property).update(req.params.id, req.body);
  const property = await AppDataSource.getRepository(Property).findOne({
    where: { id: req.params.id },
    relations: ['facilities', 'units'],
  });
  res.json(successResponse(property));
});

// Delete property
router.delete('/:id', async (req, res) => {
  await AppDataSource.getRepository(Property).delete(req.params.id);
  res.json(successResponse(null, 'Property deleted'));
});

export default router;
```

### Step 3.4: Courses, News, Support, Users Routes

Create similar routes for:

- `admin-panel-backend/src/routes/courses.routes.ts`
- `admin-panel-backend/src/routes/news.routes.ts`
- `admin-panel-backend/src/routes/support.routes.ts`
- `admin-panel-backend/src/routes/users.routes.ts`

Each following the same pattern: JWT/API Key auth, CRUD operations, relations.

### Step 3.5: Upload Routes

**File:** `admin-panel-backend/src/routes/upload.routes.ts`

```typescript
import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateJWT } from '../middleware/auth';
import { successResponse } from '../utils/response';

const router = express.Router();
router.use(authenticateJWT);

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post('/image', upload.single('file'), (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json(successResponse({ url }));
});

router.post('/images', upload.array('files', 10), (req, res) => {
  const urls = req.files.map(f => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`);
  res.json(successResponse({ urls }));
});

export default router;
```

Install multer: `npm install multer @types/multer`

---

## Phase 4: Main Backend (NestJS) - Integration

### Step 4.1: Admin Panel API Client

**File:** `backend/src/integrations/admin-panel/admin-panel.client.ts`

```typescript
import axios from 'axios';

export class AdminPanelClient {
  private client = axios.create({
    baseURL: process.env.ADMIN_PANEL_API_URL || 'http://localhost:4000/api',
    headers: {
      'X-API-Key': process.env.ADMIN_PANEL_API_KEY,
    },
  });

  async getProperties(filters?: any) {
    const { data } = await this.client.get('/properties', { params: filters });
    return data.data;
  }

  async getPropertyById(id: string) {
    const { data } = await this.client.get(`/properties/${id}`);
    return data.data;
  }

  async getCourses() {
    const { data } = await this.client.get('/courses');
    return data.data;
  }

  async getCourseById(id: string) {
    const { data } = await this.client.get(`/courses/${id}`);
    return data.data;
  }

  async getNews() {
    const { data } = await this.client.get('/news');
    return data.data;
  }

  async getNewsById(id: string) {
    const { data } = await this.client.get(`/news/${id}`);
    return data.data;
  }

  async getSettings() {
    const countries = await this.client.get('/settings/countries');
    const facilities = await this.client.get('/settings/facilities');
    const developers = await this.client.get('/settings/developers');
    return {
      countries: countries.data.data,
      facilities: facilities.data.data,
      developers: developers.data.data,
    };
  }

  async createSupportRequest(data: any) {
    const response = await this.client.post('/support', data);
    return response.data.data;
  }
}
```

### Step 4.2: Update Backend .env

Add to `backend/.env`:

```
ADMIN_PANEL_API_URL=http://localhost:4000/api
ADMIN_PANEL_API_KEY=your-secure-api-key-for-main-backend
```

### Step 4.3: Update Properties Service

**File:** `backend/src/properties/properties.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { AdminPanelClient } from '../integrations/admin-panel/admin-panel.client';

@Injectable()
export class PropertiesService {
  private adminPanelClient = new AdminPanelClient();

  async findAll(filters?: any) {
    return await this.adminPanelClient.getProperties(filters);
  }

  async findOne(id: string) {
    return await this.adminPanelClient.getPropertyById(id);
  }
}
```

Do the same for:

- `backend/src/knowledge-base/` (if doesn't exist, create module)
- `backend/src/news/` (if doesn't exist, create module)
- Update existing modules to use Admin Panel API instead of local DB

---

## Phase 5: Admin Panel Frontend - Setup

### Step 5.1: Update Environment Variables

**File:** `admin-panel/.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoiYWJpZXNwYW5hIiwiYSI6ImNsb3N4NzllYzAyOWYybWw5ZzNpNXlqaHkifQ.UxlTvUuSq9L5jt0jRtRR-A
```

### Step 5.2: Install Dependencies

```bash
cd admin-panel
npm install axios next-auth antd @ant-design/icons react-quill leaflet react-leaflet
```

### Step 5.3: API Client

**File:** `admin-panel/src/lib/api-client.ts`

```typescript
import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

export default apiClient;
```

### Step 5.4: NextAuth Setup

**File:** `admin-panel/src/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });
          return { email: credentials?.email, token: data.data.token };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.accessToken = user.token;
      return token;
    },
    async session({ session, token }) {
      session.token = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };
```

### Step 5.5: Login Page

**File:** `admin-panel/src/app/login/page.tsx`

```typescript
'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    setLoading(false);

    if (result?.ok) {
      router.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card title="Admin Login" style={{ width: 400 }}>
        <Form onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true }]}>
            <Input placeholder="Email" type="email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
};
```

### Step 5.6: Layout Components

**File:** `admin-panel/src/components/Layout/AdminLayout.tsx`

```typescript
'use client';
import { Layout, Menu } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { DashboardOutlined, HomeOutlined, UserOutlined, BookOutlined, FileTextOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';

const { Sider, Content, Header } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/properties', icon: <HomeOutlined />, label: 'Properties' },
    { key: '/users', icon: <UserOutlined />, label: 'Users' },
    { key: '/knowledge-base', icon: <BookOutlined />, label: 'Knowledge Base' },
    { key: '/news', icon: <FileTextOutlined />, label: 'News' },
    { key: '/support', icon: <MessageOutlined />, label: 'Support' },
    { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div style={{ color: 'white', padding: 16, fontSize: 18 }}>Admin Panel</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px' }}>
          <Button onClick={() => signOut()}>Logout</Button>
        </Header>
        <Content style={{ margin: 16 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
```

### Step 5.7: Dashboard Page

**File:** `admin-panel/src/app/dashboard/page.tsx`

```typescript
'use client';
import { Card, Row, Col, Statistic } from 'antd';
import { HomeOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';
import AdminLayout from '@/components/Layout/AdminLayout';

export default function DashboardPage() {
  return (
    <AdminLayout>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Properties" value={0} prefix={<HomeOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Users" value={0} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Support Requests" value={0} prefix={<MessageOutlined />} />
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
}
```

---

## Phase 6: Admin Panel Frontend - Properties

### Step 6.1: Properties API

**File:** `admin-panel/src/lib/api/properties.ts`

```typescript
import apiClient from '../api-client';

export const propertiesApi = {
  getAll: (filters?: any) => apiClient.get('/properties', { params: filters }),
  getById: (id: string) => apiClient.get(`/properties/${id}`),
  create: (data: any) => apiClient.post('/properties', data),
  update: (id: string, data: any) => apiClient.patch(`/properties/${id}`, data),
  delete: (id: string) => apiClient.delete(`/properties/${id}`),
};
```

### Step 6.2: Properties List Page

**File:** `admin-panel/src/app/properties/page.tsx`

```typescript
'use client';
import { Table, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { propertiesApi } from '@/lib/api/properties';
import AdminLayout from '@/components/Layout/AdminLayout';

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    const { data } = await propertiesApi.getAll();
    setProperties(data.data);
    setLoading(false);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'propertyType', key: 'propertyType' },
    { title: 'Location', render: (_, record) => `${record.city?.nameEn}, ${record.area?.nameEn}` },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => router.push(`/properties/${record.id}`)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    await propertiesApi.delete(id);
    loadProperties();
  };

  return (
    <AdminLayout>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/properties/new')}>
        Add Property
      </Button>
      <Table dataSource={properties} columns={columns} loading={loading} rowKey="id" style={{ marginTop: 16 }} />
    </AdminLayout>
  );
}
```

### Step 6.3: Property Form

**File:** `admin-panel/src/app/properties/new/page.tsx` and `admin-panel/src/app/properties/[id]/page.tsx`

Create detailed form with:

- Property type selector (Off-Plan / Secondary)
- Photo uploader (multiple)
- Location cascading selects (Country → City → Area)
- Map for coordinates (use react-leaflet)
- Conditional fields based on type
- Units section for off-plan (dynamic array)
- Facilities checkboxes

Use Ant Design Form, Upload, Select, InputNumber, Checkbox, Button.

---

## Phase 7: Admin Panel Frontend - Other Sections

Create similar pages for:

### 7.1: Settings (`/settings`)

- Tabs: Developers, Facilities, Locations
- Tables with CRUD operations

### 7.2: Knowledge Base (`/knowledge-base`)

- List of courses
- Course editor with dynamic content blocks (text/image/video)
- Use react-quill for rich text

### 7.3: News (`/news`)

- List of news articles
- News editor (similar to courses but no useful links)
- Published toggle

### 7.4: Support (`/support`)

- List of support requests
- Conversation view
- Reply form
- Status update

### 7.5: Users (`/users`)

- Table of mobile app users
- User details page
- Disable/enable actions

---

## Phase 8: Docker Setup

### Step 8.1: Admin Panel Backend Dockerfile

**File:** `admin-panel-backend/Dockerfile`

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
```

### Step 8.2: Update docker-compose.yml

**File:** `docker-compose.yml`

Add to existing compose:

```yaml
services:
  admin-panel-db:
    image: postgres:15
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
      POSTGRES_DB: admin_panel
    ports:
                           - "5433:5432"
    volumes:
                           - admin_panel_db_data:/var/lib/postgresql/data

  admin-panel-backend:
    build: ./admin-panel-backend
    ports:
                           - "4000:4000"
    environment:
      DATABASE_URL: postgresql://admin:admin123@admin-panel-db:5432/admin_panel
      ADMIN_JWT_SECRET: admin-jwt-secret
      API_KEY: your-secure-api-key
    depends_on:
                           - admin-panel-db

  admin-panel-frontend:
    build: ./admin-panel
    ports:
                           - "3001:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:4000/api
      NEXTAUTH_URL: http://localhost:3001

volumes:
  admin_panel_db_data:
```

---

## Phase 9: Testing & Documentation

### Step 9.1: Test All Endpoints

Use Postman or curl to test:

- Login
- Properties CRUD
- Settings CRUD
- Courses CRUD
- News CRUD
- Support CRUD
- File upload

### Step 9.2: Test Main Backend Integration

From main NestJS backend, call Admin Panel API:

```typescript
const properties = await adminPanelClient.getProperties();
```

### Step 9.3: Create Documentation

**File:** `admin-panel-backend/README.md`

```markdown
# Admin Panel Backend

## Setup
1. Copy .env.example to .env
2. Update DATABASE_URL, API_KEY
3. Run: npm install
4. Run migrations: npx typeorm migration:run
5. Seed data: npx ts-node src/seeds/seed.ts
6. Start: npm run dev

## API Endpoints
- POST /api/auth/login
- GET /api/properties
- ...
```

**File:** `admin-panel/README.md`

```markdown
# Admin Panel Frontend

## Setup
1. Copy .env.local.example to .env.local
2. Update NEXT_PUBLIC_API_URL
3. Run: npm install
4. Start: npm run dev
5. Login with admin@foryou.ae / Admin123!
```

---

## Summary

**What we've built:**

1. **Admin Panel Backend** (Express.js + TypeORM + PostgreSQL)

                        - Separate database
                        - API Key authentication for main backend
                        - JWT for admin panel frontend
                        - Full CRUD for Properties, Courses, News, Support, Settings

2. **Admin Panel Frontend** (Next.js + Ant Design)

                        - Login with NextAuth
                        - Dashboard
                        - Properties management (off-plan & secondary)
                        - Settings (developers, facilities, locations)
                        - Knowledge Base editor
                        - News editor
                        - Support system
                        - User management

3. **Main Backend Integration** (NestJS)

                        - API client to Admin Panel Backend
                        - Services updated to fetch from Admin Panel
                        - No database changes to main backend

**Architecture:**

- Decentralized: Admin Panel is completely separate
- Portable: Easy to copy to other projects
- Secure: API Key between backends, JWT for frontend

**Next Steps:**

1. Run migrations & seeds
2. Start all services (docker-compose up)
3. Login to admin panel
4. Test CRUD operations
5. Test mobile app integration