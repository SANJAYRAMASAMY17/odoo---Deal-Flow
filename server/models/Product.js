/**
 * Mongoose Product Schema for MongoDB
 */
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    basePrice: { type: Number, required: true },
    hsn: { type: String, default: '84713010' },
    taxRate: { type: Number, default: 18 },
    stock: { type: Number, default: 50 },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.Product || mongoose.model('Product', productSchema);
