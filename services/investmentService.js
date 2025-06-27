// services/investmentService.js
import { Investment, InvestmentType, Account } from '../models/index.js';

export const getInvestmentsByUserId = (userId) => {
    return Investment.findAll({
        where: { user_id: userId },
        include: [
            { model: InvestmentType, attributes: ['type_name'] },
            { model: Account, attributes: ['account_name'] } // Cuenta de origen (si existe)
        ],
        order: [['purchase_date', 'DESC']]
    });
};

export const createInvestmentForUser = async (userId, data) => {
    // Valida que la cuenta de origen, si se especifica, pertenezca al usuario
    if (data.account_id) {
        const account = await Account.findOne({ where: { account_id: data.account_id, user_id: userId } });
        if (!account) {
            throw new Error('Source account not found or access denied');
        }
    }
    return Investment.create({ ...data, user_id: userId });
};