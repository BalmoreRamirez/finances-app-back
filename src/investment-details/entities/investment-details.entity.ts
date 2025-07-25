import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Investment } from '../../investments/entities/investment.entity';

@Entity('investment_details')
export class InvestmentDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  investment_id: number;

  @ManyToOne(() => Investment, (investment) => investment.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'investment_id' })
  investment: Investment;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true, nullable: false })
  is_income: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  paid: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
