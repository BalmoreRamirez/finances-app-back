import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateInvestmentCreditPaymentDto {
  @IsNumber()
  @IsNotEmpty()
  monto_pago: number;

  @IsDateString()
  @IsNotEmpty()
  fecha_pago: Date;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
