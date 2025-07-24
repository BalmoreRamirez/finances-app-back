import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { AccountType } from '../account-types/entities/account-type.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(AccountType)
    private readonly accountTypeRepository: Repository<AccountType>,
  ) {}

  async create(createAccountDto: CreateAccountDto, userId: number) {
    await this.validateAccountType(createAccountDto.account_type_id);
    await this.validateUniqueAccountName(createAccountDto.account_name, userId);

    const account = this.accountRepository.create({
      ...createAccountDto,
      user_id: userId,
    });

    return this.accountRepository.save(account);
  }

  async findAll(): Promise<Account[]> {
    return this.accountRepository.find({
      relations: ['account_type'],
    });
  }

  async findOne(id: number) {
    const account = await this.accountRepository.findOne({
      where: { id },
      relations: ['account_type'],
    });

    if (!account) {
      throw new NotFoundException(`Cuenta con ID ${id} no encontrada`);
    }

    return account;
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    const account = await this.findAccountById(id);

    if (updateAccountDto.account_type_id) {
      await this.validateAccountType(updateAccountDto.account_type_id);
    }

    if (updateAccountDto.account_name) {
      await this.validateUniqueAccountNameForUpdate(
        updateAccountDto.account_name,
        account.user_id,
        id,
      );
    }

    await this.accountRepository.update(id, updateAccountDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findAccountById(id);
    try {
      const result = await this.accountRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Cuenta con ID ${id} no encontrada`);
      }
      return { message: `Cuenta con ID ${id} eliminada correctamente` };
    } catch (error) {
      this.handleDeleteError(error);
    }
  }

  // Métodos privados para reutilización de código
  private async findAccountById(id: number): Promise<Account> {
    const account = await this.accountRepository.findOneBy({ id });
    if (!account) {
      throw new NotFoundException(`Cuenta con ID ${id} no encontrada`);
    }
    return account;
  }

  private async validateAccountType(accountTypeId: number): Promise<void> {
    const accountTypeExists = await this.accountTypeRepository.findOne({
      where: { id: accountTypeId },
    });

    if (!accountTypeExists) {
      throw new BadRequestException(
        `Tipo de cuenta con ID ${accountTypeId} no existe`,
      );
    }
  }

  private async validateUniqueAccountName(
    accountName: string,
    userId: number,
  ): Promise<void> {
    const existingAccount = await this.accountRepository.findOne({
      where: {
        account_name: accountName,
        user_id: userId,
      },
    });

    if (existingAccount) {
      throw new ConflictException('El nombre de la cuenta ya existe');
    }
  }

  private async validateUniqueAccountNameForUpdate(
    accountName: string,
    userId: number,
    excludeId: number,
  ): Promise<void> {
    const existingAccount = await this.accountRepository.findOne({
      where: {
        account_name: accountName,
        user_id: userId,
        id: Not(excludeId),
      },
    });

    if (existingAccount) {
      throw new ConflictException('El nombre de la cuenta ya existe');
    }
  }

  private handleDeleteError(error: any): never {
    if (error.code === '23503') {
      if (error.constraint && error.constraint.includes('investments')) {
        throw new ConflictException(
          'No se puede eliminar la cuenta porque tiene inversiones asociadas',
        );
      }

      if (error.constraint && error.constraint.includes('transactions')) {
        throw new ConflictException(
          'No se puede eliminar la cuenta porque tiene transacciones asociadas',
        );
      }

      throw new ConflictException(
        'No se puede eliminar la cuenta porque está siendo utilizada por otros registros',
      );
    }

    throw new BadRequestException('Error al eliminar la cuenta');
  }
}
