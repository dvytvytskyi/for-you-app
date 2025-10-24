import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('notification_settings')
export class NotificationSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Загальні налаштування
  @Column({ name: 'push_enabled', default: true })
  pushEnabled: boolean;

  @Column({ name: 'email_enabled', default: true })
  emailEnabled: boolean;

  // Налаштування для Leads
  @Column({ name: 'lead_created', default: true })
  leadCreated: boolean;

  @Column({ name: 'lead_assigned', default: true })
  leadAssigned: boolean;

  @Column({ name: 'lead_status_changed', default: true })
  leadStatusChanged: boolean;

  // Налаштування для Properties
  @Column({ name: 'new_property', default: true })
  newProperty: boolean;

  @Column({ name: 'price_changed', default: true })
  priceChanged: boolean;

  @Column({ name: 'favorite_property_updated', default: true })
  favoritePropertyUpdated: boolean;

  // Налаштування для Exclusive (для інвесторів)
  @Column({ name: 'new_exclusive_property', default: true })
  newExclusiveProperty: boolean;

  // Системні сповіщення
  @Column({ name: 'system_notifications', default: true })
  systemNotifications: boolean;

  @Column({ name: 'marketing_notifications', default: false })
  marketingNotifications: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

