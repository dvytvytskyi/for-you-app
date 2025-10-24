# 🏗️ Архітектура проекту For You Real Estate

## 📊 Загальна схема

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT APPLICATIONS                      │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   iOS App    │  Android App │  Admin Panel │   Web Portal   │
│  (Flutter)   │  (Flutter)   │  (Next.js)   │   (Next.js)    │
└──────────────┴──────────────┴──────────────┴────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY / LOAD BALANCER             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API (NestJS)                      │
├─────────────────────────────────────────────────────────────┤
│  Auth │ Users │ Properties │ Leads │ Content │ Notifications│
└─────────────────────────────────────────────────────────────┘
                    │                    │
                    ▼                    ▼
        ┌──────────────────┐  ┌──────────────────┐
        │   PostgreSQL     │  │      Redis       │
        │   + PostGIS      │  │   (Cache/Queue)  │
        └──────────────────┘  └──────────────────┘
                    │
                    ▼
        ┌──────────────────────────────┐
        │   External Services          │
        ├──────────────────────────────┤
        │ • AWS S3 / Cloud Storage     │
        │ • Firebase (Push)            │
        │ • Payment Gateway            │
        │ • External Property APIs     │
        └──────────────────────────────┘
```

## 🎯 Backend Архітектура (NestJS)

### Модульна структура

```typescript
Backend/
├── Auth Module              // Автентифікація та авторизація
│   ├── JWT Strategy
│   ├── Local Strategy
│   ├── Guards (Role-based)
│   └── Decorators
│
├── Users Module            // Управління користувачами
│   ├── User Entity
│   ├── User Repository
│   ├── User Service
│   └── User Controller
│
├── Properties Module       // Управління нерухомістю
│   ├── Property Entity
│   ├── Location (PostGIS)
│   ├── Images/Media
│   └── Search & Filters
│
├── Leads Module           // Управління заявками
│   ├── Lead Entity
│   ├── Assignment Logic
│   ├── Status Tracking
│   └── Notifications
│
├── Content Module         // CMS функціонал
│   ├── News
│   ├── Training Materials
│   └── Static Pages
│
└── Notifications Module   // Push-сповіщення
    ├── FCM Integration
    ├── Template Management
    └── Scheduling
```

### Базові Entity

#### User Entity
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole; // CLIENT | BROKER | INVESTOR | ADMIN

  @Column({ type: 'enum', enum: UserStatus })
  status: UserStatus; // PENDING | ACTIVE | BLOCKED

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### Property Entity
```typescript
@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: PropertyType })
  type: PropertyType; // APARTMENT | HOUSE | COMMERCIAL

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  area: number;

  @Column()
  rooms: number;

  @Column()
  address: string;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326 })
  location: Point; // PostGIS

  @Column('jsonb', { nullable: true })
  images: string[];

  @Column({ default: false })
  isExclusive: boolean;

  @Column({ type: 'enum', enum: PropertyStatus })
  status: PropertyStatus;

  @ManyToOne(() => User)
  broker: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### Lead Entity
```typescript
@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  client: User;

  @ManyToOne(() => Property, { nullable: true })
  property: Property;

  @ManyToOne(() => User, { nullable: true })
  assignedBroker: User;

  @Column({ type: 'enum', enum: LeadStatus })
  status: LeadStatus; // NEW | ASSIGNED | CONTACTED | CONVERTED

  @Column('text', { nullable: true })
  notes: string;

  @Column({ nullable: true })
  contactPreference: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## 🎨 Frontend Архітектура

### Admin Panel (Next.js)

```
admin-panel/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard
│   ├── login/             # Сторінка логіну
│   ├── users/             # Управління користувачами
│   ├── properties/        # Управління нерухомістю
│   ├── leads/             # Управління заявками
│   ├── content/           # CMS
│   └── settings/          # Налаштування
│
├── components/            # Reusable компоненти
│   ├── Layout/
│   ├── DataTable/
│   ├── Forms/
│   └── Charts/
│
├── lib/                   # Утиліти
│   ├── api.ts            # API клієнт (Axios)
│   ├── auth.ts           # NextAuth конфігурація
│   └── utils.ts
│
├── hooks/                # Custom hooks
│   ├── useUsers.ts
│   ├── useProperties.ts
│   └── useLeads.ts
│
└── types/               # TypeScript типи
    └── index.ts
```

### Mobile App (Flutter) - Планується

```
mobile/
├── lib/
│   ├── core/              # Базова функціональність
│   │   ├── network/
│   │   ├── storage/
│   │   └── utils/
│   │
│   ├── features/          # Feature-based structure
│   │   ├── auth/
│   │   ├── properties/
│   │   ├── profile/
│   │   └── favorites/
│   │
│   ├── shared/           # Спільні віджети
│   │   ├── widgets/
│   │   ├── models/
│   │   └── services/
│   │
│   └── main.dart
│
└── pubspec.yaml
```

## 🔐 Безпека

### Автентифікація та Авторизація

1. **JWT Tokens**
   - Access Token (7 днів)
   - Refresh Token (30 днів)
   - HttpOnly cookies для веб

2. **Role-Based Access Control (RBAC)**
   ```typescript
   enum UserRole {
     CLIENT = 'CLIENT',       // Базові права
     BROKER = 'BROKER',       // + CRM, Lead Management
     INVESTOR = 'INVESTOR',   // + Exclusive Properties
     ADMIN = 'ADMIN'          // Full Access
   }
   ```

3. **Guards та Decorators**
   ```typescript
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(UserRole.ADMIN, UserRole.BROKER)
   async getLeads() { ... }
   ```

### Захист даних

- **Helmet** — HTTP headers security
- **CORS** — Cross-Origin Resource Sharing
- **Rate Limiting** — Захист від DDoS
- **Input Validation** — class-validator
- **SQL Injection Protection** — TypeORM параметризовані запити
- **XSS Protection** — Sanitization

## 📊 База даних

### PostgreSQL з PostGIS

PostGIS надає геопросторові можливості:

```sql
-- Пошук нерухомості в радіусі 5 км
SELECT * FROM properties
WHERE ST_DWithin(
  location,
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
  5000
);

-- Нерухомість в межах полігону (району)
SELECT * FROM properties
WHERE ST_Within(location, polygon_geom);
```

### Індекси

```sql
-- Spatial index для PostGIS
CREATE INDEX idx_properties_location 
ON properties USING GIST(location);

-- B-tree індекси
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_leads_status ON leads(status);
```

## 🚀 Розгортання

### Docker Production

```yaml
services:
  backend:
    image: for-you-backend:latest
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 3
      
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
```

### CI/CD Pipeline

```yaml
# GitHub Actions / GitLab CI
stages:
  - test
  - build
  - deploy

test:
  - npm run lint
  - npm run test
  
build:
  - docker build -t app:$VERSION
  
deploy:
  - docker push
  - kubectl apply -f k8s/
```

## 📈 Масштабування

### Горизонтальне масштабування

- Load Balancer (Nginx/AWS ALB)
- Multiple Backend instances
- Redis для session storage
- Database read replicas

### Кешування

```typescript
// Redis для кешування
@Injectable()
export class PropertiesService {
  async getProperties() {
    const cached = await this.redis.get('properties:all');
    if (cached) return JSON.parse(cached);
    
    const data = await this.repo.find();
    await this.redis.set('properties:all', JSON.stringify(data), 'EX', 300);
    return data;
  }
}
```

## 🔄 Інтеграції

### Зовнішні сервіси

1. **Firebase Cloud Messaging**
   - Push notifications для iOS/Android

2. **AWS S3 / Google Cloud Storage**
   - Зберігання зображень та документів

3. **Payment Gateways**
   - Stripe / PayPal для оплат

4. **Real Estate APIs**
   - Інтеграція з зовнішніми базами нерухомості

---

**Версія:** 1.0.0  
**Остання оновлення:** Жовтень 2025

