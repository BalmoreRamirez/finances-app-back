// services/categoryService.js
import { Category, TransactionType } from '../models/index.js';
import { Op } from 'sequelize';

export const getCategoriesByUserId = (userId) => {
    return Category.findAll({
        where: {
            // Obtiene categorías globales (user_id es NULL) O las del usuario específico
            [Op.or]: [
                { user_id: userId },
                { user_id: null }
            ]
        },
        include: [{ model: TransactionType, attributes: ['type_name'] }],
        order: [['category_name', 'ASC']]
    });
};

export const createCategoryForUser = (userId, categoryData) => {
    // Al crear, se asigna al usuario que la crea
    return Category.create({ ...categoryData, user_id: userId });
};

export const updateCategoryForUser = async (userId, categoryId, categoryData) => {
    const category = await Category.findOne({ where: { category_id: categoryId, user_id: userId } });
    if (!category) {
        throw new Error('Category not found or access denied');
    }
    await category.update(categoryData);
    return category;
};

export const deleteCategoryForUser = async (userId, categoryId) => {
    const category = await Category.findOne({ where: { category_id: categoryId, user_id: userId } });
    if (!category) {
        throw new Error('Category not found or access denied');
    }
    await category.destroy();
    return { message: 'Category deleted successfully' };
};