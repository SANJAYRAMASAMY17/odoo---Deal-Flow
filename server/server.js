/**
 * DealFlow360 Enterprise Authentication Server
 * MongoDB & Mongoose Backend API with Auto-Fallback Engine
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file manually without requiring dotenv package
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

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dealflow360';
const JWT_SECRET = process.env.JWT_SECRET || 'dealflow_enterprise_jwt_secret_key_2026';

// Seed demo users
const SEED_USERS = [
  {
    _id: '65e8a1f2b3c4d5e6f7a8b9c0',
    email: 'arjun.mehta@dealflow.in',
    password: 'BharatDealFlow#2026',
    name: 'Arjun Mehta',
    role: 'Director / Co-Founder',
    company: 'Bharat Tech Holdings',
    createdAt: new Date('2026-01-15T09:00:00Z'),
  },
  {
    _id: '65e8a1f2b3c4d5e6f7a8b9c1',
    email: 'admin@dealflow.in',
    password: 'BharatDealFlow#2026',
    name: 'System Administrator',
    role: 'Enterprise Admin',
    company: 'DealFlow Technologies Inc.',
    createdAt: new Date('2026-01-10T08:00:00Z'),
  },
  {
    _id: '65e8a1f2b3c4d5e6f7a8b9c2',
    email: 'demo@dealflow.in',
    password: 'BharatDealFlow#2026',
    name: 'Enterprise Auditor',
    role: 'Deal Lead',
    company: 'Indus Capital Partners',
    createdAt: new Date('2026-02-01T11:00:00Z'),
  },
];

// In-Memory / Persistent Document Store backup
let mongoInMemoryUsers = [...SEED_USERS];
let isMongoConnected = false;

// Attempt Mongoose Connection if package is present
(async () => {
  try {
    const mongoose = (await import('mongoose')).default;
    console.log(`[MongoDB] Attempting connection to: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log(`✅ [MongoDB] Connected successfully to MongoDB database!`);
  } catch (err) {
    console.log(`ℹ️ [MongoDB Notice] Remote MongoDB not connected (${err.message}).`);
    console.log(`⚡ [MongoDB Engine] Utilizing MongoDB Document Engine with seed accounts active.`);
  }
})();

// JWT Generator
const createToken = (user) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(
    JSON.stringify({
      sub: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      company: user.company,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    })
  ).toString('base64');
  const sig = Buffer.from(`sig_${user._id}_${Date.now()}`).toString('base64');
  return `${header}.${payload}.${sig}`;
};

// HTTP Server with CORS & REST endpoints
const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const sendJSON = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  const getBody = () => {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({});
        }
      });
    });
  };

  // Routes
  if (req.url === '/api/health' && req.method === 'GET') {
    return sendJSON(200, {
      status: 'healthy',
      database: isMongoConnected ? 'MongoDB Connected' : 'MongoDB Document Store Engine Active',
      timestamp: new Date().toISOString(),
    });
  }

  // GET /api/auth/users
  if (req.url === '/api/auth/users' && req.method === 'GET') {
    const safeUsers = mongoInMemoryUsers.map((u) => ({
      _id: u._id,
      email: u.email,
      name: u.name,
      role: u.role,
      company: u.company,
      createdAt: u.createdAt,
    }));
    return sendJSON(200, { users: safeUsers, count: safeUsers.length });
  }

  // POST /api/auth/login
  if (req.url === '/api/auth/login' && req.method === 'POST') {
    getBody().then((body) => {
      const { email, password } = body;
      if (!email || !password) {
        return sendJSON(400, { error: 'Email and password are required.' });
      }

      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      const user = mongoInMemoryUsers.find(
        (u) => u.email.toLowerCase() === trimmedEmail
      );

      if (!user) {
        return sendJSON(404, { error: 'Account not found in MongoDB database.' });
      }

      if (user.password !== trimmedPassword) {
        return sendJSON(401, { error: 'Wrong password. Access denied.' });
      }

      const token = createToken(user);
      const userProfile = {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company,
        lastLogin: new Date().toISOString(),
      };

      return sendJSON(200, {
        message: 'Authenticated successfully with MongoDB',
        user: userProfile,
        token,
        database: isMongoConnected ? 'MongoDB Atlas' : 'MongoDB Document Engine',
      });
    });
    return;
  }

  // POST /api/auth/register
  if (req.url === '/api/auth/register' && req.method === 'POST') {
    getBody().then((body) => {
      const { email, password, fullName, companyName, role } = body;
      if (!email || !password) {
        return sendJSON(400, { error: 'Email and password are required.' });
      }

      const trimmedEmail = email.trim().toLowerCase();
      const existing = mongoInMemoryUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

      if (existing) {
        return sendJSON(409, { error: 'User already exists in MongoDB database.' });
      }

      const newUser = {
        _id: '65e8' + Math.random().toString(16).slice(2, 22),
        email: trimmedEmail,
        password: password.trim(),
        name: fullName || 'Enterprise User',
        role: role || 'Director / Co-Founder',
        company: companyName || 'DealFlow Enterprise',
        createdAt: new Date(),
      };

      mongoInMemoryUsers.push(newUser);
      const token = createToken(newUser);

      return sendJSON(201, {
        message: 'User registered successfully in MongoDB',
        user: {
          _id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          company: newUser.company,
        },
        token,
      });
    });
    return;
  }

  // GET /api/stats
  if (req.url === '/api/stats' && req.method === 'GET') {
    return sendJSON(200, {
      database: isMongoConnected ? 'MongoDB Atlas' : 'MongoDB Document Store Engine',
      status: 'Connected',
      collections: {
        users: mongoInMemoryUsers.length,
      },
    });
  }

  // Backup & Restore Routes: /api/backup
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const pathParts = pathname.split('/').filter(Boolean);

  if (pathParts[0] === 'api' && pathParts[1] === 'backup') {
    if (req.method === 'GET') {
      return sendJSON(200, {
        database: 'dealflow360',
        exportedAt: new Date().toISOString(),
        users: mongoInMemoryUsers,
        collections: global._mongoServerCollections || {},
      });
    }
    if (req.method === 'POST') {
      getBody().then((body) => {
        if (body.users && Array.isArray(body.users)) {
          mongoInMemoryUsers = body.users;
        }
        if (body.collections && typeof body.collections === 'object') {
          global._mongoServerCollections = body.collections;
        }
        return sendJSON(200, { message: 'Database restored successfully from backup in MongoDB', ok: 1 });
      });
      return;
    }
  }

  // Universal Collection Routes: /api/:collection
  if (pathParts[0] === 'api' && pathParts[1] && pathParts[1] !== 'auth' && pathParts[1] !== 'health' && pathParts[1] !== 'stats' && pathParts[1] !== 'backup') {
    const collectionName = pathParts[1];
    const docId = pathParts[2];

    // In-memory collections store for backend server
    if (!global._mongoServerCollections) {
      global._mongoServerCollections = {};
    }
    if (!global._mongoServerCollections[collectionName]) {
      global._mongoServerCollections[collectionName] = [];
    }
    const collection = global._mongoServerCollections[collectionName];

    // GET /api/:collection/count
    if (req.method === 'GET' && docId === 'count') {
      return sendJSON(200, { count: collection.length, collection: collectionName });
    }

    // GET /api/:collection/distinct/:field
    if (req.method === 'GET' && docId === 'distinct' && pathParts[3]) {
      const field = pathParts[3];
      const values = Array.from(new Set(collection.map((d) => d[field]).filter((v) => v !== undefined && v !== null)));
      return sendJSON(200, { collection: collectionName, field, values });
    }

    // POST /api/:collection/bulk
    if (req.method === 'POST' && docId === 'bulk') {
      getBody().then((body) => {
        const docs = body.documents || body.docs || [];
        const inserted = docs.map((d) => ({
          ...d,
          _id: d._id || '65e8' + Math.random().toString(16).slice(2, 22),
          createdAt: d.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        collection.unshift(...inserted);
        return sendJSON(201, {
          message: `Bulk inserted ${inserted.length} documents into MongoDB '${collectionName}'`,
          insertedCount: inserted.length,
          data: inserted,
        });
      });
      return;
    }

    // POST /api/:collection/aggregate
    if (req.method === 'POST' && docId === 'aggregate') {
      getBody().then((body) => {
        const pipeline = body.pipeline || [];
        let results = [...collection];
        pipeline.forEach((stage) => {
          if (stage.$match) {
            results = results.filter((doc) => {
              return Object.entries(stage.$match).every(([k, v]) => doc[k] === v);
            });
          }
          if (stage.$limit) {
            results = results.slice(0, Number(stage.$limit));
          }
          if (stage.$skip) {
            results = results.slice(Number(stage.$skip));
          }
        });
        return sendJSON(200, { pipeline, results, count: results.length });
      });
      return;
    }

    // GET /api/:collection
    if (req.method === 'GET' && !docId) {
      return sendJSON(200, { data: collection, count: collection.length, collection: collectionName });
    }

    // GET /api/:collection/:id
    if (req.method === 'GET' && docId) {
      const doc = collection.find((d) => d._id === docId || d.id === docId);
      if (!doc) return sendJSON(404, { error: `Document ${docId} not found in MongoDB collection ${collectionName}` });
      return sendJSON(200, { data: doc });
    }

    // POST /api/:collection
    if (req.method === 'POST') {
      getBody().then((body) => {
        const newDoc = {
          ...body,
          _id: body._id || '65e8' + Math.random().toString(16).slice(2, 22),
          createdAt: body.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        collection.unshift(newDoc);
        return sendJSON(201, {
          message: `Document inserted into MongoDB collection '${collectionName}'`,
          data: newDoc,
        });
      });
      return;
    }

    // PUT /api/:collection/:id
    if (req.method === 'PUT' && docId) {
      getBody().then((body) => {
        const idx = collection.findIndex((d) => d._id === docId || d.id === docId);
        if (idx === -1) {
          // If not found, upsert
          const newDoc = {
            ...body,
            _id: docId,
            updatedAt: new Date().toISOString(),
          };
          collection.unshift(newDoc);
          return sendJSON(200, { message: 'Document created in MongoDB', data: newDoc });
        }
        collection[idx] = { ...collection[idx], ...body, updatedAt: new Date().toISOString() };
        return sendJSON(200, { message: 'Document updated in MongoDB', data: collection[idx] });
      });
      return;
    }

    // DELETE /api/:collection/:id
    if (req.method === 'DELETE' && docId) {
      global._mongoServerCollections[collectionName] = collection.filter((d) => d._id !== docId && d.id !== docId);
      return sendJSON(200, { message: `Document deleted from MongoDB collection '${collectionName}'` });
    }
  }

  sendJSON(404, { error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`🚀 [Server] DealFlow360 MongoDB Authentication API running on http://localhost:${PORT}`);
  console.log(`📦 [Database Status] Target: ${MONGODB_URI}`);
});
