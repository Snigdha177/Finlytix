import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response.js';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return errorResponse(res, 'No token provided', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    errorResponse(res, 'Invalid token', 401);
  }
};

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return errorResponse(res, 'Validation failed', 400, err.message);
  }

  if (err.name === 'CastError') {
    return errorResponse(res, 'Invalid ID format', 400);
  }

  errorResponse(res, err.message || 'Server error', err.statusCode || 500);
};
