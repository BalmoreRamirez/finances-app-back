import { Module } from '@nestjs/common';
import { TransactionCategoriesService } from './transaction_categories.service';
import { TransactionCategoriesController } from './transaction_categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionCategory } from './entities/transaction-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionCategory])], // Add your entities here
  controllers: [TransactionCategoriesController],
  providers: [TransactionCategoriesService],
})
export class TransactionCategoriesModule {}
