import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { InvestmentTypesService } from './investment-types.service';
import { CreateInvestmentTypeDto } from './dto/create-investment-type.dto';
import { UpdateInvestmentTypeDto } from './dto/update-investment-type.dto';
import { JwtAuthGuard } from '../login/jwt-auth.guard';

@Controller('investment-types')
export class InvestmentTypesController {
  constructor(
    private readonly investmentTypesService: InvestmentTypesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createInvestmentTypeDto: CreateInvestmentTypeDto) {
    return this.investmentTypesService.create(createInvestmentTypeDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.investmentTypesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.investmentTypesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvestmentTypeDto: UpdateInvestmentTypeDto,
  ) {
    return this.investmentTypesService.update(+id, updateInvestmentTypeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.investmentTypesService.remove(+id);
  }
}
