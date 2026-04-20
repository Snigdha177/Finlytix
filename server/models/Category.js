import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    icon: {
      type: String,
      default: '📁',
    },
    color: {
      type: String,
      default: '#6366f1',
      match: [/^#[0-9A-Fa-f]{6}$/, 'Please provide a valid hex color'],
    },
  },
  {
    timestamps: true,
  }
);
 
categorySchema.index({ userId: 1, type: 1 });

export default mongoose.model('Category', categorySchema);
