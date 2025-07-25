import { DataSource } from 'typeorm';
import { Account } from '../accounts/entities/account.entity';

export async function seedAccounts(dataSource: DataSource) {
  const repo = dataSource.getRepository(Account);

  const defaultAccounts = [
    {
      id: 1,
      user_id: 1,
      account_type_id: 1,
      name: 'Banco Agrícola',
      currency: 'USD',
      balance: 1500.0,
    },
    {
      id: 2,
      user_id: 1,
      account_type_id: 2,
      name: 'Efectivo en mano',
      currency: 'USD',
      balance: 300.0,
    },
    {
      id: 3,
      user_id: 1,
      account_type_id: 3,
      name: 'Prestamos a terceros',
      currency: 'USD',
      balance: 0.0,
    },
    {
      id: 4,
      user_id: 1,
      account_type_id: 4,
      name: 'Sueldo mensual',
      currency: 'USD',
      balance: 0.0,
    },
    {
      id: 5,
      user_id: 1,
      account_type_id: 5,
      name: 'Ganancias de inversiones',
      currency: 'USD',
      balance: 0.0,
    },
  ];

  for (const acc of defaultAccounts) {
    const exists = await repo.findOne({
      where: { name: acc.name, user_id: acc.user_id },
    });
    if (!exists) {
      await repo.save(repo.create(acc));
    }
  }
}
