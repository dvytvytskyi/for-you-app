import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Property } from './property.entity';

export enum AmenityType {
  INDOOR = 'indoor',
  OUTDOOR = 'outdoor',
  GENERAL = 'general',
}

@Entity('property_amenities')
@Index(['propertyId'])
export class PropertyAmenity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Property, (property) => property.amenities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column({ name: 'property_id', type: 'uuid' })
  propertyId: string;

  // Multilingual amenity names
  @Column({ name: 'amenity_name_en' })
  amenityNameEn: string;

  @Column({ name: 'amenity_name_ru', nullable: true })
  amenityNameRu: string;

  @Column({ name: 'amenity_name_ar', nullable: true })
  amenityNameAr: string;

  @Column({
    name: 'amenity_type',
    type: 'enum',
    enum: AmenityType,
    default: AmenityType.GENERAL,
  })
  amenityType: AmenityType;
}

