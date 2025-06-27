// services/transactionService.js
import { Transaction, Account, TransactionType, Category } from '../models/index.js';
import sequelize from '../config/database.js';

export const getTransactionsByUserId = (userId) => {
    return Transaction.findAll({
        include: [{
            model: Account,
            where: { user_id: userId },
            attributes: ['account_name']
        }, {
            model: Category,
            attributes: ['category_name']
        }, {
            model: TransactionType,
            attributes: ['type_name']
        }],
        order: [['transaction_date', 'DESC']]
    });
};

export const createTransactionForUser = async (userId, data) => {
    const t = await sequelize.transaction();
    try {
        const { account_id, amount, transaction_type_id } = data;

        const account = await Account.findOne({ where: { account_id, user_id: userId }, transaction: t });
        if (!account) throw new Error('Account not found or access denied');

        const transactionType = await TransactionType.findByPk(transaction_type_id, { transaction: t });
        if (!transactionType) throw new Error('Transaction type not found');

        const numericAmount = parseFloat(amount);
        const currentBalance = parseFloat(account.balance);
        const newBalance = transactionType.type_name.toLowerCase() === 'ingreso'
            ? currentBalance + numericAmount
            : currentBalance - numericAmount;

        await account.update({ balance: newBalance }, { transaction: t });
        const newTransaction = await Transaction.create(data, { transaction: t });

        await t.commit();
        return newTransaction;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};