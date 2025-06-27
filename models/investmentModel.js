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
        // Corresponde a 'interes' en el frontend
        interest: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 0.00
        },
        // Corresponde a 'montoTotal' en el frontend
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
        // Corresponde a 'fechaVencimiento' en el frontend
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
        timestamps: true, // Agrega createdAt y updatedAt
    }
);

export default Investment;