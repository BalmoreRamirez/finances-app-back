import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { TransactionCategory } from './entities/transaction_category.entity';
import { CreateTransactionCategoryDto } from './dto/create-transaction_category.dto';
import { UpdateTransactionCategoryDto } from './dto/update-transaction_category.dto';

@Injectable()
export class TransactionCategoriesService {
  constructor(
    @InjectRepository(TransactionCategory)
    private readonly categoryRepository: Repository<TransactionCategory>,
  ) {}

  async create(createDto: CreateTransactionCategoryDto) {
    const exists = await this.categoryRepository.findOne({
      where: { name: createDto.name },
    });
    if (exists) {
      throw new ConflictException('El nombre de la categoría ya existe');
    }
    const category = this.categoryRepository.create(createDto);
    return this.categoryRepository.save(category);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return category;
  }

  async update(id: number, updateDto: UpdateTransactionCategoryDto) {
    if (updateDto.name) {
      const exists = await this.categoryRepository.findOne({
        where: { name: updateDto.name, id: Not(id) },
      });
      if (exists) {
        throw new ConflictException('El nombre de la categoría ya existe');
      }
    }
    await this.categoryRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    await this.categoryRepository.delete(id);
    return { message: 'Categoría eliminada correctamente' };
  }
}
