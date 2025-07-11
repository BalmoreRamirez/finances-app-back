import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentCreditPaymentsService } from './investment-credit-payments.service';
import { InvestmentCreditPaymentsController } from './investment-credit-payments.controller';
import { InvestmentCreditPayment } from './entities/investment-credit-payment.entity';
import { Investment } from '../investments/entities/investment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvestmentCreditPayment, Investment])],
  controllers: [InvestmentCreditPaymentsController],
  providers: [InvestmentCreditPaymentsService],
})
export class InvestmentCreditPaymentsModule {}
