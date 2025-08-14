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
  ) {
  }


  async create(createTransactionDto: CreateTransactionDto, userId: number) {
    // Validar y obtener la cuenta
    const account = await this.accountRepository.findOne({
      where: { id: createTransactionDto.account_id, user_id: userId },
    });

    if (!account) {
      throw new BadRequestException(
        `Cuenta con ID ${createTransactionDto.account_id} no encontrada o no pertenece al usuario`,
      );
    }

    // Validar y obtener la categoría
    const category = await this.categoryRepository.findOne({
      where: { id: createTransactionDto.category_id },
    });

    if (!category) {
      throw new BadRequestException(
        `Categoría con ID ${createTransactionDto.category_id} no encontrada`,
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
        `Tipo de categoría '${category.type}' no válido. Debe ser 'ingreso' o 'egreso'`,
      );
    }

    // VALIDACIÓN CRÍTICA: Verificar que el balance nunca sea negativo
    if (newBalance < 0) {
      throw new BadRequestException(
        `No se puede procesar la transacción. El balance resultante sería negativo ($${newBalance.toFixed(2)}). ` +
        `Balance actual: $${currentBalance.toFixed(2)}, Monto de ${category.type}: $${amount.toFixed(2)}`,
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

  async update(id: number, updateTransactionDto: UpdateTransactionDto, userId: number) {
    // Obtener la transacción existente con sus relaciones
    const existingTransaction = await this.transactionRepository.findOne({
      where: { id, user_id: userId },
      relations: ['account', 'category'],
    });

    if (!existingTransaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada o no pertenece al usuario`);
    }

    // Obtener la cuenta original
    const originalAccount = existingTransaction.account;
    const originalCategory = existingTransaction.category;
    const originalAmount = Number(existingTransaction.amount);

    // Revertir el monto original de la cuenta
    let revertedBalance = Number(originalAccount.balance);
    if (originalCategory.type === 'egreso') {
      // Si era un egreso, devolvemos el dinero a la cuenta
      revertedBalance += originalAmount;
    } else if (originalCategory.type === 'ingreso') {
      // Si era un ingreso, quitamos el dinero de la cuenta
      revertedBalance -= originalAmount;
    }

    // Actualizar el balance de la cuenta original
    originalAccount.balance = revertedBalance;
    await this.accountRepository.save(originalAccount);

    console.log(`🔄 Revertido monto original: 
      - Transacción ID: ${id}
      - Monto revertido: $${originalAmount.toFixed(2)}
      - Tipo: ${originalCategory.type}
      - Balance después de reversión: $${revertedBalance.toFixed(2)}`);

    // Si hay cambios en los datos, aplicar la nueva transacción
    if (Object.keys(updateTransactionDto).length > 0) {
      // Validar nueva cuenta si cambió
      let newAccount = originalAccount;
      if (updateTransactionDto.account_id && updateTransactionDto.account_id !== originalAccount.id) {
        newAccount = await this.accountRepository.findOne({
          where: { id: updateTransactionDto.account_id, user_id: userId },
        });
        if (!newAccount) {
          throw new BadRequestException(
            `Nueva cuenta con ID ${updateTransactionDto.account_id} no encontrada o no pertenece al usuario`,
          );
        }
      }

      // Validar nueva categoría si cambió
      let newCategory = originalCategory;
      if (updateTransactionDto.category_id && updateTransactionDto.category_id !== originalCategory.id) {
        newCategory = await this.categoryRepository.findOne({
          where: { id: updateTransactionDto.category_id },
        });
        if (!newCategory) {
          throw new BadRequestException(
            `Nueva categoría con ID ${updateTransactionDto.category_id} no encontrada`,
          );
        }
      }

      // Usar el nuevo monto o el original si no cambió
      const newAmount = updateTransactionDto.amount ? Number(updateTransactionDto.amount) : originalAmount;
      let finalBalance = Number(newAccount.balance);

      // Aplicar el nuevo monto
      if (newCategory.type === 'egreso') {
        finalBalance -= newAmount;
      } else if (newCategory.type === 'ingreso') {
        finalBalance += newAmount;
      }

      // Validar que el balance no sea negativo
      if (finalBalance < 0) {
        throw new BadRequestException(
          `No se puede actualizar la transacción. El balance resultante sería negativo ($${finalBalance.toFixed(2)}).`,
        );
      }

      // Actualizar el balance de la nueva cuenta
      newAccount.balance = finalBalance;
      await this.accountRepository.save(newAccount);

      console.log(`✅ Aplicado nuevo monto:
        - Nueva cuenta: ${newAccount.name} (ID: ${newAccount.id})
        - Nueva categoría: ${newCategory.name} (${newCategory.type})
        - Nuevo monto: $${newAmount.toFixed(2)}
        - Balance final: $${finalBalance.toFixed(2)}`);
    }

    // Actualizar la transacción
    const updatedTransaction = await this.transactionRepository.preload({
      id,
      ...updateTransactionDto,
    });

    return this.transactionRepository.save(updatedTransaction);
  }

  async remove(id: number, userId: number) {
    // Obtener la transacción con sus relaciones
    const transaction = await this.transactionRepository.findOne({
      where: { id, user_id: userId },
      relations: ['account', 'category'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada o no pertenece al usuario`);
    }

    const account = transaction.account;
    const category = transaction.category;
    const amount = Number(transaction.amount);
    const currentBalance = Number(account.balance);
    let newBalance: number;

    // Revertir el monto a la cuenta
    if (category.type === 'egreso') {
      // Si era un egreso, devolvemos el dinero a la cuenta
      newBalance = currentBalance + amount;
    } else if (category.type === 'ingreso') {
      // Si era un ingreso, quitamos el dinero de la cuenta
      newBalance = currentBalance - amount;
    } else {
      newBalance = currentBalance;
    }

    // Validar que el balance no sea negativo después de la reversión
    if (newBalance < 0) {
      throw new BadRequestException(
        `No se puede eliminar la transacción. El balance resultante sería negativo ($${newBalance.toFixed(2)}).`,
      );
    }

    // Actualizar el balance de la cuenta
    account.balance = newBalance;
    await this.accountRepository.save(account);

    // Eliminar la transacción
    await this.transactionRepository.delete(id);

    console.log(`🗑️ Transacción eliminada y monto revertido:
      - Cuenta: ${account.name} (ID: ${account.id})
      - Monto revertido: $${amount.toFixed(2)}
      - Tipo: ${category.type}
      - Balance anterior: $${currentBalance.toFixed(2)}
      - Balance nuevo: $${newBalance.toFixed(2)}`);

    return { message: 'Transacción eliminada correctamente y monto revertido a la cuenta' };
  }
}
