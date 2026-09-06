/**
 * Mongoose Consultation Lead Schema for MongoDB
 */
import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    needs: { type: String, default: '' },
    status: {
      type: String,
      enum: ['New Lead', 'In Review', 'Qualified Lead', 'Contacted', 'Closed'],
      default: 'New Lead',
    },
    source: { type: String, default: 'Website Consultation Form' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.Consultation || mongoose.model('Consultation', consultationSchema);
