// src/seeds/transaction-categories.seeder.ts
import { DataSource } from 'typeorm';
import { TransactionCategory } from '../transaction_categories/entities/transaction-category.entity';

export async function seedTransactionCategories(dataSource: DataSource) {
  const repo = dataSource.getRepository(TransactionCategory);

  const defaultCategories = [
    { name: 'Sueldo', type: 'ingreso' },
    { name: 'Venta de artículos', type: 'ingreso' },
    { name: 'Alimentos', type: 'egreso' },
    { name: 'Transporte', type: 'egreso' },
  ];

  for (const cat of defaultCategories) {
    const exists = await repo.findOne({ where: { name: cat.name } });
    if (!exists) {
      await repo.save(repo.create(cat));
    }
  }
}
