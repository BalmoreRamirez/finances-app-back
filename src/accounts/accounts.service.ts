import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  create(createAccountDto: CreateAccountDto, userId: number) {
    const account = this.accountRepository.create({
      ...createAccountDto,
      user_id: userId,
    });
    return this.accountRepository.save(account);
  }

  findAll() {
    return this.accountRepository.find({ relations: ['account_type'] });
  }

  findOne(id: number) {
    return this.accountRepository.findOne({
      where: { id },
      relations: ['account_type'],
    });
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return this.accountRepository.update(id, updateAccountDto);
  }

  remove(id: number) {
    return this.accountRepository.delete(id);
  }
}
