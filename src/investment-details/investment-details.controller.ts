import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { InvestmentDetailsService } from './investment-details.service';
import { JwtAuthGuard } from '../login/jwt-auth.guard';
import { CreateInvestmentDetailsDto } from './dto/create-investment-details.dto';
import { UpdateInvestmentDetailsDto } from './dto/update-investment-details.dto';

@Controller('investment-credit-payments')
@UseGuards(JwtAuthGuard)
export class InvestmentDetailsController {
  constructor(private readonly service: InvestmentDetailsService) {}

  @Post(':investmentId')
  create(
    @Param('investmentId', ParseIntPipe) investmentId: number,
    @Body() dto: CreateInvestmentDetailsDto,
  ) {
    return this.service.create(investmentId, dto);
  }

  @Get(':investmentId')
  findAllByInvestment(
    @Param('investmentId', ParseIntPipe) investmentId: number,
  ) {
    return this.service.findAllByInvestment(investmentId);
  }

  @Get(':investmentId/:paymentId')
  findOne(
    @Param('investmentId', ParseIntPipe) investmentId: number,
    @Param('paymentId', ParseIntPipe) paymentId: number,
  ) {
    return this.service.findOne(investmentId, paymentId);
  }

  @Patch(':investmentId/:paymentId')
  update(
    @Param('investmentId', ParseIntPipe) investmentId: number,
    @Param('paymentId', ParseIntPipe) paymentId: number,
    @Body() dto: UpdateInvestmentDetailsDto,
  ) {
    return this.service.update(investmentId, paymentId, dto);
  }

  @Delete(':investmentId/:paymentId')
  remove(
    @Param('investmentId', ParseIntPipe) investmentId: number,
    @Param('paymentId', ParseIntPipe) paymentId: number,
  ) {
    return this.service.remove(investmentId, paymentId);
  }
}
