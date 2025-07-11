import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestmentCreditPaymentDto } from './create-investment-credit-payment.dto';

export class UpdateInvestmentCreditPaymentDto extends PartialType(CreateInvestmentCreditPaymentDto) {}

