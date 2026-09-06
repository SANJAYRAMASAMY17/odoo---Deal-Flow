/**
 * Mongoose Fulfillment Order Schema for MongoDB
 */
import mongoose from 'mongoose';

const fulfillmentItemSchema = new mongoose.Schema({
  product: { type: String, required: true },
  qty: { type: Number, required: true },
  warehouse: { type: String, default: 'Bengaluru Central Hub' },
});

const fulfillmentOrderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    quotationId: { type: String, required: true },
    customer: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Ready to Ship', 'In Transit', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    warehouseHub: { type: String, default: 'Bengaluru Central Hub' },
    carrier: { type: String, default: 'BlueDart Express' },
    trackingId: { type: String, default: '' },
    ewayBill: { type: String, default: '' },
    items: [fulfillmentItemSchema],
    shippingAddress: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.FulfillmentOrder || mongoose.model('FulfillmentOrder', fulfillmentOrderSchema);
