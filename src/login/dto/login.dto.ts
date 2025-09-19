import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'admin@example.com'
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'admin123'
  })
  @IsString()
  password: string;
}
