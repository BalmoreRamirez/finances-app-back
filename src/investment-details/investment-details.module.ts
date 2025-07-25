import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentDetailsService } from './investment-details.service';
import { InvestmentDetailsController } from './investment-details.controller';
import { InvestmentDetails } from './entities/investment-details.entity';
import { Investment } from '../investments/entities/investment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvestmentDetails, Investment])],
  controllers: [InvestmentDetailsController],
  providers: [InvestmentDetailsService],
})
export class InvestmentDetailsModule {}
