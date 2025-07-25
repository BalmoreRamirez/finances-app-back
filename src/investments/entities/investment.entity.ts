import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Account } from '../../accounts/entities/account.entity';
import { InvestmentType } from '../../investment-types/entities/investment-type.entity';
import { InvestmentDetails } from '../../investment-details/entities/investment-details.entity';

@Entity('investments')
@Check(`"status" IN ('activa', 'finalizada', 'cancelada')`)
export class Investment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', nullable: false })
  investment_type_id: number;

  @ManyToOne(() => InvestmentType)
  @JoinColumn({ name: 'investment_type_id' })
  investment_type: InvestmentType;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: false })
  principal: number;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    nullable: false,
    default: 0,
  })
  expected_return: number;

  @Column({ type: 'int', nullable: false })
  account_id: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ type: 'date', nullable: false })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: 'activa, finalizada, cancelada',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;
  @OneToMany(() => InvestmentDetails, (detail) => detail.investment)
  details: InvestmentDetails[];
}
