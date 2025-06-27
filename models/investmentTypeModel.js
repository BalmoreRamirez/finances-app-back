// models/investmentTypeModel.js
import {DataTypes} from 'sequelize';
import sequelize from '../config/database.js';

const InvestmentType = sequelize.define('InvestmentTypes', {
    investment_type_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    type_name: {type: DataTypes.STRING(50), allowNull: false, unique: true},
}, {
    tableName: 'InvestmentTypes', // Nombre de la tabla en plural
    timestamps: false
});

export default InvestmentType;