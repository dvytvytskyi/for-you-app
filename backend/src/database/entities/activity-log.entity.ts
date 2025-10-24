import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum ActivityAction {
  // Auth
  LOGIN = 'login',
  LOGOUT = 'logout',
  REGISTER = 'register',
  PASSWORD_RESET = 'password_reset',
  
  // Users
  USER_CREATE = 'user_create',
  USER_UPDATE = 'user_update',
  USER_DELETE = 'user_delete',
  
  // Properties
  PROPERTY_CREATE = 'property_create',
  PROPERTY_UPDATE = 'property_update',
  PROPERTY_DELETE = 'property_delete',
  PROPERTY_VIEW = 'property_view',
  
  // Leads
  LEAD_CREATE = 'lead_create',
  LEAD_UPDATE = 'lead_update',
  LEAD_DELETE = 'lead_delete',
  LEAD_STATUS_CHANGE = 'lead_status_change',
  LEAD_ASSIGN = 'lead_assign',
  
  // Favorites
  FAVORITE_ADD = 'favorite_add',
  FAVORITE_REMOVE = 'favorite_remove',
  
  // Integrations
  AMO_SYNC = 'amo_sync',
  XML_SYNC = 'xml_sync',
  MEDIA_UPLOAD = 'media_upload',
  MEDIA_DELETE = 'media_delete',
  
  // Notifications
  NOTIFICATION_SEND = 'notification_send',
  
  // Other
  EXPORT = 'export',
  IMPORT = 'import',
}

export enum ActivityEntity {
  USER = 'user',
  PROPERTY = 'property',
  LEAD = 'lead',
  FAVORITE = 'favorite',
  DEVELOPER = 'developer',
  NOTIFICATION = 'notification',
  MEDIA = 'media',
  SYNC = 'sync',
  SYSTEM = 'system',
}

@Entity('activity_logs')
@Index(['userId', 'createdAt'])
@Index(['action', 'createdAt'])
@Index(['entityType', 'entityId'])
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Хто виконав дію
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Тип дії
  @Column({
    type: 'enum',
    enum: ActivityAction,
  })
  action: ActivityAction;

  // Над чим виконано дію
  @Column({
    name: 'entity_type',
    type: 'enum',
    enum: ActivityEntity,
  })
  entityType: ActivityEntity;

  @Column({ name: 'entity_id', nullable: true })
  entityId: string; // ID сутності (property ID, lead ID, тощо)

  // Деталі
  @Column({ type: 'text', nullable: true })
  description: string; // Текстовий опис дії

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>; // Додаткові дані (старі значення, нові значення, тощо)

  // IP та User Agent
  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

