import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum SyncStatus {
  SUCCESS = 'SUCCESS',
  PARTIAL = 'PARTIAL',
  FAILED = 'FAILED',
}

export enum SyncType {
  PROPERTIES = 'PROPERTIES',
  MANUAL = 'MANUAL',
  SCHEDULED = 'SCHEDULED',
}

@Entity('sync_logs')
export class SyncLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SyncType,
    default: SyncType.PROPERTIES,
  })
  type: SyncType;

  @Column({
    type: 'enum',
    enum: SyncStatus,
  })
  status: SyncStatus;

  @Column({ name: 'created_count', default: 0 })
  createdCount: number;

  @Column({ name: 'updated_count', default: 0 })
  updatedCount: number;

  @Column({ name: 'archived_count', default: 0 })
  archivedCount: number;

  @Column({ name: 'failed_count', default: 0 })
  failedCount: number;

  @Column({ name: 'total_processed', default: 0 })
  totalProcessed: number;

  @Column({ name: 'duration_ms', nullable: true })
  durationMs: number; // Час виконання в мілісекундах

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>; // Додаткові дані (URL, batch info, тощо)

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

