import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../login/jwt-auth.guard';

@ApiTags('accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear cuenta',
    description: 'Crea una nueva cuenta financiera para el usuario autenticado'
  })
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Cuenta creada exitosamente'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Error en los datos proporcionados' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  create(@Request() req, @Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todas las cuentas',
    description: 'Retorna la lista de todas las cuentas financieras'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de cuentas obtenida exitosamente'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  findAll() {
    return this.accountsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener cuenta por ID',
    description: 'Retorna una cuenta específica por su ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la cuenta',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cuenta encontrada'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cuenta no encontrada' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar cuenta',
    description: 'Actualiza los datos de una cuenta existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la cuenta a actualizar',
    type: 'number'
  })
  @ApiBody({ type: UpdateAccountDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Cuenta actualizada exitosamente'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cuenta no encontrada' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar cuenta',
    description: 'Elimina una cuenta del sistema'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la cuenta a eliminar',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cuenta eliminada exitosamente'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cuenta no encontrada' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.remove(id);
  }
}
