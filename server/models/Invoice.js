/**
 * Mongoose Invoice Schema for MongoDB
 */
import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    quotationId: { type: String, default: '' },
    customer: { type: String, required: true },
    gstin: { type: String, default: '' },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Paid', 'Partially Paid', 'Overdue', 'Due', 'Pending'],
      default: 'Due',
    },
    dueDate: { type: String, required: true },
    invoiceDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    eWayBill: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.Invoice || mongoose.model('Invoice', invoiceSchema);
