import { DataSource } from 'typeorm';
import { InvestmentType } from '../investment-types/entities/investment-type.entity';

export async function seedInvestmentTypes(dataSource: DataSource) {
  const repo = dataSource.getRepository(InvestmentType);

  const defaultTypes = [
    {
      name: 'Crédito',
      description:
        'Inversión realizada mediante la entrega de un crédito o préstamo.',
    },
    {
      name: 'Compra',
      description:
        'Inversión efectuada a través de la adquisición de un bien o activo.',
    },
  ];

  for (const type of defaultTypes) {
    const exists = await repo.findOne({ where: { name: type.name } });
    if (!exists) {
      await repo.save(repo.create(type));
    }
  }
}
