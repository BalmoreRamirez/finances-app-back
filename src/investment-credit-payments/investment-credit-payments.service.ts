import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestmentCreditPayment } from './entities/investment-credit-payment.entity';
import { CreateInvestmentCreditPaymentDto } from './dto/create-investment-credit-payment.dto';
import { UpdateInvestmentCreditPaymentDto } from './dto/update-investment-credit-payment.dto';
import { Investment } from '../investments/entities/investment.entity';

@Injectable()
export class InvestmentCreditPaymentsService {
  constructor(
    @InjectRepository(InvestmentCreditPayment)
    private readonly paymentRepository: Repository<InvestmentCreditPayment>,
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
  ) {}

  private async findInvestmentOrFail(investmentId: number) {
    const investment = await this.investmentRepository.findOneBy({
      id: investmentId,
    });
    if (!investment) {
      throw new NotFoundException(
        `La inversión con ID ${investmentId} no existe.`,
      );
    }
    return investment;
  }

  async create(
    investmentId: number,
    dto: CreateInvestmentCreditPaymentDto,
  ): Promise<InvestmentCreditPayment> {
    await this.findInvestmentOrFail(investmentId);
    const payment = this.paymentRepository.create({
      ...dto,
      investment: { id: investmentId },
    });
    return this.paymentRepository.save(payment);
  }

  async findAllByInvestment(
    investmentId: number,
  ): Promise<InvestmentCreditPayment[]> {
    await this.findInvestmentOrFail(investmentId);
    return this.paymentRepository.find({
      where: { investment: { id: investmentId } },
    });
  }

  async findOne(
    investmentId: number,
    paymentId: number,
  ): Promise<InvestmentCreditPayment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId, investment: { id: investmentId } },
    });
    if (!payment) {
      throw new NotFoundException(
        `El pago con ID ${paymentId} no existe o no pertenece a la inversión con ID ${investmentId}.`,
      );
    }
    return payment;
  }

  async update(
    investmentId: number,
    paymentId: number,
    dto: UpdateInvestmentCreditPaymentDto,
  ) {
    const payment = await this.findOne(investmentId, paymentId);
    this.paymentRepository.merge(payment, dto);
    return this.paymentRepository.save(payment);
  }

  async remove(investmentId: number, paymentId: number) {
    const payment = await this.findOne(investmentId, paymentId);
    await this.paymentRepository.remove(payment);
    return {
      message: `El pago con ID ${paymentId} ha sido eliminado correctamente.`,
    };
  }
}
