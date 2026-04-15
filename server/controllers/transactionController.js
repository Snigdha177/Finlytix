import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';
import Budget from '../models/Budget.js';
import { successResponse, errorResponse, paginationMeta } from '../utils/response.js';

export const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, category, startDate, endDate, search, sort = '-date' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = { userId: req.userId };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (search) filter.description = { $regex: search, $options: 'i' };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .populate('category')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    successResponse(
      res,
      {
        transactions,
        pagination: paginationMeta(parseInt(page), parseInt(limit), total),
      },
      'Transactions retrieved'
    );
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { description, amount, type, category, date, tags, notes, recurring, recurringType, recurringEnd } = req.body;

    // Validation
    if (!description || !amount || !type || !category) {
      return errorResponse(res, 'Required fields missing', 400);
    }

    const transaction = new Transaction({
      userId: req.userId,
      description,
      amount,
      type,
      category,
      date: date || Date.now(),
      tags,
      notes,
      recurring,
      recurringType: recurring ? recurringType : null,
      recurringEnd: recurring ? recurringEnd : null,
    });

    await transaction.save();
    await transaction.populate('category');

    // Update budget spent amount
    if (type === 'expense') {
      const month = new Date(transaction.date).toISOString().slice(0, 7);
      await Budget.findOneAndUpdate(
        { userId: req.userId, category, month },
        { $inc: { spent: amount } },
        { upsert: false }
      );
    }

    successResponse(res, { transaction }, 'Transaction created', 201);
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return errorResponse(res, 'Transaction not found', 404);
    }

    if (transaction.userId.toString() !== req.userId) {
      return errorResponse(res, 'Not authorized', 401);
    }

    // If amount or type changed, update budget
    if ((req.body.amount && req.body.amount !== transaction.amount) || req.body.type) {
      const oldMonth = new Date(transaction.date).toISOString().slice(0, 7);
      if (transaction.type === 'expense') {
        await Budget.findOneAndUpdate(
          { userId: req.userId, category: transaction.category, month: oldMonth },
          { $inc: { spent: -transaction.amount } }
        );
      }

      const newType = req.body.type || transaction.type;
      const newAmount = req.body.amount || transaction.amount;
      if (newType === 'expense') {
        const newMonth = new Date(req.body.date || transaction.date).toISOString().slice(0, 7);
        await Budget.findOneAndUpdate(
          { userId: req.userId, category: req.body.category || transaction.category, month: newMonth },
          { $inc: { spent: newAmount } }
        );
      }
    }

    Object.assign(transaction, req.body);
    await transaction.save();
    await transaction.populate('category');

    successResponse(res, { transaction }, 'Transaction updated');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return errorResponse(res, 'Transaction not found', 404);
    }

    if (transaction.userId.toString() !== req.userId) {
      return errorResponse(res, 'Not authorized', 401);
    }

    // Update budget
    if (transaction.type === 'expense') {
      const month = new Date(transaction.date).toISOString().slice(0, 7);
      await Budget.findOneAndUpdate(
        { userId: req.userId, category: transaction.category, month },
        { $inc: { spent: -transaction.amount } }
      );
    }

    await Transaction.findByIdAndDelete(req.params.id);

    successResponse(res, {}, 'Transaction deleted');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, month } = req.query;

    let dateFilter = {};
    if (month) {
      const [year, monthNum] = month.split('-');
      dateFilter.date = {
        $gte: new Date(`${year}-${monthNum}-01`),
        $lt: new Date(`${year}-${parseInt(monthNum) + 1}-01`),
      };
    } else if (startDate && endDate) {
      dateFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const transactions = await Transaction.find({
      userId: req.userId,
      ...dateFilter,
    }).populate('category');

    // Calculate totals
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown
    const categoryBreakdown = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const categoryName = t.category?.name || 'Other';
        if (!categoryBreakdown[categoryName]) {
          categoryBreakdown[categoryName] = 0;
        }
        categoryBreakdown[categoryName] += t.amount;
      });

    // Daily breakdown (last 30 days)
    const dailyData = {};
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = { income: 0, expense: 0 };
    }

    transactions.forEach((t) => {
      const dateStr = t.date.toISOString().split('T')[0];
      if (dailyData[dateStr]) {
        if (t.type === 'income') {
          dailyData[dateStr].income += t.amount;
        } else {
          dailyData[dateStr].expense += t.amount;
        }
      }
    });

    successResponse(res, {
      summary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        transactionCount: transactions.length,
      },
      categoryBreakdown,
      dailyData: Object.entries(dailyData).map(([date, data]) => ({ date, ...data })),
    });
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};
