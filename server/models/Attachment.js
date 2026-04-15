import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
    },
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    filePath: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Attachment', attachmentSchema);
