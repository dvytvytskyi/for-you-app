import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AmoStage } from './amo-stage.entity';

@Entity('amo_pipelines')
export class AmoPipeline {
  @PrimaryColumn()
  id: number; // ID воронки в AMO CRM

  @Column()
  name: string;

  @Column({ type: 'int', default: 0 })
  sort: number;

  @Column({ name: 'is_main', type: 'boolean', default: false })
  isMain: boolean;

  @Column({ name: 'is_unsorted_on', type: 'boolean', default: true })
  isUnsortedOn: boolean;

  @Column({ name: 'account_id' })
  accountId: string;

  @OneToMany(() => AmoStage, (stage) => stage.pipeline)
  stages: AmoStage[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

