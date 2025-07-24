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

/**
 * Servicio para gestionar inversiones.
 */
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
   * Crea una nueva inversión y actualiza los balances de las cuentas.
   */
  async create(createInvestmentDto: CreateInvestmentDto, userId: number) {
    await this.validateAccounts(
      createInvestmentDto.account_origen_id,
      createInvestmentDto.account_destino_id,
      userId,
    );
    await this.validateInvestmentType(createInvestmentDto.investment_type_id);

    const [accountOrigen, accountDestino] = await Promise.all([
      this.accountRepository.findOne({
        where: { id: createInvestmentDto.account_origen_id, user_id: userId },
      }),
      this.accountRepository.findOne({
        where: { id: createInvestmentDto.account_destino_id, user_id: userId },
      }),
    ]);

    if ((accountOrigen?.balance ?? 0) < createInvestmentDto.invested_amount) {
      throw new BadRequestException(
        'La cuenta de origen no tiene fondos suficientes para realizar la inversión',
      );
    }

    accountOrigen.balance =
      Number(accountOrigen.balance) -
      Number(createInvestmentDto.invested_amount);
    accountDestino.balance =
      Number(accountDestino.balance) +
      Number(createInvestmentDto.invested_amount);

    await Promise.all([
      this.accountRepository.save(accountOrigen),
      this.accountRepository.save(accountDestino),
    ]);

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
      relations: [
        'user',
        'account_origen',
        'account_destino',
        'investment_type',
        'credit_payments',
      ],
    });
  }

  /**
   * Busca una inversión por ID.
   */
  async findOne(id: number) {
    const investment = await this.investmentRepository.findOne({
      where: { id },
      relations: [
        'user',
        'account_origen',
        'account_destino',
        'investment_type',
        'credit_payments',
      ],
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
    const existingInvestment = await this.investmentRepository.findOneBy({
      id,
    });
    if (!existingInvestment) {
      throw new NotFoundException(`Inversión con ID ${id} no encontrada`);
    }

    const origenId =
      updateInvestmentDto.account_origen_id ??
      existingInvestment.account_origen_id;
    const destinoId =
      updateInvestmentDto.account_destino_id ??
      existingInvestment.account_destino_id;
    await this.validateAccounts(
      origenId,
      destinoId,
      existingInvestment.user_id,
    );

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

  private async validateAccounts(
    accountOrigenId: number,
    accountDestinoId: number,
    userId: number,
  ) {
    if (accountOrigenId === accountDestinoId) {
      throw new BadRequestException(
        'La cuenta de origen y destino no pueden ser la misma',
      );
    }

    const [accountOrigen, accountDestino] = await Promise.all([
      this.accountRepository.findOne({
        where: { id: accountOrigenId, user_id: userId },
      }),
      this.accountRepository.findOne({
        where: { id: accountDestinoId, user_id: userId },
      }),
    ]);

    if (!accountOrigen) {
      throw new BadRequestException(
        `Cuenta de origen con ID ${accountOrigenId} no encontrada o no pertenece al usuario`,
      );
    }
    if (!accountDestino) {
      throw new BadRequestException(
        `Cuenta de destino con ID ${accountDestinoId} no encontrada o no pertenece al usuario`,
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
