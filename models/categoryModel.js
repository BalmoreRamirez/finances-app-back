// models/categoryModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Category = sequelize.define('Categories', {
    category_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    category_name: { type: DataTypes.STRING(100), allowNull: false },
    transaction_type_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: true }, // Null para categorías globales
}, {
    tableName: 'Categories',
    timestamps: false
});

export default Category;