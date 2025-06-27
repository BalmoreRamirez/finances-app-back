// models/transactionModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transaction = sequelize.define('Transactions', {
    transaction_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    account_id: { type: DataTypes.INTEGER, allowNull: false },
    category_id: { type: DataTypes.INTEGER, allowNull: true },
    transaction_type_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    description: { type: DataTypes.STRING(255) },
    transaction_date: { type: DataTypes.DATE, allowNull: false },
}, {
    tableName: 'Transactions', // Nombre de la tabla en plural
    updatedAt: false
});

export default Transaction;