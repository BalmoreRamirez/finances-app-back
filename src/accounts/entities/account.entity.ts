import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AccountType } from '../../account-types/entities/account-type.entity';
import { User } from '../../users/entities/user.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: false,
    comment: 'ID del usuario propietario de la cuenta',
  })
  user_id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
    comment: 'Nombre de la cuenta',
  })
  account_name: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    nullable: false,
    comment: 'Saldo de la cuenta',
  })
  balance: number;

  @ManyToOne(() => AccountType)
  @JoinColumn({ name: 'account_type_id' })
  account_type: AccountType;

  @Column({
    type: 'int',
    nullable: false,
    comment: 'ID del tipo de cuenta',
  })
  account_type_id: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de creación',
  })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

}
