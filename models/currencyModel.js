// models/currencyModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Currency = sequelize.define('Currencies', {
    currency_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    currency_code: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    currency_symbol: { type: DataTypes.STRING(5), allowNull: false },
}, {
    tableName: 'Currencies', // Nombre de la tabla en plural
    timestamps: false
});

export default Currency;