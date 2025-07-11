import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateInvestmentDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  account_id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  investment_name: string;

  @IsInt()
  @IsNotEmpty()
  investment_type_id: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  beneficiary?: string;

  @IsNumber()
  @IsNotEmpty()
  invested_amount: number;

  @IsNumber()
  @IsOptional()
  interest?: number;

  @IsNumber()
  @IsNotEmpty()
  total_amount: number;

  @IsNumber()
  @IsNotEmpty()
  profit: number;

  @IsDateString()
  @IsNotEmpty()
  investment_date: Date;

  @IsDateString()
  @IsNotEmpty()
  due_date: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  status: string;
}
