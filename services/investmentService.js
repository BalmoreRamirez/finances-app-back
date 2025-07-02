import {Investment, InvestmentType, Account} from '../models/index.js';

export const getInvestmentsByUserId = (userId) => {
    return Investment.findAll({
        where: {user_id: userId},
        include: [
            {model: InvestmentType, attributes: ['type_name']},
            {model: Account, attributes: ['account_name']}
        ],
        order: [['investment_date', 'DESC']]
    });
};

export const createInvestmentForUser = async (userId, data) => {
    if (data.account_id) {
        const account = await Account.findOne({where: {account_id: data.account_id, user_id: userId}});
        if (!account) {
            throw new Error('Source account not found or access denied');
        }
    }

    // Si el tipo de inversión es 'Crédito', calcula la ganancia y el monto total.
    if (data.investment_type_id && data.invested_amount && typeof data.interest !== 'undefined') {
        const investmentType = await InvestmentType.findByPk(data.investment_type_id);
        // Asumiendo que el nombre del tipo es 'Crédito'. Ajusta si es necesario.
        if (investmentType && investmentType.type_name.toLowerCase() === 'crédito') {
            const investedAmount = parseFloat(data.invested_amount);
            const interest = parseFloat(data.interest);

            if (!isNaN(investedAmount) && !isNaN(interest)) {
                const profit = investedAmount * (interest / 100);
                data.profit = profit.toFixed(2);
                data.total_amount = (investedAmount + profit).toFixed(2);
            }
        }
    }

    return Investment.create({...data, user_id: userId});
};

export const getInvestmentTypes = () => {
    return InvestmentType.findAll({
        order: [['type_name', 'ASC']]
    });
};
export const updateInvestmentForUser = async (userId, investmentId, data) => {
    const investment = await Investment.findOne({where: {investment_id: investmentId, user_id: userId}});
    if (!investment) {
        throw new Error('Investment not found or access denied');
    }
    return investment.update(data);
};
export const deleteInvestmentForUser = async (userId, investmentId) => {
    const investment = await Investment.findOne({where: {investment_id: investmentId, user_id: userId}});
    if (!investment) {
        throw new Error('Investment not found or access denied');
    }
    return investment.destroy();
};
export const getInvestmentById = async (userId, investmentId) => {
    const investment = await Investment.findOne({
        where: {
            investment_id: investmentId,
            user_id: userId
        },
        include: [
            {model: InvestmentType, attributes: ['type_name']},
            {model: Account, attributes: ['account_name']}
        ]
    });
    if (!investment) {
        throw new Error('Investment not found or access denied');
    }
    return investment;
};