// models/userModel.js
import {DataTypes} from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('Users', {
    user_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING(50), allowNull: false, unique: true},
    email: {type: DataTypes.STRING(100), allowNull: false, unique: true},
    password_hash: {type: DataTypes.STRING(255), allowNull: false},
}, {
    tableName: 'Users',
    updatedAt: false
});

// Hook para hashear la contraseña antes de crear el usuario
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(user.password_hash, salt);
});

// Método para comparar contraseñas
User.prototype.comparePassword = function (password) {
    return bcrypt.compare(password, this.password_hash);
};

export default User;