// services/accountService.js
import {Account, AccountType, Currency} from '../models/index.js';

export const getAccountsByUserId = (userId) => {
    return Account.findAll({
        where: {user_id: userId},
        include: [
            {model: AccountType, attributes: ['type_name']},
            {model: Currency, attributes: ['currency_code', 'currency_symbol']}
        ],
        order: [['account_name', 'ASC']]
    });
};

export const getAccountTypes = () => {
    return AccountType.findAll({
        order: [['type_name', 'ASC']]
    });
};

export const createAccountForUser = (userId, accountData) => {
    return Account.create({ userId, ...accountData});
};

export const updateAccountForUser = async (userId, accountId, accountData) => {
    const account = await Account.findOne({where: {account_id: accountId, user_id: userId}});
    if (!account) throw new Error('Account not found or access denied');
    await account.update(accountData);
    return account;
};

export const deleteAccountForUser = async (userId, accountId) => {
    const account = await Account.findOne({where: {account_id: accountId, user_id: userId}});
    if (!account) throw new Error('Account not found or access denied');
    await account.destroy();
    return {message: 'Account deleted successfully'};
};