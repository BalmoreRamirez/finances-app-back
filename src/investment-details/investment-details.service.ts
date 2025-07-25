import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestmentDetails } from './entities/investment-details.entity';
import { CreateInvestmentDetailsDto } from './dto/create-investment-details.dto';
import { UpdateInvestmentDetailsDto } from './dto/update-investment-details.dto';
import { Investment } from '../investments/entities/investment.entity';

@Injectable()
export class InvestmentDetailsService {
  constructor(
    @InjectRepository(InvestmentDetails)
    private readonly paymentRepository: Repository<InvestmentDetails>,
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
    dto: CreateInvestmentDetailsDto,
  ): Promise<InvestmentDetails> {
    await this.findInvestmentOrFail(investmentId);
    const payment = this.paymentRepository.create({
      ...dto,
      investment: { id: investmentId },
    });
    return this.paymentRepository.save(payment);
  }

  async findAllByInvestment(
    investmentId: number,
  ): Promise<InvestmentDetails[]> {
    await this.findInvestmentOrFail(investmentId);
    return this.paymentRepository.find({
      where: { investment: { id: investmentId } },
    });
  }

  async findOne(
    investmentId: number,
    paymentId: number,
  ): Promise<InvestmentDetails> {
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
    dto: UpdateInvestmentDetailsDto,
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
