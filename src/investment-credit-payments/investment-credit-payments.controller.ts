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
import { InvestmentCreditPaymentsService } from './investment-credit-payments.service';
import { CreateInvestmentCreditPaymentDto } from './dto/create-investment-credit-payment.dto';
import { UpdateInvestmentCreditPaymentDto } from './dto/update-investment-credit-payment.dto';
import { JwtAuthGuard } from '../login/jwt-auth.guard';

@Controller('investment-credit-payments')
@UseGuards(JwtAuthGuard)
export class InvestmentCreditPaymentsController {
  constructor(private readonly service: InvestmentCreditPaymentsService) {}

  @Post(':investmentId')
  create(
    @Param('investmentId', ParseIntPipe) investmentId: number,
    @Body() dto: CreateInvestmentCreditPaymentDto,
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
    @Body() dto: UpdateInvestmentCreditPaymentDto,
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
