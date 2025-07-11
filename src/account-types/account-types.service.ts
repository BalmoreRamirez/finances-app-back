import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountType } from './entities/account-type.entity';
import { CreateAccountTypeDto } from './dto/create-account-type.dto';
import { UpdateAccountTypeDto } from './dto/update-account-type.dto';

@Injectable()
export class AccountTypesService {
  constructor(
    @InjectRepository(AccountType)
    private readonly accountTypeRepository: Repository<AccountType>,
  ) {}

  create(createAccountTypeDto: CreateAccountTypeDto) {
    const accountType = this.accountTypeRepository.create(createAccountTypeDto);
    return this.accountTypeRepository.save(accountType);
  }

  findAll() {
    return this.accountTypeRepository.find();
  }

  findOne(id: number) {
    return this.accountTypeRepository.findOneBy({ id });
  }

  update(id: number, updateAccountTypeDto: UpdateAccountTypeDto) {
    return this.accountTypeRepository.update(id, updateAccountTypeDto);
  }

  remove(id: number) {
    return this.accountTypeRepository.delete(id);
  }
}

