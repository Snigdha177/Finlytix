import express from 'express';
import { registerUser, loginUser, getCurrentUser, updateProfile, googleAuth } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.put('/profile', authenticate, updateProfile);

export default router;
