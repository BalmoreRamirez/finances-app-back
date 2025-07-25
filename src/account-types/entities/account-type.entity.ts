import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('account_types')
export class AccountType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
    comment: 'Nombre del tipo de cuenta',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Categoría de la cuenta',
  })
  category: string;

  @Column({
    type: 'text',
    nullable: false,
    comment: 'Descripción del tipo de cuenta',
  })
  description: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de creación',
  })
  createdAt: Date;
}
