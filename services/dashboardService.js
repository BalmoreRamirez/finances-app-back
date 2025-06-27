// services/dashboardService.js
import { Account, Transaction, Investment } from '../models/index.js';
import { Op } from 'sequelize';

export const getSummaryByUserId = async (userId) => {
    // 1. Calcular el balance total de todas las cuentas
    const totalBalance = await Account.sum('balance', { where: { user_id: userId } });

    // 2. Contar el número de cuentas
    const accountCount = await Account.count({ where: { user_id: userId } });

    // 3. Obtener las 5 transacciones más recientes
    const recentTransactions = await Transaction.findAll({
        limit: 5,
        order: [['transaction_date', 'DESC']],
        include: [{
            model: Account,
            where: { user_id: userId },
            attributes: ['account_name']
        }]
    });

    // 4. Calcular el valor total de las inversiones
    const totalInvestments = await Investment.sum('current_value', { where: { user_id: userId } });

    return {
        totalBalance: totalBalance || 0,
        accountCount: accountCount || 0,
        totalInvestments: totalInvestments || 0,
        recentTransactions,
    };
};