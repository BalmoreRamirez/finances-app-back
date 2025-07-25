import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './typeorm.config';
import { InvestmentTypesModule } from './investment-types/investment-types.module';
import { AccountTypesModule } from './account-types/account-types.module';
import { AccountsModule } from './accounts/accounts.module';
import { UsersModule } from './users/users.module';
import { InvestmentsModule } from './investments/investments.module';
import { InvestmentDetailsModule } from './investment-details/investment-details.module';
import { TransactionCategoriesModule } from './transaction_categories/transaction_categories.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    InvestmentTypesModule,
    AccountTypesModule,
    AccountsModule,
    UsersModule,
    InvestmentsModule,
    InvestmentDetailsModule,
    TransactionCategoriesModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
