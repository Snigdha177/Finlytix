import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [100, 'Description cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    tags: [String],
    notes: String,
    attachments: [String], // File paths
    recurring: {
      type: Boolean,
      default: false,
    },
    recurringType: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      default: null,
    },
    recurringEnd: Date,
    isPaid: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, type: 1 });

export default mongoose.model('Transaction', transactionSchema);
