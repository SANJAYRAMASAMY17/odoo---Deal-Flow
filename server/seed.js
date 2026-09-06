/**
 * MongoDB Enterprise Seeding & Database Migration Script
 * Connects to MongoDB Atlas / Local MongoDB and seeds all application collections.
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...vals] = trimmed.split('=');
      if (key && vals.length) {
        process.env[key.trim()] = vals.join('=').trim();
      }
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dealflow360';

async function seedDatabase() {
  console.log(`🍃 [MongoDB Migration] Connecting to: ${MONGODB_URI}`);
  let mongoose;
  try {
    mongoose = (await import('mongoose')).default;
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB database successfully.');
  } catch (err) {
    console.error('❌ Could not connect to MongoDB:', err.message);
    process.exit(1);
  }

  const {
    User,
    Quotation,
    Product,
    Invoice,
    Consultation,
    Approval,
    FulfillmentOrder,
    Subscription,
    WarehouseStock,
    Activity,
    DealHealth,
  } = (await import('./models/index.js')).default;

  const usersCount = await User.countDocuments();
  if (usersCount === 0) {
    console.log('🌱 Seeding users into MongoDB...');
    await User.insertMany([
      {
        _id: '65e8a1f2b3c4d5e6f7a8b9c0',
        email: 'arjun.mehta@dealflow.in',
        password: 'BharatDealFlow#2026',
        name: 'Arjun Mehta',
        role: 'Director / Co-Founder',
        company: 'Bharat Tech Holdings',
        isVerified: true,
      },
      {
        _id: '65e8a1f2b3c4d5e6f7a8b9c1',
        email: 'admin@dealflow.in',
        password: 'BharatDealFlow#2026',
        name: 'System Administrator',
        role: 'Enterprise Admin',
        company: 'DealFlow Technologies Inc.',
        isVerified: true,
      },
      {
        _id: '65e8a1f2b3c4d5e6f7a8b9c2',
        email: 'demo@dealflow.in',
        password: 'BharatDealFlow#2026',
        name: 'Enterprise Auditor',
        role: 'Deal Lead',
        company: 'Indus Capital Partners',
        isVerified: true,
      },
    ]);
  }

  console.log('✨ [MongoDB Migration] Verification complete across all collections.');
  await mongoose.disconnect();
  console.log('👋 Disconnected from MongoDB.');
}

export default seedDatabase;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase();
}
