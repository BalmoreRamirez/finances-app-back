import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../login/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear usuario',
    description: 'Registra un nuevo usuario en el sistema'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Error en los datos proporcionados' 
  })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      const userWithHashedPassword = {
        ...createUserDto,
        password: hashedPassword,
      };
      return await this.usersService.create(userWithHashedPassword);
    } catch (error) {
      return {
        message:
          'Error al crear el usuario. Verifica los datos enviados o revisa el servidor.',
        error: error.message || error,
      };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener todos los usuarios',
    description: 'Retorna la lista de todos los usuarios registrados'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios obtenida exitosamente'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener usuario por ID',
    description: 'Retorna un usuario específico por su ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del usuario',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario encontrado'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Actualizar usuario',
    description: 'Actualiza los datos de un usuario existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del usuario a actualizar',
    type: 'number'
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario actualizado exitosamente'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Eliminar usuario',
    description: 'Elimina un usuario del sistema'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del usuario a eliminar',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario eliminado exitosamente'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
