import { DataSource } from 'typeorm';
import { Account } from '../accounts/entities/account.entity';

export async function seedAccounts(dataSource: DataSource) {
  const repo = dataSource.getRepository(Account);

  const defaultAccounts = [
    {
      id: 1,
      user_id: 1, // Assuming user_id 1 is the default user
      name: 'Efectivo',
      account_type_id: 1,
      description: 'Dinero físico disponible',
      balance: 0,
      currency: 'USD',
    },
    {
      id: 2,
      user_id: 1, // Assuming user_id 1 is the default user
      name: 'Banco',
      account_type_id: 1,
      description: 'Dinero en cuentas bancarias',
      balance: 0,
      currency: 'USD',
    },
    {
      id: 3,
      user_id: 1, // Assuming user_id 1 is the default user
      name: 'Créditos por cobrar',
      account_type_id: 1,
      description: 'Dinero que otros te deben',
      balance: 0,
      currency: 'USD',
    },
    {
      id: 4,
      user_id: 1, // Assuming user_id 1 is the default user
      name: 'Inventario',
      account_type_id: 1,
      description: 'Artículos o bienes para reventa',
      balance: 0,
      currency: 'USD',
    },
    {
      id: 5,
      user_id: 1, // Assuming user_id 1 is the default user
      name: 'Capital inicial',
      account_type_id: 3,
      description: 'Aporte inicial de tu dinero al sistema',
      balance: 0,
      currency: 'USD',
    },
    {
      id: 6,
      user_id: 1, // Assuming user_id 1 is the default user
      name: 'Ingreso por interés',
      account_type_id: 4,
      description: 'Ganancias generadas por préstamos',
      balance: 0,
      currency: 'USD',
    },
    {
      id: 7,
      user_id: 1, // Assuming user_id 1 is the default user
      name: 'Ingreso por venta',
      account_type_id: 4,
      description: 'Ganancias obtenidas por vender productos',
      balance: 0,
      currency: 'USD',
    },
    {
      id: 8,
      user_id: 1, // Assuming user_id 1 is the default user
      name: 'Compra de activos',
      account_type_id: 5,
      description: 'Registro contable de lo que compras',
      balance: 0,
      currency: 'USD',
    },
    {
      id: 9,
      user_id: 1, // Assuming user_id 1 is the default user
      name: 'Entrega de préstamo',
      account_type_id: 5,
      description: 'Registro de salida cuando prestas dinero',
      balance: 0,
      currency: 'USD',
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
