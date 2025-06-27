// models/transferModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transfer = sequelize.define('Transfers', {
    transfer_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    from_account_id: { type: DataTypes.INTEGER, allowNull: false },
    to_account_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    transfer_date: { type: DataTypes.DATE, allowNull: false },
    description: { type: DataTypes.STRING(255) },
}, {
    tableName: 'Transfers', // Nombre de la tabla en plural
    updatedAt: false
});

export default Transfer;