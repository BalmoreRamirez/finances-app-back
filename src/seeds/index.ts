import { DataSource } from 'typeorm';
import { seedAccountTypes } from './account-types.seeder';
import { seedTransactionCategories } from './transaction-categories.seeder';
import { AccountType } from '../account-types/entities/account-type.entity';
import { TransactionCategory } from '../transaction_categories/entities/transaction-category.entity';
import { InvestmentType } from '../investment-types/entities/investment-type.entity';
import { seedInvestmentTypes } from './investment-types.seeder';
import { seedAccounts } from './accounts.seeder';
import { User } from '../users/entities/user.entity';
import { seedUser } from './user.seeder';
import { Account } from '../accounts/entities/account.entity';
import { Investment } from '../investments/entities/investment.entity';
import { seedInvestments } from './investments.seeder';
import { InvestmentDetails } from '../investment-details/entities/investment-details.entity';
import { seedInvestmentDetails } from './investment-details.seeder';
import { Transaction } from '../transactions/entities/transaction.entity';
import { seedTransactions } from './transactions.seeder';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: Number(process.env.TYPEORM_PORT) || 5432,
  username: process.env.TYPEORM_USERNAME || 'root',
  password: process.env.TYPEORM_PASSWORD || 'root',
  database: process.env.TYPEORM_DATABASE || 'finances',
  synchronize: true,
  entities: [
    User,
    Account,
    AccountType,
    TransactionCategory,
    InvestmentType,
    Investment,
    InvestmentDetails,
    Transaction,
  ],
});

async function runSeeds() {
  await AppDataSource.initialize();
  await seedAccountTypes(AppDataSource);
  await seedTransactionCategories(AppDataSource);
  await seedInvestmentTypes(AppDataSource);
  await seedTransactions(AppDataSource);
  await seedUser(AppDataSource);
  await seedAccounts(AppDataSource);
  await seedInvestments(AppDataSource);
  await seedInvestmentDetails(AppDataSource);
  await AppDataSource.destroy();
}

runSeeds().then(() => {
  console.log('Database seeding completed successfully.');
});
