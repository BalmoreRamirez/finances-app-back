import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestmentDetails } from './entities/investment-details.entity';
import { CreateInvestmentDetailsDto } from './dto/create-investment-details.dto';
import { UpdateInvestmentDetailsDto } from './dto/update-investment-details.dto';
import { Investment } from '../investments/entities/investment.entity';
import { InvestmentsService } from '../investments/investments.service';

@Injectable()
export class InvestmentDetailsService {
  constructor(
    @InjectRepository(InvestmentDetails)
    private readonly paymentRepository: Repository<InvestmentDetails>,
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
    @Inject(forwardRef(() => InvestmentsService))
    private readonly investmentsService: InvestmentsService,
  ) {}

  private async findInvestmentOrFail(investmentId: number) {
    const investment = await this.investmentRepository.findOneBy({
      id: investmentId,
    });
    if (!investment) {
      throw new NotFoundException(
        `La inversión con ID ${investmentId} no existe.`,
      );
    }
    return investment;
  }

  async create(
    investmentId: number,
    dto: CreateInvestmentDetailsDto,
  ): Promise<InvestmentDetails> {
    const investment = await this.findInvestmentOrFail(investmentId);
    const payment = this.paymentRepository.create({
      ...dto,
      investment: { id: investmentId },
    });
    
    const savedPayment = await this.paymentRepository.save(payment);
    
    // Verificar si es una inversión tipo Crédito y si se completó el pago total
    if (investment.investment_type_id === 1) {
      await this.checkAndCompleteInvestment(investment);
    }
    
    return savedPayment;
  }

  async findAllByInvestment(
    investmentId: number,
  ): Promise<InvestmentDetails[]> {
    await this.findInvestmentOrFail(investmentId);
    return this.paymentRepository.find({
      where: { investment: { id: investmentId } },
    });
  }

  async findOne(
    investmentId: number,
    paymentId: number,
  ): Promise<InvestmentDetails> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId, investment: { id: investmentId } },
    });
    if (!payment) {
      throw new NotFoundException(
        `El pago con ID ${paymentId} no existe o no pertenece a la inversión con ID ${investmentId}.`,
      );
    }
    return payment;
  }

  async update(
    investmentId: number,
    paymentId: number,
    dto: UpdateInvestmentDetailsDto,
  ) {
    const payment = await this.findOne(investmentId, paymentId);
    const investment = await this.findInvestmentOrFail(investmentId);
    
    this.paymentRepository.merge(payment, dto);
    const updatedPayment = await this.paymentRepository.save(payment);
    
    // Verificar si es una inversión tipo Crédito y si se completó el pago total
    if (investment.investment_type_id === 1) {
      await this.checkAndCompleteInvestment(investment);
    }
    
    return updatedPayment;
  }

  async remove(investmentId: number, paymentId: number) {
    const payment = await this.findOne(investmentId, paymentId);
    const investment = await this.findInvestmentOrFail(investmentId);
    
    await this.paymentRepository.remove(payment);
    
    // Verificar si es una inversión tipo Crédito y si se completó el pago total después de eliminar
    if (investment.investment_type_id === 1) {
      await this.checkAndCompleteInvestment(investment);
    }
    
    return {
      message: `El pago con ID ${paymentId} ha sido eliminado correctamente.`,
    };
  }

  /**
   * Verifica si los pagos de una inversión tipo Crédito han completado el monto total
   * y actualiza automáticamente el estado a "finalizada" si es necesario.
   */
  private async checkAndCompleteInvestment(investment: Investment) {
    // Solo procesar inversiones tipo Crédito que estén activas
    if (investment.investment_type_id !== 1 || investment.status === 'finalizada') {
      return;
    }

    // Calcular el monto total esperado (capital + ganancia)
    const principal = Number(investment.principal);
    const expectedReturn = Number(investment.expected_return);
    const totalExpected = principal + expectedReturn;

    // Obtener todos los pagos de esta inversión
    const payments = await this.paymentRepository.find({
      where: { 
        investment: { id: investment.id },
        is_income: true, // Solo contar los ingresos (pagos recibidos)
        paid: true // Solo contar los pagos marcados como pagados
      },
    });

    // Sumar todos los pagos
    const totalPaid = payments.reduce((sum, payment) => {
      return sum + Number(payment.amount);
    }, 0);

    console.log(`Verificando inversión ${investment.id}:
      - Capital: ${principal}
      - Ganancia esperada: ${expectedReturn}
      - Total esperado: ${totalExpected}
      - Total pagado: ${totalPaid}
      - Estado actual: ${investment.status}`);

    // Si el total pagado alcanza o supera el monto esperado, finalizar la inversión
    if (totalPaid >= totalExpected) {
      console.log(`¡Inversión ${investment.id} completada! Cambiando estado a finalizada.`);
      
      // Usar el servicio de inversiones para actualizar el estado
      // Esto ejecutará automáticamente los movimientos contables
      await this.investmentsService.update(investment.id, { 
        status: 'finalizada' 
      });
    }
  }
}
