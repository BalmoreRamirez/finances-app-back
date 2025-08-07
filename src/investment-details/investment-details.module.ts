import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentDetailsService } from './investment-details.service';
import { InvestmentDetailsController } from './investment-details.controller';
import { InvestmentDetails } from './entities/investment-details.entity';
import { Investment } from '../investments/entities/investment.entity';
import { InvestmentsModule } from '../investments/investments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvestmentDetails, Investment]),
    forwardRef(() => InvestmentsModule),
  ],
  controllers: [InvestmentDetailsController],
  providers: [InvestmentDetailsService],
  exports: [InvestmentDetailsService],
})
export class InvestmentDetailsModule {}
