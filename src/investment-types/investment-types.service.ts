import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { InvestmentType } from './entities/investment-type.entity';
import { CreateInvestmentTypeDto } from './dto/create-investment-type.dto';
import { UpdateInvestmentTypeDto } from './dto/update-investment-type.dto';

@Injectable()
export class InvestmentTypesService {
  constructor(
    @InjectRepository(InvestmentType)
    private readonly investmentTypeRepository: Repository<InvestmentType>,
  ) {}

  async create(createInvestmentTypeDto: CreateInvestmentTypeDto) {
    // Verificar si ya existe un tipo de inversión con el mismo nombre
    const existingInvestmentType = await this.investmentTypeRepository.findOne({
      where: { name: createInvestmentTypeDto.name },
    });

    if (existingInvestmentType) {
      throw new ConflictException('El nombre del tipo de inversión ya existe');
    }

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
      throw new NotFoundException(
        `Tipo de inversión con ID ${id} no encontrado`,
      );
    }

    return investmentType;
  }

  async update(id: number, updateInvestmentTypeDto: UpdateInvestmentTypeDto) {
    // Verificar que el tipo de inversión existe
    const investmentType = await this.investmentTypeRepository.findOneBy({
      id,
    });
    if (!investmentType) {
      throw new NotFoundException(
        `Tipo de inversión con ID ${id} no encontrado`,
      );
    }

    // Verificar nombre duplicado si se está actualizando el nombre
    if (updateInvestmentTypeDto.name) {
      const existingInvestmentType =
        await this.investmentTypeRepository.findOne({
          where: {
            name: updateInvestmentTypeDto.name,
            id: Not(id),
          },
        });

      if (existingInvestmentType) {
        throw new ConflictException(
          'El nombre del tipo de inversión ya existe',
        );
      }
    }

    await this.investmentTypeRepository.update(id, updateInvestmentTypeDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const investmentType = await this.investmentTypeRepository.findOneBy({
      id,
    });

    if (!investmentType) {
      throw new NotFoundException(
        `Tipo de inversión con ID ${id} no encontrado`,
      );
    }

    // Verificar si el tipo de inversión está siendo utilizado
    const hasInvestments = await this.investmentTypeRepository
      .createQueryBuilder('investment_type')
      .leftJoin(
        'investments',
        'investment',
        'investment.investment_type_id = investment_type.id',
      )
      .where('investment_type.id = :id', { id })
      .andWhere('investment.id IS NOT NULL')
      .getCount();

    if (hasInvestments > 0) {
      throw new ConflictException(
        'No se puede eliminar el tipo de inversión porque tiene inversiones asociadas',
      );
    }

    return this.investmentTypeRepository.delete(id);
  }
}
