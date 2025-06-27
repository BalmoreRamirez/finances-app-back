
// services/transferService.js
import { Transfer, Account } from '../models/index.js';
import sequelize from '../config/database.js';

export const getTransfersByUserId = (userId) => {
    return Transfer.findAll({
        where: { user_id: userId },
        include: [
            { model: Account, as: 'FromAccount', attributes: ['account_name'] },
            { model: Account, as: 'ToAccount', attributes: ['account_name'] }
        ],
        order: [['transfer_date', 'DESC']]
    });
};

export const createTransferForUser = async (userId, data) => {
    const { from_account_id, to_account_id, amount } = data;

    if (from_account_id === to_account_id) {
        throw new Error('Source and destination accounts cannot be the same.');
    }

    const t = await sequelize.transaction();
    try {
        const numericAmount = parseFloat(amount);

        // 1. Bloquear y validar la cuenta de origen
        const fromAccount = await Account.findOne({
            where: { account_id: from_account_id, user_id: userId },
            transaction: t,
            lock: t.LOCK.UPDATE
        });
        if (!fromAccount) throw new Error('Source account not found or access denied.');
        if (parseFloat(fromAccount.balance) < numericAmount) throw new Error('Insufficient funds.');

        // 2. Bloquear y validar la cuenta de destino
        const toAccount = await Account.findOne({
            where: { account_id: to_account_id, user_id: userId },
            transaction: t,
            lock: t.LOCK.UPDATE
        });
        if (!toAccount) throw new Error('Destination account not found or access denied.');

        // 3. Actualizar saldos
        await fromAccount.decrement('balance', { by: numericAmount, transaction: t });
        await toAccount.increment('balance', { by: numericAmount, transaction: t });

        // 4. Crear el registro de la transferencia
        const transfer = await Transfer.create({ ...data, user_id: userId }, { transaction: t });

        await t.commit();
        return transfer;

    } catch (error) {
        await t.rollback();
        throw error;
    }
};