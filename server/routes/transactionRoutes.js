import express from 'express';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getAnalytics,
} from '../controllers/transactionController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getTransactions);
router.post('/', createTransaction);
router.get('/analytics', getAnalytics);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
