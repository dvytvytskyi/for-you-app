import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Property } from './property.entity';

@Entity('payment_plans')
@Index(['propertyId'])
export class PaymentPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Property, (property) => property.paymentPlans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column({ name: 'property_id', type: 'uuid' })
  propertyId: string;

  @Column({ name: 'plan_name' })
  planName: string;

  @Column({ name: 'down_payment_percent', type: 'numeric', precision: 5, scale: 2 })
  downPaymentPercent: number;

  @Column({ name: 'installment_years', type: 'integer' })
  installmentYears: number;

  @Column({ type: 'text', nullable: true })
  description: string;
}

