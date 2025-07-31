import { DataSource } from 'typeorm';
import { AccountType } from '../account-types/entities/account-type.entity';

export async function seedAccountTypes(dataSource: DataSource) {
  const repo = dataSource.getRepository(AccountType);

  const defaultTypes = [
    {
      id: 1,
      name: 'Activo',
      description: 'Recursos o derechos que posees',
    },
    {
      id: 2,
      name: 'Pasivo',
      description: 'Deudas u obligaciones',
    },
    {
      id: 3,
      name: 'Patrimonio',
      description: 'Aportes de capital',
    },
    {
      id: 4,
      name: 'Ingreso',
      description: 'Ganancias obtenidas',
    },
    {
      id: 5,
      name: 'Egreso',
      description: 'Gastos o salidas de dinero',
    },
  ];
  for (const type of defaultTypes) {
    const exists = await repo.findOne({ where: { name: type.name } });
    if (!exists) {
      await repo.save(repo.create(type));
    }
  }
}
