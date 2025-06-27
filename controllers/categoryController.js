// controllers/categoryController.js
import * as categoryService from '../services/categoryService.js';

export const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategoriesByUserId(req.user.id);
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const newCategory = await categoryService.createCategoryForUser(req.user.id, req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const updatedCategory = await categoryService.updateCategoryForUser(req.user.id, req.params.id, req.body);
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(error.message.includes('not found') ? 404 : 400).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategoryForUser(req.user.id, req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(error.message.includes('not found') ? 404 : 500).json({ message: error.message });
    }
};