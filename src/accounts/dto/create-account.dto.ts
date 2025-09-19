import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({
    description: 'ID del tipo de cuenta',
    example: 1
  })
  @IsInt()
  @IsNotEmpty()
  account_type_id: number;

  @ApiProperty({
    description: 'Nombre de la cuenta',
    example: 'Cuenta de Ahorros Principal',
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Moneda de la cuenta',
    example: 'USD',
    default: 'USD',
    maxLength: 10
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({
    description: 'Balance inicial de la cuenta',
    example: 1000.00,
    default: 0
  })
  @IsNumber()
  @IsOptional()
  balance?: number;

  @ApiPropertyOptional({
    description: 'Descripción de la cuenta',
    example: 'Cuenta principal para gastos diarios',
    maxLength: 255
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;
}
