/**
 * Mongoose Warehouse Stock Schema for MongoDB
 */
import mongoose from 'mongoose';

const warehouseStockSchema = new mongoose.Schema(
  {
    hub: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    gstin: { type: String, default: '' },
    capacityUnits: { type: Number, default: 10000 },
    currentStock: { type: Number, required: true },
    inventory: [
      {
        product: String,
        qty: Number,
        minThreshold: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.WarehouseStock || mongoose.model('WarehouseStock', warehouseStockSchema);
