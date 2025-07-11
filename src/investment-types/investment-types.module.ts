import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentTypesService } from './investment-types.service';
import { InvestmentTypesController } from './investment-types.controller';
import { InvestmentType } from './entities/investment-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvestmentType])],
  controllers: [InvestmentTypesController],
  providers: [InvestmentTypesService],
})
export class InvestmentTypesModule {}
