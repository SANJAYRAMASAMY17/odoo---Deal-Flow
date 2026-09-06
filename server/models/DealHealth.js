/**
 * Mongoose Deal Health Anomaly Schema for MongoDB
 */
import mongoose from 'mongoose';

const dealHealthSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    dealId: { type: String, required: true },
    customer: { type: String, required: true },
    type: { type: String, required: true },
    severity: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    flaggedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    description: { type: String, required: true },
    variance: { type: String, default: '0%' },
    status: {
      type: String,
      enum: ['Open', 'Under Investigation', 'Resolved', 'Dismissed'],
      default: 'Open',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.DealHealth || mongoose.model('DealHealth', dealHealthSchema);
