import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique(['username'])
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: 'Nombre de usuario',
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Correo electrónico',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Contraseña encriptada',
  })
  password: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de creación',
  })
  createdAt: Date;
}
