import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { AccountType } from './entities/account-type.entity';
import { CreateAccountTypeDto } from './dto/create-account-type.dto';
import { UpdateAccountTypeDto } from './dto/update-account-type.dto';

@Injectable()
export class AccountTypesService {
  constructor(
    @InjectRepository(AccountType)
    private readonly accountTypeRepository: Repository<AccountType>,
  ) {}

  async create(createAccountTypeDto: CreateAccountTypeDto) {
    const existingAccountType = await this.accountTypeRepository.findOne({
      where: { name: createAccountTypeDto.name },
    });

    if (existingAccountType) {
      throw new ConflictException('El nombre del tipo de cuenta ya existe');
    }

    return this.accountTypeRepository.save(createAccountTypeDto);
  }

  findAll() {
    return this.accountTypeRepository.find();
  }

  async findOne(id: number) {
    const accountType = await this.accountTypeRepository.findOneBy({ id });
    if (!accountType) {
      throw new NotFoundException(`Tipo de cuenta con ID ${id} no encontrado`);
    }

    return accountType;
  }

  async update(id: number, updateAccountTypeDto: UpdateAccountTypeDto) {
    if (updateAccountTypeDto.name) {
      const existingAccountType = await this.accountTypeRepository.findOne({
        where: {
          name: updateAccountTypeDto.name,
          id: Not(id),
        },
      });

      if (existingAccountType) {
        throw new ConflictException('El nombre del tipo de cuenta ya existe');
      }
    }

    await this.accountTypeRepository.update(id, updateAccountTypeDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const accountType = await this.accountTypeRepository.findOneBy({ id });

    if (!accountType) {
      throw new NotFoundException(`Tipo de cuenta con ID ${id} no encontrado`);
    }

    return this.accountTypeRepository.delete(id);
  }
}
