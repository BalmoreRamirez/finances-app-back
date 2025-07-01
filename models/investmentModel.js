// models/investmentModel.js
import {DataTypes} from 'sequelize';
import sequelize from '../config/database.js';

const Investment = sequelize.define('Investments', {
        investment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        account_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        investment_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        investment_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        beneficiary: {
            type: DataTypes.STRING
        },
        invested_amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        interest: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 0.00
        },
        total_amount: {
            type: DataTypes.DECIMAL(12, 2)
        },
        profit: {
            type: DataTypes.DECIMAL(12, 2)
        },
        investment_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        due_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('activa', 'pagada', 'finalizada', 'vencida'),
            allowNull: false,
            defaultValue: 'activa'
        }
    }, {
        tableName: 'Investments',
        timestamps: true,
    }
);

export default Investment;