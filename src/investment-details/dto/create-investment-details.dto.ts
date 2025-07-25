import {
  IsInt,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateInvestmentDetailsDto {
  @IsInt()
  @IsNotEmpty()
  investment_id: number;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_income?: boolean;

  @IsBoolean()
  @IsOptional()
  paid?: boolean;
}
