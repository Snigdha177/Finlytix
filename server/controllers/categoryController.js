import Category from '../models/Category.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getCategories = async (req, res) => {
  try {
    const { type } = req.query;

    const filter = { userId: req.userId };
    if (type) filter.type = type;

    const categories = await Category.find(filter).sort('name');

    successResponse(res, { categories });
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, type, icon, color } = req.body;

    if (!name || !type) {
      return errorResponse(res, 'Name and type are required', 400);
    }

    const category = new Category({
      userId: req.userId,
      name,
      type,
      icon,
      color,
    });

    await category.save();

    successResponse(res, { category }, 'Category created', 201);
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    if (category.userId.toString() !== req.userId) {
      return errorResponse(res, 'Not authorized', 401);
    }

    Object.assign(category, req.body);
    await category.save();

    successResponse(res, { category }, 'Category updated');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    if (category.userId.toString() !== req.userId) {
      return errorResponse(res, 'Not authorized', 401);
    }

    await Category.findByIdAndDelete(req.params.id);

    successResponse(res, {}, 'Category deleted');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};
