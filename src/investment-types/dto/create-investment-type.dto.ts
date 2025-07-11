import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInvestmentTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
