import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Developer } from './developer.entity';
import { PropertyImage } from './property-image.entity';
import { PropertyAmenity } from './property-amenity.entity';
import { PaymentPlan } from './payment-plan.entity';

export enum PropertyType {
  RESIDENTIAL_COMPLEX = 'residential_complex',
  VILLA = 'villa',
  APARTMENT = 'apartment',
  TOWNHOUSE = 'townhouse',
  PENTHOUSE = 'penthouse',
  LAND = 'land',
}

@Entity('properties')
@Index(['externalId'])
@Index(['isExclusive'])
@Index(['isSoldOut'])
@Index(['minPrice'])
@Index(['maxPrice'])
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'external_id', type: 'bigint', unique: true })
  externalId: string;

  @Column({
    type: 'enum',
    enum: PropertyType,
    default: PropertyType.RESIDENTIAL_COMPLEX,
  })
  type: PropertyType;

  // Multilingual fields
  @Column({ name: 'title_en' })
  titleEn: string;

  @Column({ name: 'title_ru', nullable: true })
  titleRu: string;

  @Column({ name: 'title_ar', nullable: true })
  titleAr: string;

  @Column({ name: 'description_en', type: 'text', nullable: true })
  descriptionEn: string;

  @Column({ name: 'description_ru', type: 'text', nullable: true })
  descriptionRu: string;

  @Column({ name: 'description_ar', type: 'text', nullable: true })
  descriptionAr: string;

  @Column({ name: 'status_en', nullable: true })
  statusEn: string;

  @Column({ name: 'status_ru', nullable: true })
  statusRu: string;

  @Column({ name: 'status_ar', nullable: true })
  statusAr: string;

  // Images
  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string;

  @Column({ name: 'main_photo_url', nullable: true })
  mainPhotoUrl: string;

  // Location (PostGIS)
  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: string; // Зберігається як WKT: 'POINT(longitude latitude)'

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'jsonb', nullable: true })
  districts: string[]; // Масив районів

  // Price
  @Column({ name: 'min_price', type: 'numeric', precision: 15, scale: 2, nullable: true })
  minPrice: number;

  @Column({ name: 'max_price', type: 'numeric', precision: 15, scale: 2, nullable: true })
  maxPrice: number;

  @Column({ default: 'AED' })
  currency: string;

  // Flags
  @Column({ name: 'is_exclusive', default: false })
  isExclusive: boolean;

  @Column({ name: 'is_sold_out', default: false })
  isSoldOut: boolean;

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  // Other details
  @Column({ name: 'buildings_count', type: 'integer', nullable: true })
  buildingsCount: number;

  @Column({ name: 'planned_completion_at', type: 'timestamptz', nullable: true })
  plannedCompletionAt: Date;

  // Developer relation
  @ManyToOne(() => Developer, (developer) => developer.properties, { nullable: true })
  @JoinColumn({ name: 'developer_id' })
  developer: Developer;

  @Column({ name: 'developer_id', type: 'uuid', nullable: true })
  developerId: string;

  // Relations
  @OneToMany(() => PropertyImage, (image) => image.property, { cascade: true })
  images: PropertyImage[];

  @OneToMany(() => PropertyAmenity, (amenity) => amenity.property, { cascade: true })
  amenities: PropertyAmenity[];

  @OneToMany(() => PaymentPlan, (plan) => plan.property, { cascade: true })
  paymentPlans: PaymentPlan[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

