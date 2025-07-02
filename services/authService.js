// services/authService.js
import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (userData) => {
    const { username, email, password } = userData;
    // En el modelo, la contraseña se hashea como 'password_hash'
    const user = await User.create({ username, email, password_hash: password });
    return user;
};

export const loginUser = async (credentials) => {
    const { email, password } = credentials;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '8h',
    });

    return { user: { id: user.user_id, username: user.username, email: user.email }, token };
};