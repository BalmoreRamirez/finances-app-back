import InvestmentCreditPayment from '../models/investmentCreditPaymentModel.js';
import Investment from '../models/investmentModel.js';
import {NotFoundError} from '../utils/errors.js';
import sequelize from '../config/database.js';

export const createPayment = async (paymentData) => {
    const {investment_id, monto_pago} = paymentData;
    const t = await sequelize.transaction();
    try {
        const investment = await Investment.findByPk(investment_id, {transaction: t});
        if (!investment) {
            throw new NotFoundError('Inversión no encontrada');
        }
        investment.total_amount -= parseFloat(monto_pago);
        await investment.save({transaction: t});

        const newPayment = await InvestmentCreditPayment.create(paymentData, {transaction: t});

        await t.commit();
        return newPayment;

    } catch (error) {
        await t.rollback();
        throw error;
    }
};

export const getPaymentsByInvestmentId = async (investment_id) => {
    const payments = await InvestmentCreditPayment.findAll({where: {investment_id}});
    if (!payments) {
        throw new NotFoundError('No se encontraron pagos para esta inversión');
    }
    return payments;
};

export const updatePayment = async (payment_id, paymentData) => {
    // Nota: La lógica de actualización podría necesitar ajustar el total de la inversión también.
    // Esto requeriría obtener el pago antiguo, calcular la diferencia y aplicarla.
    const payment = await InvestmentCreditPayment.findByPk(payment_id);
    if (!payment) {
        throw new NotFoundError('Pago no encontrado');
    }
    return await payment.update(paymentData);
};

export const deletePayment = async (payment_id) => {
    // Nota: La lógica de eliminación también debería revertir el monto pagado al total de la inversión.
    const payment = await InvestmentCreditPayment.findByPk(payment_id);
    if (!payment) {
        throw new NotFoundError('Pago no encontrado');
    }
    await payment.destroy();
};