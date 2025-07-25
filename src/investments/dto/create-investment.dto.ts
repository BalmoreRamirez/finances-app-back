import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  IsDateString,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateInvestmentDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  investment_type_id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  principal: number;

  @IsNumber()
  @IsOptional()
  expected_return?: number;

  @IsInt()
  @IsNotEmpty()
  account_id: number;

  @IsDateString()
  @IsNotEmpty()
  start_date: Date;

  @IsDateString()
  @IsOptional()
  end_date?: Date;

  @IsString()
  @IsNotEmpty()
  @IsIn(['activa', 'finalizada', 'cancelada'])
  status: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
