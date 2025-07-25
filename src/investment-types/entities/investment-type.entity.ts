import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('investment_types')
export class InvestmentType {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
    comment: 'Name of the investment type',
  })
  name: string;
  @Column({
    type: 'text',
    nullable: false,
    comment: 'Description of the investment type',
  })
  description: string;
}
