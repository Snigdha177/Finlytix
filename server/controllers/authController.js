import User from '../models/User.js';
import Category from '../models/Category.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const DEFAULT_CATEGORIES = [
  // Expense categories
  { name: 'Food & Dining', type: 'expense', icon: '🍔', color: '#FF6B6B' },
  { name: 'Transport', type: 'expense', icon: '🚗', color: '#4ECDC4' },
  { name: 'Shopping', type: 'expense', icon: '🛍️', color: '#FF69B4' },
  { name: 'Entertainment', type: 'expense', icon: '🎮', color: '#FFD93D' },
  { name: 'Healthcare', type: 'expense', icon: '⚕️', color: '#6BCB77' },
  { name: 'Utilities', type: 'expense', icon: '💡', color: '#4D96FF' },
  { name: 'Education', type: 'expense', icon: '📚', color: '#9B59B6' },
  { name: 'Travel', type: 'expense', icon: '✈️', color: '#E74C3C' },
  { name: 'Other', type: 'expense', icon: '💰', color: '#95A5A6' },
  // Income categories
  { name: 'Salary', type: 'income', icon: '💼', color: '#27AE60' },
  { name: 'Freelance', type: 'income', icon: '💻', color: '#2980B9' },
  { name: 'Investment', type: 'income', icon: '📈', color: '#F39C12' },
  { name: 'Bonus', type: 'income', icon: '🎁', color: '#E67E22' },
  { name: 'Other Income', type: 'income', icon: '💵', color: '#16A085' },
];

const createDefaultCategories = async (userId) => {
  try {
    const existingCategories = await Category.countDocuments({ userId });
    if (existingCategories === 0) {
      const categoriesWithUserId = DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        userId
      }));
      await Category.insertMany(categoriesWithUserId);
    }
  } catch (error) {
    console.error('Error creating default categories:', error);
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return errorResponse(res, 'Google token is required', 400);
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    let isNewUser = false;
    
    if (!user) {
      user = new User({
        name: name || email.split('@')[0],
        email,
        password: Math.random().toString(36).slice(-32), // Random password for OAuth users
        avatar: picture,
      });
      await user.save();
      isNewUser = true;
      // Create default categories for new user
      await createDefaultCategories(user._id);
    }

    const authToken = generateToken(user._id);

    successResponse(res, {
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        theme: user.theme,
        avatar: user.avatar,
      },
    }, 'Google authentication successful', 200);
  } catch (error) {
    errorResponse(res, error.message || 'Google authentication failed', 500, error);
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return errorResponse(res, 'All fields are required', 400);
    }

    if (password !== confirmPassword) {
      return errorResponse(res, 'Passwords do not match', 400);
    }
 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'Email already registered', 400);
    }
 
    const user = new User({ name, email, password });
    await user.save();
    
    // Create default categories for new user
    await createDefaultCategories(user._id);
 
    const token = generateToken(user._id);

    successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          theme: user.theme,
        },
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
 
    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }
 
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const token = generateToken(user._id);

    successResponse(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        theme: user.theme,
      },
    });
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        theme: user.theme,
        currency: user.currency,
        emailNotifications: user.emailNotifications,
      },
    });
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { name, theme, currency, emailNotifications, notificationThreshold } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        ...(name && { name }),
        ...(theme && { theme }),
        ...(currency && { currency }),
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(notificationThreshold && { notificationThreshold }),
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, { user }, 'Profile updated successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 'Email is required', 400);
    }

    const user = await User.findOne({ email });
    
    // Don't reveal if email exists (security best practice)
    if (!user) {
      return successResponse(res, {}, 'Check your email for reset link', 200);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store hashed token in DB (24 hours expiry)
    user.passwordResetToken = tokenHash;
    user.passwordResetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    // Build reset URL for frontend
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    
    // TODO: Send email with resetUrl
    console.log('Reset URL:', resetUrl);

    successResponse(res, {}, 'Check your email for reset link', 200);
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword, confirmPassword } = req.body;

    if (!email || !token || !newPassword || !confirmPassword) {
      return errorResponse(res, 'All fields required', 400);
    }

    if (newPassword !== confirmPassword) {
      return errorResponse(res, 'Passwords do not match', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 'Password too short', 400);
    }

    // Hash incoming token and compare with stored hash
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      email,
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return errorResponse(res, 'Token expired or invalid', 400);
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    successResponse(res, {}, 'Password updated successfully', 200);
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};
