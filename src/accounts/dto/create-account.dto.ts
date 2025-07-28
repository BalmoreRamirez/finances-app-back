import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateAccountDto {
  @IsInt()
  @IsNotEmpty()
  account_type_id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  currency?: string;

  @IsNumber()
  @IsOptional()
  balance?: number;
}
