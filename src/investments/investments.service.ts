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
  ) {}

  /**
   * Crea una nueva inversión y descuenta el principal de la cuenta.
   */
  async create(createInvestmentDto: CreateInvestmentDto, userId: number) {
    await this.validateAccount(createInvestmentDto.account_id, userId);
    await this.validateInvestmentType(createInvestmentDto.investment_type_id);

    const cuentaDestinoCredito = await this.accountRepository.findOne({
      where: { id: 3 },
    });
    // Obtener la cuenta y verificar fondos
    const account = await this.accountRepository.findOne({
      where: { id: createInvestmentDto.account_id, user_id: userId },
    });

    if (!account) {
      throw new BadRequestException(
        `Cuenta con ID ${createInvestmentDto.account_id} no encontrada o no pertenece al usuario`,
      );
    }

    if (
      (Number(account.balance) ?? 0) < Number(createInvestmentDto.principal)
    ) {
      throw new BadRequestException(
        'La cuenta no tiene fondos suficientes para realizar la inversión',
      );
    }

    // Descontar el principal de la cuenta
    account.balance =
      Number(account.balance) - Number(createInvestmentDto.principal);
    await this.accountRepository.save(account);

    if (createInvestmentDto.investment_type_id === 1) {
      cuentaDestinoCredito.balance = createInvestmentDto.principal;
    } else {
    }
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
   * Actualiza una inversión existente.
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
}
