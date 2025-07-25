import { DataSource } from 'typeorm';
import { InvestmentDetails } from '../investment-details/entities/investment-details.entity';

export async function seedInvestmentDetails(dataSource: DataSource) {
  const repo = dataSource.getRepository(InvestmentDetails);

  const details = [
    {
      investment_id: 1,
      date: new Date('2025-08-01'),
      amount: 110.0,
      description: 'Primera cuota Carlos',
      is_income: true,
      paid: true,
    },
    {
      investment_id: 1,
      date: new Date('2025-09-01'),
      amount: 110.0,
      description: 'Segunda cuota Carlos',
      is_income: true,
      paid: false,
    },
    {
      investment_id: 1,
      date: new Date('2025-10-01'),
      amount: 110.0,
      description: 'Tercera cuota Carlos',
      is_income: true,
      paid: false,
    },
    {
      investment_id: 2,
      date: new Date('2025-07-06'),
      amount: 700.0,
      description: 'Venta de los teléfonos',
      is_income: true,
      paid: true,
    },
  ];

  for (const detail of details) {
    const exists = await repo.findOne({
      where: {
        investment_id: detail.investment_id,
        date: detail.date,
        amount: detail.amount,
      },
    });
    if (!exists) {
      await repo.save(repo.create(detail));
    }
  }
}