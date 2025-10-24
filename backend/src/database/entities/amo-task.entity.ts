import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AmoUser } from './amo-user.entity';

export enum AmoTaskType {
  CALL = 1, // Дзвінок
  MEETING = 2, // Зустріч
}

@Entity('amo_tasks')
export class AmoTask {
  @PrimaryColumn({ type: 'integer' })
  id: number; // ID задачі в AMO CRM

  @Column({ type: 'text' })
  text: string; // Опис задачі

  @Column({ name: 'task_type_id', type: 'int', default: AmoTaskType.CALL })
  taskTypeId: number; // Тип задачі (1 - дзвінок, 2 - зустріч)

  @Column({ name: 'complete_till', type: 'bigint' })
  completeTill: number; // Дата виконання (Unix Timestamp)

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted: boolean; // Чи виконана задача

  @Column({ name: 'responsible_user_id', type: 'int' })
  responsibleUserId: number; // Відповідальний користувач

  @ManyToOne(() => AmoUser, { nullable: false })
  @JoinColumn({ name: 'responsible_user_id' })
  responsibleUser: AmoUser;

  @Column({ name: 'entity_id', type: 'int', nullable: true })
  entityId: number; // ID сутності (lead/contact/company)

  @Column({ name: 'entity_type', type: 'varchar', nullable: true })
  entityType: string; // Тип сутності (leads/contacts/companies)

  @Column({ type: 'int', nullable: true })
  duration: number; // Тривалість в секундах

  @Column({ name: 'result_text', type: 'text', nullable: true })
  resultText: string; // Результат виконання задачі

  @Column({ name: 'created_by', type: 'int', nullable: true })
  createdBy: number; // Хто створив

  @Column({ name: 'updated_by', type: 'int', nullable: true })
  updatedBy: number; // Хто оновив

  @Column({ name: 'amo_created_at', type: 'bigint', nullable: true })
  amoCreatedAt: number; // Unix timestamp з AMO CRM

  @Column({ name: 'amo_updated_at', type: 'bigint', nullable: true })
  amoUpdatedAt: number; // Unix timestamp з AMO CRM

  @Column({ name: 'account_id' })
  accountId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

