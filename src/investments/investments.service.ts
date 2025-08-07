import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './entities/investment.entity';
import { Account } from '../accounts/entities/account.entity';
import { InvestmentType } from '../investment-types/entities/investment-type.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(InvestmentType)
    private readonly investmentTypeRepository: Repository<InvestmentType>,
  ) { }

  /**
   * Crea una nueva inversión y realiza los movimientos contables correspondientes.
   */
  async create(createInvestmentDto: CreateInvestmentDto, userId: number) {
    await this.validateAccount(createInvestmentDto.account_id, userId);
    await this.validateInvestmentType(createInvestmentDto.investment_type_id);

    // Obtener la cuenta de Capital inicial (ID: 5)
    const capitalInicialAccount = await this.accountRepository.findOne({
      where: { id: 5, user_id: userId },
    });

    if (!capitalInicialAccount) {
      throw new BadRequestException(
        'No se encontró la cuenta de Capital inicial'
      );
    }

    // Verificar fondos en Capital inicial
    if (
      (Number(capitalInicialAccount.balance) ?? 0) < Number(createInvestmentDto.principal)
    ) {
      throw new BadRequestException(
        'El Capital inicial no tiene fondos suficientes para realizar la inversión'
      );
    }

    // Realizar movimientos contables según el tipo de inversión
    await this.processInvestmentCreation(createInvestmentDto, userId, capitalInicialAccount);

    // Crear la inversión
    const investment = this.investmentRepository.create({
      ...createInvestmentDto,
      user_id: userId,
    });
    return this.investmentRepository.save(investment);
  }

  /**
   * Retorna todas las inversiones con sus relaciones.
   */
  findAll() {
    return this.investmentRepository.find({
      relations: ['user', 'account', 'investment_type'],
    });
  }

  /**
   * Busca una inversión por ID.
   */
  async findOne(id: number) {
    const investment = await this.investmentRepository.findOne({
      where: { id },
      relations: ['user', 'account', 'investment_type'],
    });

    if (!investment) {
      throw new NotFoundException(`Inversión con ID ${id} no encontrada`);
    }

    return investment;
  }

  /**
   * Actualiza una inversión existente y maneja cambios de estado.
   */
  async update(id: number, updateInvestmentDto: UpdateInvestmentDto) {
    console.log('Actualizando inversión con ID:', id);
    const existingInvestment = await this.investmentRepository.findOneBy({
      id,
    });
    if (!existingInvestment) {
      throw new NotFoundException(`Inversión con ID ${id} no encontrada`);
    }

    // Validar cuenta si se actualiza
    const accountId =
      updateInvestmentDto.account_id ?? existingInvestment.account_id;
    await this.validateAccount(accountId, existingInvestment.user_id);

    // Validar tipo de inversión si se actualiza
    const investmentTypeId =
      updateInvestmentDto.investment_type_id ??
      existingInvestment.investment_type_id;
    await this.validateInvestmentType(investmentTypeId);

    // Verificar si hay cambio de estado a "finalizada"
    if (updateInvestmentDto.status === 'finalizada' && existingInvestment.status !== 'finalizada') {
      await this.processInvestmentCompletion(existingInvestment);
    }

    await this.investmentRepository.update(id, updateInvestmentDto);
    return this.findOne(id);
  }

  /**
   * Elimina una inversión por ID.
   */
  async remove(id: number): Promise<{ message: string }> {
    await this.findInvestmentById(id);
    try {
      const result = await this.investmentRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Inversión con ID ${id} no encontrada`);
      }
      return { message: `Inversión con ID ${id} eliminada correctamente` };
    } catch (error) {
      this.handleDeleteError(error);
    }
  }

  // Métodos privados reutilizables

  private async findInvestmentById(id: number): Promise<Investment> {
    const investment = await this.investmentRepository.findOneBy({ id });
    if (!investment) {
      throw new NotFoundException(`Inversión con ID ${id} no encontrada`);
    }
    return investment;
  }

  private async validateAccount(accountId: number, userId: number) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId, user_id: userId },
    });
    if (!account) {
      throw new BadRequestException(
        `Cuenta con ID ${accountId} no encontrada o no pertenece al usuario`,
      );
    }
  }

  private async validateInvestmentType(investmentTypeId: number) {
    const investmentType = await this.investmentTypeRepository.findOneBy({
      id: investmentTypeId,
    });
    if (!investmentType) {
      throw new BadRequestException(
        `Tipo de inversión con ID ${investmentTypeId} no existe`,
      );
    }
  }

  private handleDeleteError(error: any): never {
    if (error.code === '23503') {
      if (error.constraint?.includes('accounts')) {
        throw new ConflictException(
          'No se puede eliminar la inversión porque tiene cuentas asociadas',
        );
      }
      throw new ConflictException(
        'No se puede eliminar la inversión porque está siendo utilizada por otros registros',
      );
    }
    throw new BadRequestException('Error al eliminar la inversión');
  }

  /**
   * Procesa los movimientos contables al crear una inversión.
   */
  private async processInvestmentCreation(
    createInvestmentDto: CreateInvestmentDto,
    userId: number,
    capitalInicialAccount: Account
  ) {
    const principal = Number(createInvestmentDto.principal);

    // Descontar del Capital inicial
    capitalInicialAccount.balance = Number(capitalInicialAccount.balance) - principal;
    await this.accountRepository.save(capitalInicialAccount);

    if (createInvestmentDto.investment_type_id === 1) {
      // Tipo Crédito: Sumar a "Entrega de préstamo" (ID: 9)
      const entregaPrestamoAccount = await this.accountRepository.findOne({
        where: { id: 9, user_id: userId },
      });

      if (!entregaPrestamoAccount) {
        throw new BadRequestException('No se encontró la cuenta de Entrega de préstamo');
      }

      entregaPrestamoAccount.balance = Number(entregaPrestamoAccount.balance) + principal;
      await this.accountRepository.save(entregaPrestamoAccount);

    } else if (createInvestmentDto.investment_type_id === 2) {
      // Tipo Compra: Sumar a "Compra de activos" (ID: 8)
      const compraActivosAccount = await this.accountRepository.findOne({
        where: { id: 8, user_id: userId },
      });

      if (!compraActivosAccount) {
        throw new BadRequestException('No se encontró la cuenta de Compra de activos');
      }

      compraActivosAccount.balance = Number(compraActivosAccount.balance) + principal;
      await this.accountRepository.save(compraActivosAccount);
    }
  }

  /**
   * Procesa los movimientos contables al finalizar una inversión.
   */
  private async processInvestmentCompletion(investment: Investment) {
    const userId = investment.user_id;
    const principal = Number(investment.principal);
    const expectedReturn = Number(investment.expected_return);
    // La ganancia es simplemente el expected_return (que representa la ganancia neta)
    const ganancia = expectedReturn;

    // Obtener la cuenta de Capital inicial
    const capitalInicialAccount = await this.accountRepository.findOne({
      where: { id: 5, user_id: userId },
    });

    if (!capitalInicialAccount) {
      throw new BadRequestException('No se encontró la cuenta de Capital inicial');
    }

    // Retornar el capital principal al Capital inicial
    capitalInicialAccount.balance = Number(capitalInicialAccount.balance) + principal;
    await this.accountRepository.save(capitalInicialAccount);

    if (investment.investment_type_id === 1) {
      // Tipo Crédito: Restar de "Entrega de préstamo" y agregar ganancia a "Ingreso por interés"
      const entregaPrestamoAccount = await this.accountRepository.findOne({
        where: { id: 9, user_id: userId },
      });

      if (!entregaPrestamoAccount) {
        throw new BadRequestException('No se encontró la cuenta de Entrega de préstamo');
      }

      // Restar el capital de Entrega de préstamo
      entregaPrestamoAccount.balance = Number(entregaPrestamoAccount.balance) - principal;
      await this.accountRepository.save(entregaPrestamoAccount);

      // Agregar ganancia a Ingreso por interés (si hay ganancia)
      if (ganancia > 0) {
        const ingresoInteresAccount = await this.accountRepository.findOne({
          where: { id: 6, user_id: userId },
        });

        if (!ingresoInteresAccount) {
          throw new BadRequestException('No se encontró la cuenta de Ingreso por interés');
        }

        ingresoInteresAccount.balance = Number(ingresoInteresAccount.balance) + ganancia;
        await this.accountRepository.save(ingresoInteresAccount);

        console.log(`Ganancia de ${ganancia} registrada en Ingreso por interés`);
      } else {
        console.log('No hay ganancia positiva para registrar');
      }

    } else if (investment.investment_type_id === 2) {
      // Tipo Compra: Restar de "Compra de activos" y agregar ganancia a "Ingreso por venta"
      const compraActivosAccount = await this.accountRepository.findOne({
        where: { id: 8, user_id: userId },
      });

      if (!compraActivosAccount) {
        throw new BadRequestException('No se encontró la cuenta de Compra de activos');
      }

      // Restar el capital de Compra de activos
      compraActivosAccount.balance = Number(compraActivosAccount.balance) - principal;
      await this.accountRepository.save(compraActivosAccount);

      // Agregar ganancia a Ingreso por venta (si hay ganancia)
      if (ganancia > 0) {
        const ingresoVentaAccount = await this.accountRepository.findOne({
          where: { id: 7, user_id: userId },
        });

        if (!ingresoVentaAccount) {
          throw new BadRequestException('No se encontró la cuenta de Ingreso por venta');
        }

        ingresoVentaAccount.balance = Number(ingresoVentaAccount.balance) + ganancia;
        await this.accountRepository.save(ingresoVentaAccount);

        console.log(`Ganancia de ${ganancia} registrada en Ingreso por venta`);
      } else {
        console.log('No hay ganancia positiva para registrar');
      }
    }
  }
}
