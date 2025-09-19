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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInvestmentDto {
  @ApiProperty({
    description: 'ID del tipo de inversión',
    example: 1
  })
  @IsInt()
  @IsNotEmpty()
  investment_type_id: number;

  @ApiProperty({
    description: 'Nombre de la inversión',
    example: 'Préstamo a Juan',
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Monto principal de la inversión',
    example: 10000.00
  })
  @IsNumber()
  @IsNotEmpty()
  principal: number;

  @ApiPropertyOptional({
    description: 'Retorno esperado de la inversión',
    example: 1200.00,
    default: 0
  })
  @IsNumber()
  @IsOptional()
  expected_return?: number;

  @ApiProperty({
    description: 'ID de la cuenta asociada',
    example: 1
  })
  @IsInt()
  @IsNotEmpty()
  account_id: number;

  @ApiProperty({
    description: 'Fecha de inicio de la inversión',
    example: '2025-01-01',
    format: 'date'
  })
  @IsDateString()
  @IsNotEmpty()
  start_date: Date;

  @ApiPropertyOptional({
    description: 'Fecha de finalización de la inversión',
    example: '2025-12-31',
    format: 'date'
  })
  @IsDateString()
  @IsOptional()
  end_date?: Date;

  @ApiProperty({
    description: 'Estado de la inversión',
    example: 'activa',
    enum: ['activa', 'finalizada', 'cancelada']
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['activa', 'finalizada', 'cancelada'])
  status: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la inversión',
    example: 'Inversión a corto plazo con interés mensual'
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
