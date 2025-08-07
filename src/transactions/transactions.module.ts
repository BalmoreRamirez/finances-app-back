import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Account } from '../accounts/entities/account.entity';
import { TransactionCategory } from '../transaction_categories/entities/transaction-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account, TransactionCategory])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
