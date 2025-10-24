import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AmoPipeline } from './amo-pipeline.entity';
import { LeadStatus } from './lead.entity';

@Entity('amo_stages')
export class AmoStage {
  @PrimaryColumn()
  id: number; // ID статусу в AMO CRM

  @Column({ name: 'pipeline_id' })
  pipelineId: number;

  @Column()
  name: string;

  @Column({ type: 'int', default: 0 })
  sort: number;

  @Column({ name: 'is_editable', type: 'boolean', default: true })
  isEditable: boolean;

  @Column({ type: 'varchar', nullable: true })
  color: string | null;

  @Column({ type: 'enum', enum: LeadStatus, nullable: true, name: 'mapped_status' })
  mappedStatus: LeadStatus | null;

  @ManyToOne(() => AmoPipeline, (pipeline) => pipeline.stages)
  @JoinColumn({ name: 'pipeline_id' })
  pipeline: AmoPipeline;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

