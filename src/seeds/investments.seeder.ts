import { DataSource } from 'typeorm';
import { Investment } from '../investments/entities/investment.entity';

export async function seedInvestments(dataSource: DataSource) {
  const repo = dataSource.getRepository(Investment);

  const defaultInvestments = [
    {
      user_id: 1,
      investment_type_id: 1,
      name: 'Préstamo a Carlos',
      principal: 300.0,
      expected_return: 330.0,
      account_id: 3,
      start_date: new Date('2025-07-01'),
      status: 'activa',
      notes: 'Préstamo con interés simple al 10% en 3 meses',
    },
    {
      user_id: 1,
      investment_type_id: 2,
      name: 'Compra y venta de teléfonos',
      principal: 500.0,
      expected_return: 700.0,
      account_id: 2,
      start_date: new Date('2025-07-05'),
      status: 'finalizada',
      notes: 'Ganancia por reventa de 2 celulares',
    },
  ];

  for (const inv of defaultInvestments) {
    const exists = await repo.findOne({
      where: { name: inv.name, user_id: inv.user_id },
    });
    if (!exists) {
      await repo.save(repo.create(inv));
    }
  }
}
