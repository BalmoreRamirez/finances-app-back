import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInvestmentTypeDto } from './dto/create-investment-type.dto';
import { UpdateInvestmentTypeDto } from './dto/update-investment-type.dto';
import { InvestmentType } from './entities/investment-type.entity';

@Injectable()
export class InvestmentTypesService {
  constructor(
    @InjectRepository(InvestmentType)
    private readonly investmentTypeRepository: Repository<InvestmentType>,
  ) {}

  create(createInvestmentTypeDto: CreateInvestmentTypeDto) {
    const investmentType = this.investmentTypeRepository.create(
      createInvestmentTypeDto,
    );
    return this.investmentTypeRepository.save(investmentType);
  }

  findAll() {
    return this.investmentTypeRepository.find();
  }

  async findOne(id: number) {
    const investmentType = await this.investmentTypeRepository.findOneBy({
      id,
    });
    if (!investmentType) {
      throw new NotFoundException(`InvestmentType with ID ${id} not found`);
    }
    return investmentType;
  }

  async update(id: number, updateInvestmentTypeDto: UpdateInvestmentTypeDto) {
    const investmentType = await this.findOne(id);
    this.investmentTypeRepository.merge(
      investmentType,
      updateInvestmentTypeDto,
    );
    return this.investmentTypeRepository.save(investmentType);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.investmentTypeRepository.delete(id);
  }
}
