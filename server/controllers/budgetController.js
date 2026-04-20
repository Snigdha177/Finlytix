import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getBudgets = async (req, res) => {
  try {
    const { month } = req.query;
    const currentMonth = month || new Date().toISOString().slice(0, 7);

    const budgets = await Budget.find({
      userId: req.userId,
      month: currentMonth,
    }).populate('category');

    const enrichedBudgets = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await Transaction.aggregate([
          {
            $match: {
              userId: budget.userId,
              category: budget.category._id,
              type: 'expense',
              date: {
                $gte: new Date(`${currentMonth}-01`),
                $lte: new Date(`${currentMonth}-31`),
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
            },
          },
        ]);

        const spentAmount = spent.length > 0 ? spent[0].total : 0;
        return {
          ...budget.toObject(),
          spent: spentAmount,
          percentage: Math.round((spentAmount / budget.limit) * 100),
          remaining: budget.limit - spentAmount,
        };
      })
    );

    successResponse(res, { budgets: enrichedBudgets });
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

export const createBudget = async (req, res) => {
  try {
    const { category, limit, month } = req.body;

    if (!category || !limit || !month) {
      return errorResponse(res, 'Required fields missing', 400);
    }
 
    const existing = await Budget.findOne({
      userId: req.userId,
      category,
      month,
    });

    if (existing) {
      return errorResponse(res, 'Budget already exists for this category and month', 400);
    }

    const budget = new Budget({
      userId: req.userId,
      category,
      limit,
      month,
    });

    await budget.save();
    await budget.populate('category');

    successResponse(res, { budget }, 'Budget created', 201);
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return errorResponse(res, 'Budget not found', 404);
    }

    if (budget.userId.toString() !== req.userId) {
      return errorResponse(res, 'Not authorized', 401);
    }

    Object.assign(budget, req.body);
    await budget.save();
    await budget.populate('category');

    successResponse(res, { budget }, 'Budget updated');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return errorResponse(res, 'Budget not found', 404);
    }

    if (budget.userId.toString() !== req.userId) {
      return errorResponse(res, 'Not authorized', 401);
    }

    await Budget.findByIdAndDelete(req.params.id);

    successResponse(res, {}, 'Budget deleted');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};
