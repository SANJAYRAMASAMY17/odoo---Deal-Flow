/**
 * User Model for MongoDB (Mongoose Schema)
 * Enterprise Authentication Schema for DealFlow360
 */

// Note: If mongoose is installed, this exports a genuine Mongoose model
let mongoose;
try {
  mongoose = (await import('mongoose')).default;
} catch {
  // Mongoose not yet installed, export pure schema metadata
}

let User = null;

if (mongoose && mongoose.Schema) {
  const UserSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: [true, 'Corporate email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid corporate email'],
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
      },
      name: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
      },
      role: {
        type: String,
        default: 'Director / Co-Founder',
      },
      company: {
        type: String,
        default: 'Bharat Tech Holdings',
      },
      city: {
        type: String,
        default: 'Bengaluru (Karnataka)',
      },
      gstin: {
        type: String,
        trim: true,
      },
      failedAttempts: {
        type: Number,
        default: 0,
      },
      lockUntil: {
        type: Date,
      },
      lastLogin: {
        type: Date,
      },
    },
    {
      timestamps: true,
      collection: 'users',
    }
  );

  User = mongoose.models.User || mongoose.model('User', UserSchema);
}

export default User;
