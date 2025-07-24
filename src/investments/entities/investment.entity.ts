import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Account } from '../../accounts/entities/account.entity';
import { InvestmentType } from '../../investment-types/entities/investment-type.entity';
import { InvestmentCreditPayment } from '../../investment-credit-payments/entities/investment-credit-payment.entity';

@Entity('investments')
export class Investment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', nullable: false })
  account_origen_id: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_origen_id' })
  account_origen: Account;

  @Column({ type: 'int', nullable: false })
  account_destino_id: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_destino_id' })
  account_destino: Account;

  @Column({ type: 'varchar', length: 100, nullable: false })
  investment_name: string;

  @Column({ type: 'int', nullable: false })
  investment_type_id: number;

  @ManyToOne(() => InvestmentType)
  @JoinColumn({ name: 'investment_type_id' })
  investment_type: InvestmentType;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  invested_amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  interest: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  total_amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  profit: number;

  @Column({ type: 'date', nullable: false })
  investment_date: Date;

  @Column({ type: 'date', nullable: true })
  due_date: Date;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: 'activo',
    comment: 'activo, cancelado, finalizado',
  })
  status: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => InvestmentCreditPayment, (payment) => payment.investment)
  credit_payments: InvestmentCreditPayment[];
}
