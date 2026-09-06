/**
 * Mongoose Subscription Schema for MongoDB
 */
import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    orderId: { type: String, default: '' },
    customer: { type: String, required: true },
    city: { type: String, default: 'Bengaluru, Karnataka' },
    gstin: { type: String, default: '' },
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    cycle: {
      type: String,
      enum: ['Monthly', 'Quarterly', 'Annual'],
      default: 'Monthly',
    },
    nextBill: { type: String, default: 'Oct 15' },
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Cancelled'],
      default: 'Active',
    },
    oneTimeLines: [
      {
        product: String,
        qty: Number,
        amountUSD: String,
        amountINR: Number,
      },
    ],
    recurringLines: [
      {
        plan: String,
        cycle: String,
        nextBillDate: String,
        amountUSD: String,
        amountINR: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.Subscription || mongoose.model('Subscription', subscriptionSchema);
