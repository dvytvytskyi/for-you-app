import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Property } from './property.entity';
import { AmoUser } from './amo-user.entity';
import { AmoContact } from './amo-contact.entity';

export enum LeadStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

export enum ContactMethod {
  CALL = 'CALL',
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL',
}

export enum ContactTime {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  ANYTIME = 'ANYTIME',
}

@Entity('leads')
@Index(['status'])
@Index(['clientId'])
@Index(['brokerId'])
@Index(['propertyId'])
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Property relation (optional - може бути загальна заявка)
  @ManyToOne(() => Property, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column({ name: 'property_id', type: 'uuid', nullable: true })
  propertyId: string;

  // Client relation (може бути null для guest users)
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({ name: 'client_id', type: 'uuid', nullable: true })
  clientId: string;

  // Guest user info (якщо client_id === null)
  @Column({ name: 'guest_name', nullable: true })
  guestName: string;

  @Column({ name: 'guest_phone', nullable: true })
  guestPhone: string;

  @Column({ name: 'guest_email', nullable: true })
  guestEmail: string;

  // Assigned broker
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'broker_id' })
  broker: User;

  @Column({ name: 'broker_id', type: 'uuid', nullable: true })
  brokerId: string;

  // Lead details
  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({
    name: 'contact_method',
    type: 'enum',
    enum: ContactMethod,
    default: ContactMethod.CALL,
  })
  contactMethod: ContactMethod;

  @Column({
    name: 'contact_time',
    type: 'enum',
    enum: ContactTime,
    default: ContactTime.ANYTIME,
  })
  contactTime: ContactTime;

  // AMO CRM integration
  @Column({ name: 'amo_lead_id', type: 'int', nullable: true })
  amoLeadId: number;

  @Column({ name: 'amo_contact_id', type: 'int', nullable: true })
  amoContactId: number;

  @ManyToOne(() => AmoContact, (contact) => contact.leads, { nullable: true })
  @JoinColumn({ name: 'amo_contact_id' })
  amoContact: AmoContact;

  @Column({ name: 'responsible_user_id', type: 'int', nullable: true })
  responsibleUserId: number;

  @ManyToOne(() => AmoUser, { nullable: true })
  @JoinColumn({ name: 'responsible_user_id' })
  responsibleUser: AmoUser;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

