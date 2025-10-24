import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AmoRole } from './amo-role.entity';

@Entity('amo_users')
export class AmoUser {
  @PrimaryColumn()
  id: number; // ID користувача в AMO CRM

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: 'varchar', length: 10, default: 'ru' })
  lang: string;

  @Column({ name: 'is_admin', type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ name: 'is_free', type: 'boolean', default: false })
  isFree: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'role_id', type: 'int', nullable: true })
  roleId: number | null;

  @Column({ name: 'group_id', type: 'int', nullable: true })
  groupId: number | null;

  @Column({ name: 'account_id' })
  accountId: string;

  @ManyToOne(() => AmoRole, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: AmoRole | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

