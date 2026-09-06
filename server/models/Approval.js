/**
 * Mongoose Approval Workflow Schema for MongoDB
 */
import mongoose from 'mongoose';

const auditEntrySchema = new mongoose.Schema({
  time: { type: String, required: true },
  user: { type: String, required: true },
  action: { type: String, required: true },
});

const approvalSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    quotationId: { type: String, required: true },
    customer: { type: String, required: true },
    amount: { type: Number, required: true },
    requestedBy: { type: String, default: 'Sales Representative' },
    assignedTo: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Returned', 'Escalated'],
      default: 'Pending',
    },
    stage: { type: String, default: 'Pending Manager Review' },
    riskScore: { type: Number, default: 50 },
    factors: [{ type: String }],
    auditTrail: [auditEntrySchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.Approval || mongoose.model('Approval', approvalSchema);
