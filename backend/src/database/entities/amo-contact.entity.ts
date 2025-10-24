import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { AmoUser } from './amo-user.entity';
import { Lead } from './lead.entity';

@Entity('amo_contacts')
export class AmoContact {
  @PrimaryColumn()
  id: number; // ID контакта в AMO CRM

  @Column()
  name: string;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'responsible_user_id', type: 'int', nullable: true })
  responsibleUserId: number;

  @ManyToOne(() => AmoUser, { nullable: true })
  @JoinColumn({ name: 'responsible_user_id' })
  responsibleUser: AmoUser;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column({ name: 'amo_created_at', type: 'bigint', nullable: true })
  amoCreatedAt: number; // Unix timestamp з AMO CRM

  @Column({ name: 'amo_updated_at', type: 'bigint', nullable: true })
  amoUpdatedAt: number; // Unix timestamp з AMO CRM

  @OneToMany(() => Lead, (lead) => lead.amoContact)
  leads: Lead[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

