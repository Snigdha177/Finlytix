import 'dotenv/config.js';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Transaction.deleteMany({});
    await Budget.deleteMany({});

    console.log('✓ Cleared existing data');

    // Create users
    const user = new User({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123',
    });
    await user.save();

    console.log('✓ Created demo user');

    // Create categories for income
    const incomeCategories = [
      { userId: user._id, name: 'Salary', type: 'income', icon: '💼', color: '#10b981' },
      { userId: user._id, name: 'Freelance', type: 'income', icon: '💻', color: '#06b6d4' },
      { userId: user._id, name: 'Investment', type: 'income', icon: '📈', color: '#f59e0b' },
      { userId: user._id, name: 'Gift', type: 'income', icon: '🎁', color: '#ec4899' },
    ];

    // Create categories for expense
    const expenseCategories = [
      { userId: user._id, name: 'Food & Dining', type: 'expense', icon: '🍔', color: '#ef4444' },
      { userId: user._id, name: 'Transportation', type: 'expense', icon: '🚗', color: '#f97316' },
      { userId: user._id, name: 'Healthcare', type: 'expense', icon: '🏥', color: '#d946ef' },
      { userId: user._id, name: 'Education', type: 'expense', icon: '🎓', color: '#06b6d4' },
      { userId: user._id, name: 'Entertainment', type: 'expense', icon: '🎬', color: '#8b5cf6' },
      { userId: user._id, name: 'Shopping', type: 'expense', icon: '🛒', color: '#3b82f6' },
      { userId: user._id, name: 'Travel', type: 'expense', icon: '✈️', color: '#6366f1' },
      { userId: user._id, name: 'Utilities', type: 'expense', icon: '💡', color: '#14b8a6' },
    ];

    const allCategories = await Category.insertMany([
      ...incomeCategories,
      ...expenseCategories,
    ]);

    console.log('✓ Created categories');

    // Create transactions
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    const transactions = [
      {
        userId: user._id,
        description: 'Monthly Salary',
        amount: 5000,
        type: 'income',
        category: allCategories[0]._id,
        date: new Date(`${currentMonth}-01`),
      },
      {
        userId: user._id,
        description: 'Freelance Project',
        amount: 1500,
        type: 'income',
        category: allCategories[1]._id,
        date: new Date(`${currentMonth}-15`),
      },
      {
        userId: user._id,
        description: 'Grocery Shopping',
        amount: 150,
        type: 'expense',
        category: allCategories[4]._id,
        date: new Date(),
      },
      {
        userId: user._id,
        description: 'Gas',
        amount: 60,
        type: 'expense',
        category: allCategories[5]._id,
        date: new Date(),
      },
      {
        userId: user._id,
        description: 'Movie Tickets',
        amount: 30,
        type: 'expense',
        category: allCategories[8]._id,
        date: new Date(),
      },
      {
        userId: user._id,
        description: 'Online Course',
        amount: 200,
        type: 'expense',
        category: allCategories[7]._id,
        date: new Date(),
      },
    ];

    await Transaction.insertMany(transactions);

    console.log('✓ Created transactions');

    // Create budgets
    const budgets = [
      {
        userId: user._id,
        category: allCategories[4]._id,
        limit: 500,
        month: currentMonth,
        spent: 180,
      },
      {
        userId: user._id,
        category: allCategories[5]._id,
        limit: 200,
        month: currentMonth,
        spent: 60,
      },
      {
        userId: user._id,
        category: allCategories[8]._id,
        limit: 150,
        month: currentMonth,
        spent: 30,
      },
    ];

    await Budget.insertMany(budgets);

    console.log('✓ Created budgets');

    console.log(`
✅ Database seeded successfully!

Demo Account:
Email: demo@example.com
Password: password123

Sample Data Created:
- 2 Income Categories
- 5 Expense Categories
- 6 Sample Transactions
- 3 Sample Budgets
    `);

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding data:', error);
    process.exit(1);
  }
};

const main = async () => {
  await connectDB();
  await seedData();
};

main();
