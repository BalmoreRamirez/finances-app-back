import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestmentTypeDto } from './create-investment-type.dto';

export class UpdateInvestmentTypeDto extends PartialType(
  CreateInvestmentTypeDto,
) {}
