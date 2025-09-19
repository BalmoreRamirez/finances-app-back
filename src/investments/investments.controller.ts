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
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { JwtAuthGuard } from '../login/jwt-auth.guard';

@ApiTags('investments')
@Controller('investments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear inversión',
    description: 'Registra una nueva inversión para el usuario autenticado'
  })
  @ApiBody({ type: CreateInvestmentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Inversión creada exitosamente'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Error en los datos proporcionados' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  create(@Request() req, @Body() createInvestmentDto: CreateInvestmentDto) {
    return this.investmentsService.create(createInvestmentDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todas las inversiones',
    description: 'Retorna la lista de todas las inversiones registradas'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de inversiones obtenida exitosamente'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  findAll() {
    return this.investmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener inversión por ID',
    description: 'Retorna una inversión específica por su ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la inversión',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Inversión encontrada'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Inversión no encontrada' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.investmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar inversión',
    description: 'Actualiza los datos de una inversión existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la inversión a actualizar',
    type: 'number'
  })
  @ApiBody({ type: UpdateInvestmentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Inversión actualizada exitosamente'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Inversión no encontrada' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvestmentDto: UpdateInvestmentDto,
  ) {
    return this.investmentsService.update(id, updateInvestmentDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar inversión',
    description: 'Elimina una inversión del sistema'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la inversión a eliminar',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Inversión eliminada exitosamente'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Inversión no encontrada' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.investmentsService.remove(id);
  }
}
