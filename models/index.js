// models/index.js
import User from './userModel.js';
import AccountType from './accountTypeModel.js';
import Currency from './currencyModel.js';
import Account from './accountModel.js';
import TransactionType from './transactionTypeModel.js';
import Category from './transactionCategoryModel.js';
import Transaction from './transactionModel.js';
import InvestmentType from './investmentTypeModel.js';
import Investment from './investmentModel.js';
import Transfer from './transferModel.js';

// User relations
User.hasMany(Account, { foreignKey: 'user_id' });
User.hasMany(Investment, { foreignKey: 'user_id' });
User.hasMany(Category, { foreignKey: 'user_id' });
User.hasMany(Transfer, { foreignKey: 'user_id' });

// Account relations
Account.belongsTo(User, { foreignKey: 'user_id' });
Account.belongsTo(AccountType, { foreignKey: 'account_type_id' });
Account.belongsTo(Currency, { foreignKey: 'currency_id' });
Account.hasMany(Transaction, { foreignKey: 'account_id' });
Account.hasMany(Investment, { foreignKey: 'account_id' });

// Transaction relations
Transaction.belongsTo(Account, { foreignKey: 'account_id' });
Transaction.belongsTo(Category, { foreignKey: 'category_id' });
Transaction.belongsTo(TransactionType, { foreignKey: 'transaction_type_id' });

// Category relations
Category.belongsTo(User, { foreignKey: 'user_id' });
Category.belongsTo(TransactionType, { foreignKey: 'transaction_type_id' });
Category.hasMany(Transaction, { foreignKey: 'category_id' });

// Investment relations
Investment.belongsTo(User, { foreignKey: 'user_id' });
Investment.belongsTo(Account, { foreignKey: 'account_id' });
Investment.belongsTo(InvestmentType, { foreignKey: 'investment_type_id' });

// Transfer relations
Transfer.belongsTo(User, { foreignKey: 'user_id' });
Transfer.belongsTo(Account, { as: 'FromAccount', foreignKey: 'from_account_id' });
Transfer.belongsTo(Account, { as: 'ToAccount', foreignKey: 'to_account_id' });

export {
    User, AccountType, Currency, Account, TransactionType,
    Category, Transaction, InvestmentType, Investment, Transfer
};