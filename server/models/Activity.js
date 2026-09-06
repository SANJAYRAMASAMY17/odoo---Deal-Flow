/**
 * Mongoose Activity Audit Schema for MongoDB
 */
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    time: { type: String, default: 'Just now' },
    type: {
      type: String,
      enum: ['success', 'warning', 'info', 'error'],
      default: 'info',
    },
    badge: { type: String, default: 'System' },
    user: { type: String, default: 'System' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.Activity || mongoose.model('Activity', activitySchema);
