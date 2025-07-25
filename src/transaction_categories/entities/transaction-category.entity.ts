import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transaction_categories')
export class TransactionCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  type: string;
}
