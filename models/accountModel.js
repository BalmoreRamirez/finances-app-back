// models/accountModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Account = sequelize.define('Account', { // Modelo en singular
    accountId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'account_id' // Mapea a la columna de la BD
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
    },
    accountName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'account_name'
    },
    accountTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'account_type_id'
    },
    balance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    currencyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'currency_id'
    },
}, {
    tableName: 'Accounts'
});

export default Account;