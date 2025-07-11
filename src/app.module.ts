import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './typeorm.config';
import { InvestmentTypesModule } from './investment-types/investment-types.module';
import { AccountTypesModule } from './account-types/account-types.module';
import { AccountsModule } from './accounts/accounts.module';
import { UsersModule } from './users/users.module';
import { InvestmentsModule } from './investments/investments.module';
import { InvestmentCreditPaymentsModule } from './investment-credit-payments/investment-credit-payments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    InvestmentTypesModule,
    AccountTypesModule,
    AccountsModule,
    UsersModule,
    InvestmentsModule,
    InvestmentCreditPaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
