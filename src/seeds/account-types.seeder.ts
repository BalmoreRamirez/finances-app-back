import { DataSource } from 'typeorm';
import { AccountType } from '../account-types/entities/account-type.entity';

export async function seedAccountTypes(dataSource: DataSource) {
  const repo = dataSource.getRepository(AccountType);

  const defaultTypes = [
    {
      id: 1,
      name: 'Cuenta de banco',
      category: 'activo',
      description:
        'Cuenta bancaria utilizada para gestionar fondos líquidos y transacciones financieras.',
    },
    {
      id: 2,
      name: 'Efectivo',
      category: 'activo',
      description: 'Dinero en efectivo disponible para operaciones inmediatas.',
    },
    {
      id: 3,
      name: 'Crédito por cobrar',
      category: 'activo',
      description:
        'Montos que se esperan recibir de terceros por concepto de créditos otorgados.',
    },
    {
      id: 4,
      name: 'Ingreso fijo',
      category: 'ingreso',
      description:
        'Ingresos recurrentes provenientes de fuentes estables como salarios o rentas.',
    },
    {
      id: 5,
      name: 'Ingreso por inversión',
      category: 'ingreso',
      description:
        'Ingresos generados a partir de inversiones financieras o de capital.',
    },
    {
      id: 6,
      name: 'Gasto general',
      category: 'egreso',
      description: 'Egresos relacionados con gastos operativos y generales.',
    },
  ];

  for (const type of defaultTypes) {
    const exists = await repo.findOne({ where: { name: type.name } });
    if (!exists) {
      await repo.save(repo.create(type));
    }
  }
}
