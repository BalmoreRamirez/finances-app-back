import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Investment } from '../../investments/entities/investment.entity';

@Entity('investment_credit_payments')
export class InvestmentCreditPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  investment_id: number;

  @ManyToOne(() => Investment, (investment) => investment.credit_payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'investment_id' })
  investment: Investment;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  monto_pago: number;

  @Column({ type: 'date', nullable: false })
  fecha_pago: Date;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
