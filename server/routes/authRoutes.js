import express from 'express';
import { registerUser, loginUser, getCurrentUser, updateProfile, googleAuth, forgotPassword, resetPassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/profile', authenticate, updateProfile);
router.get('/me', authenticate, getCurrentUser);

export default router;
