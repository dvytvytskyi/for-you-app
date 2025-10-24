import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AmoUser } from './amo-user.entity';

@Entity('amo_roles')
export class AmoRole {
  @PrimaryColumn()
  id: number; // ID ролі в AMO CRM

  @Column()
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  rights: any; // Зберігаємо повну структуру прав з AMO CRM

  @Column({ name: 'account_id' })
  accountId: string;

  @OneToMany(() => AmoUser, (user) => user.role)
  users: AmoUser[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

