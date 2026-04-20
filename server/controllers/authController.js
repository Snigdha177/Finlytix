import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
    if (!user) {
      user = new User({
        name: name || email.split('@')[0],
        email,
        password: Math.random().toString(36).slice(-32), // Random password for OAuth users
        avatar: picture,
      });
      await user.save();
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
