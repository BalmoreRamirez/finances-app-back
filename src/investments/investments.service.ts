import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
  ) {}

  create(createInvestmentDto: CreateInvestmentDto, userId: number) {
    const investment = this.investmentRepository.create({
      ...createInvestmentDto,
      user_id: userId,
    });
    return this.investmentRepository.save(investment);
  }

  findAll() {
    return this.investmentRepository.find({
      relations: ['user', 'account', 'investment_type'],
    });
  }

  findOne(id: number) {
    return this.investmentRepository.findOne({
      where: { id },
      relations: ['user', 'account', 'investment_type'],
    });
  }

  async update(id: number, updateInvestmentDto: UpdateInvestmentDto) {
    await this.investmentRepository.update(id, updateInvestmentDto);
    return this.investmentRepository.findOne({
      where: { id },
      relations: ['user', 'account', 'investment_type'],
    });
  }

  remove(id: number) {
    return this.investmentRepository.delete(id);
  }
}
