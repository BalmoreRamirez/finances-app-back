import { DataSource } from 'typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';

export async function seedTransactions(dataSource: DataSource) {
  const repo = dataSource.getRepository(Transaction);

  const transactions = [
    {
      user_id: 1,
      account_id: 1,
      category_id: 1,
      amount: 800.0,
      description: 'Sueldo mensual julio',
      date: new Date('2025-07-01'),
    },
    {
      user_id: 1,
      account_id: 2,
      category_id: 3,
      amount: 20.0,
      description: 'Cena en pupusería',
      date: new Date('2025-07-02'),
    },
    {
      user_id: 1,
      account_id: 2,
      category_id: 4,
      amount: 5.0,
      description: 'Pasaje en bus',
      date: new Date('2025-07-02'),
    },
    {
      user_id: 1,
      account_id: 5,
      category_id: 2,
      amount: 700.0,
      description: 'Ganancia por venta de celulares',
      date: new Date('2025-07-06'),
    },
  ];

  for (const tx of transactions) {
    const exists = await repo.findOne({
      where: {
        user_id: tx.user_id,
        account_id: tx.account_id,
        category_id: tx.category_id,
        amount: tx.amount,
        date: tx.date,
      },
    });
    if (!exists) {
      await repo.save(repo.create(tx));
    }
  }
}
