import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['budget_alert', 'transaction', 'reminder'],
      required: true,
    },
    title: String,
    message: String,
    data: mongoose.Schema.Types.Mixed,
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ userId: 1, read: 1 });

export default mongoose.model('Notification', notificationSchema);
