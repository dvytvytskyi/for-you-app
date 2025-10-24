import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Property } from './property.entity';
import { Lead } from './lead.entity';

export enum DocumentType {
  // Property documents
  BROCHURE = 'BROCHURE',
  FLOOR_PLAN = 'FLOOR_PLAN',
  MASTER_PLAN = 'MASTER_PLAN',
  PROPERTY_CONTRACT = 'PROPERTY_CONTRACT',
  PROPERTY_CERTIFICATE = 'PROPERTY_CERTIFICATE',
  
  // Lead documents
  LEAD_CONTRACT = 'LEAD_CONTRACT',
  CLIENT_ID = 'CLIENT_ID',
  CLIENT_PASSPORT = 'CLIENT_PASSPORT',
  POWER_OF_ATTORNEY = 'POWER_OF_ATTORNEY',
  
  // User documents (Broker)
  BROKER_LICENSE = 'BROKER_LICENSE',
  BROKER_CERTIFICATE = 'BROKER_CERTIFICATE',
  
  // Other
  OTHER = 'OTHER',
}

export enum DocumentCategory {
  PROPERTY = 'PROPERTY',
  LEAD = 'LEAD',
  USER = 'USER',
}

@Entity('documents')
@Index(['entityType', 'entityId'])
@Index(['uploadedBy', 'createdAt'])
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Тип документа
  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  type: DocumentType;

  // Категорія (до чого прив'язаний)
  @Column({
    name: 'entity_type',
    type: 'enum',
    enum: DocumentCategory,
  })
  entityType: DocumentCategory;

  @Column({ name: 'entity_id', type: 'uuid' })
  entityId: string;

  // Опціональні Relations (для зручності)
  @ManyToOne(() => Property, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property?: Property;

  @Column({ name: 'property_id', type: 'uuid', nullable: true })
  propertyId?: string;

  @ManyToOne(() => Lead, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lead_id' })
  lead?: Lead;

  @Column({ name: 'lead_id', type: 'uuid', nullable: true })
  leadId?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string;

  // Дані файлу
  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'original_name' })
  originalName: string;

  @Column({ name: 'file_url' })
  fileUrl: string;

  @Column({ name: 's3_key' })
  s3Key: string; // Ключ в S3 для видалення

  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({ name: 'file_size', type: 'bigint' }) // в байтах
  fileSize: number;

  // Додаткові дані
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_public', default: false })
  isPublic: boolean; // Чи доступний публічно

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean; // Чи верифікований адміном

  // Хто завантажив
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'uploaded_by' })
  uploadedByUser?: User;

  @Column({ name: 'uploaded_by', type: 'uuid', nullable: true })
  uploadedBy?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

