/**
 * Mongoose Quotation Schema for MongoDB
 */
import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema({
  id: Number,
  product: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  limit: { type: Number, default: 10 },
});

const quotationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    client: { type: String, required: true },
    city: { type: String, default: 'Bengaluru, Karnataka' },
    gstin: { type: String, default: '' },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    stage: {
      type: String,
      enum: ['Draft', 'Pending Approval', 'Approved', 'Negotiation', 'Invoiced'],
      default: 'Draft',
    },
    contact: { type: String, required: true },
    priceList: { type: String, default: 'Standard Indian Enterprise Tier 2026 (INR)' },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    lineItems: [lineItemSchema],
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.Quotation || mongoose.model('Quotation', quotationSchema);
