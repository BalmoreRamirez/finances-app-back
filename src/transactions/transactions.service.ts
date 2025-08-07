import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Account } from '../accounts/entities/account.entity';
import { TransactionCategory } from '../transaction_categories/entities/transaction-category.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(TransactionCategory)
    private readonly categoryRepository: Repository<TransactionCategory>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userId: number) {
    // Validar y obtener la cuenta
    const account = await this.accountRepository.findOne({
      where: { id: createTransactionDto.account_id, user_id: userId },
    });

    if (!account) {
      throw new BadRequestException(
        `Cuenta con ID ${createTransactionDto.account_id} no encontrada o no pertenece al usuario`
      );
    }

    // Validar y obtener la categoría
    const category = await this.categoryRepository.findOne({
      where: { id: createTransactionDto.category_id },
    });

    if (!category) {
      throw new BadRequestException(
        `Categoría con ID ${createTransactionDto.category_id} no encontrada`
      );
    }

    const amount = Number(createTransactionDto.amount);
    const currentBalance = Number(account.balance);
    let newBalance: number;

    // Calcular el nuevo balance según el tipo de categoría
    if (category.type === 'egreso') {
      newBalance = currentBalance - amount;
    } else if (category.type === 'ingreso') {
      newBalance = currentBalance + amount;
    } else {
      throw new BadRequestException(
        `Tipo de categoría '${category.type}' no válido. Debe ser 'ingreso' o 'egreso'`
      );
    }

    // VALIDACIÓN CRÍTICA: Verificar que el balance nunca sea negativo
    if (newBalance < 0) {
      throw new BadRequestException(
        `No se puede procesar la transacción. El balance resultante sería negativo ($${newBalance.toFixed(2)}). ` +
        `Balance actual: $${currentBalance.toFixed(2)}, Monto de ${category.type}: $${amount.toFixed(2)}`
      );
    }

    // Actualizar el balance de la cuenta
    account.balance = newBalance;

    // Guardar la cuenta actualizada
    await this.accountRepository.save(account);

    // Crear y guardar la transacción
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      user_id: userId,
    });

    console.log(`✅ Transacción ${category.type} procesada exitosamente:
      - Cuenta: ${account.name} (ID: ${account.id})
      - Categoría: ${category.name} (${category.type})
      - Monto: $${amount.toFixed(2)}
      - Balance anterior: $${currentBalance.toFixed(2)}
      - Balance nuevo: $${newBalance.toFixed(2)}
      - Diferencia: ${category.type === 'ingreso' ? '+' : '-'}$${amount.toFixed(2)}`);

    return this.transactionRepository.save(transaction);
  }

  findAll() {
    return this.transactionRepository.find();
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }
    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.transactionRepository.preload({
      id,
      ...updateTransactionDto,
    });
    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }
    return this.transactionRepository.save(transaction);
  }

  async remove(id: number) {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }
    await this.transactionRepository.delete(id);
    return { message: 'Transacción eliminada correctamente' };
  }
}
