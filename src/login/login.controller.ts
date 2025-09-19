import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve un token JWT'
  })
  @ApiBody({ 
    type: LoginDto,
    description: 'Credenciales de usuario'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'Token JWT para autenticación'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Credenciales inválidas' 
  })
  async login(@Body() loginDto: LoginDto) {
    return this.loginService.login(loginDto);
  }
}
