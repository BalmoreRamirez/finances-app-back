import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investment } from './entities/investment.entity';
import { InvestmentsService } from './investments.service';
import { InvestmentsController } from './investments.controller';
import { User } from '../users/entities/user.entity';
import { Account } from '../accounts/entities/account.entity';
import { InvestmentType } from '../investment-types/entities/investment-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investment, User, Account, InvestmentType]),
  ],
  controllers: [InvestmentsController],
  providers: [InvestmentsService],
})
export class InvestmentsModule {}
