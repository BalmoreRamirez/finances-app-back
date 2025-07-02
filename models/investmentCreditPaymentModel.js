import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const InvestmentCreditPayment = sequelize.define('InvestmentCreditPayment', {
    payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    investment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Investments',
            key: 'investment_id'
        }
    },
    monto_pago: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    fecha_pago: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'InvestmentCreditPayments',
    timestamps: true,
});

export default InvestmentCreditPayment;