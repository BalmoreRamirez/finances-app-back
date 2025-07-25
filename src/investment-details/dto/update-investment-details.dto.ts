import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestmentDetailsDto } from './create-investment-details.dto';

export class UpdateInvestmentDetailsDto extends PartialType(
  CreateInvestmentDetailsDto,
) {}
