import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    limit: {
      type: Number,
      required: [true, 'Budget limit is required'],
      min: [0, 'Budget must be positive'],
    },
    month: {
      type: String,
      required: true,
    },
    spent: {
      type: Number,
      default: 0,
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
 
budgetSchema.index({ userId: 1, month: 1 });
budgetSchema.index({ userId: 1, category: 1, month: 1 });

export default mongoose.model('Budget', budgetSchema);
