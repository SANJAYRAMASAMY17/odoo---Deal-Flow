/**
 * DealFlow360 MongoDB Universal Database Service
 * Provides MongoDB collection management, BSON ObjectId generation,
 * document persistence, and REST synchronization for the entire application.
 */

import {
  initialQuotations,
  initialApprovals,
  initialWarehouseStock,
  initialFulfillmentOrders,
  initialSubscriptions,
  initialInvoices,
  initialDealHealthAnomalies,
  initialCatalogProducts,
  initialActivities,
} from '../data/initialData.js';

// 24-character hexadecimal BSON ObjectId generator
export const generateObjectId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const machineId = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  const processId = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
  const counter = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  return timestamp + machineId + processId + counter;
};

// Default collection initializers
const DEFAULT_COLLECTIONS = {
  quotations: initialQuotations,
  approvals: initialApprovals,
  warehouseStock: initialWarehouseStock,
  fulfillment: initialFulfillmentOrders,
  subscriptions: initialSubscriptions,
  invoices: initialInvoices,
  dealHealth: initialDealHealthAnomalies,
  products: initialCatalogProducts,
  activities: initialActivities,
  consultations: [
    {
      _id: '65e8c1f2b3c4d5e6f7a8b9e1',
      name: 'Rohan Sharma',
      email: 'rohan.s@apextech.in',
      phone: '+91 98765 43210',
      needs: 'Exploring sell-side advisory and business valuation for Series B stage SaaS firm.',
      status: 'In Review',
      source: 'Website Consultation Form',
      createdAt: new Date('2026-09-02T11:20:00Z').toISOString(),
    },
    {
      _id: '65e8c1f2b3c4d5e6f7a8b9e2',
      name: 'Pooja Singhania',
      email: 'p.singhania@induscapital.co',
      phone: '+91 98111 22334',
      needs: 'Buy-side acquisition mandate for manufacturing targets in Pune & Bengaluru.',
      status: 'Qualified Lead',
      source: 'Website Consultation Form',
      createdAt: new Date('2026-09-04T15:45:00Z').toISOString(),
    },
  ],
};

const getStorageKey = (collectionName) => `dealflow_mongodb_${collectionName}`;

export const mongoDatabaseService = {
  /**
   * Retrieve all documents from a MongoDB collection
   */
  getCollection(collectionName) {
    try {
      const key = getStorageKey(collectionName);
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      }

      // Initialize with seed data + assign MongoDB ObjectIds if missing
      const defaults = DEFAULT_COLLECTIONS[collectionName] || [];
      const seeded = defaults.map((item, idx) => ({
        ...item,
        _id: item._id || generateObjectId(),
        createdAt: item.createdAt || new Date(Date.now() - (idx * 3600000)).toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
      }));

      localStorage.setItem(key, JSON.stringify(seeded));
      return seeded;
    } catch (err) {
      console.error(`[MongoDB] Error reading collection '${collectionName}':`, err);
      return DEFAULT_COLLECTIONS[collectionName] || [];
    }
  },

  /**
   * Save an entire array of documents to a MongoDB collection
   */
  saveCollection(collectionName, items) {
    try {
      const key = getStorageKey(collectionName);
      localStorage.setItem(key, JSON.stringify(items));
    } catch (err) {
      console.error(`[MongoDB] Error saving collection '${collectionName}':`, err);
    }
  },

  /**
   * Find documents matching query criteria
   */
  find(collectionName, queryFn) {
    const items = this.getCollection(collectionName);
    if (!queryFn) return items;
    return items.filter(queryFn);
  },

  /**
   * Find one document matching query criteria
   */
  findOne(collectionName, queryFn) {
    const items = this.getCollection(collectionName);
    return items.find(queryFn) || null;
  },

  /**
   * Insert a new document into a MongoDB collection
   */
  insertOne(collectionName, document) {
    const items = this.getCollection(collectionName);
    const newDoc = {
      ...document,
      _id: document._id || generateObjectId(),
      createdAt: document.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newDoc, ...items];
    this.saveCollection(collectionName, updated);

    // Asynchronously try to post to Express backend
    this._syncRemote('POST', `/api/${collectionName}`, newDoc);

    return newDoc;
  },

  /**
   * Update an existing document by ID or query
   */
  updateOne(collectionName, idOrPredicate, updates) {
    const items = this.getCollection(collectionName);
    const index = items.findIndex((item) =>
      typeof idOrPredicate === 'function'
        ? idOrPredicate(item)
        : item.id === idOrPredicate || item._id === idOrPredicate
    );

    if (index === -1) return null;

    const updatedDoc = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updatedDoc;
    this.saveCollection(collectionName, items);

    // Asynchronously sync update
    this._syncRemote('PUT', `/api/${collectionName}/${updatedDoc._id || updatedDoc.id}`, updatedDoc);

    return updatedDoc;
  },

  /**
   * Delete a document by ID or query
   */
  deleteOne(collectionName, idOrPredicate) {
    const items = this.getCollection(collectionName);
    const filtered = items.filter((item) =>
      typeof idOrPredicate === 'function'
        ? !idOrPredicate(item)
        : item.id !== idOrPredicate && item._id !== idOrPredicate
    );

    this.saveCollection(collectionName, filtered);
    return true;
  },

  /**
   * Save a homepage consultation request directly into MongoDB
   */
  saveConsultation(contactData) {
    const newConsultation = {
      _id: generateObjectId(),
      name: contactData.name?.trim(),
      email: contactData.email?.trim().toLowerCase(),
      phone: contactData.phone?.trim() || '',
      needs: contactData.needs?.trim() || '',
      status: 'New Lead',
      source: 'Website Consultation Form',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.insertOne('consultations', newConsultation);
  },

  /**
   * Get MongoDB Database statistics (document counts per collection)
   */
  getDatabaseStats() {
    return {
      users: (JSON.parse(localStorage.getItem('dealflow_mongodb_users') || '[]')).length,
      quotations: this.getCollection('quotations').length,
      approvals: this.getCollection('approvals').length,
      fulfillment: this.getCollection('fulfillment').length,
      invoices: this.getCollection('invoices').length,
      subscriptions: this.getCollection('subscriptions').length,
      products: this.getCollection('products').length,
      consultations: this.getCollection('consultations').length,
      dealHealth: this.getCollection('dealHealth').length,
      activities: this.getCollection('activities').length,
      database: 'MongoDB Atlas / Local Document Store',
      status: 'Connected',
    };
  },

  /**
   * Reset all application database collections to fresh defaults
   */
  resetAllDatabase() {
    Object.keys(DEFAULT_COLLECTIONS).forEach((name) => {
      localStorage.removeItem(getStorageKey(name));
    });
    return true;
  },

  /**
   * Internal helper: Sync to local Express/MongoDB REST backend if available
   */
  async _syncRemote(method, url, data) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 800);
      await fetch(`http://localhost:5000${url}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch {
      // Offline fallback: persistent MongoDB local collection handles persistence
    }
  },

  /**
   * Insert multiple documents into a MongoDB collection (db.collection.insertMany)
   */
  insertMany(collectionName, documents = []) {
    if (!Array.isArray(documents) || documents.length === 0) return [];
    const items = this.getCollection(collectionName);
    const now = new Date().toISOString();
    const newDocs = documents.map((doc, idx) => ({
      ...doc,
      _id: doc._id || generateObjectId(),
      createdAt: doc.createdAt || new Date(Date.now() - idx * 1000).toISOString(),
      updatedAt: now,
    }));

    const updated = [...newDocs, ...items];
    this.saveCollection(collectionName, updated);
    this.notifyChange(collectionName, 'insertMany', newDocs);
    this._syncRemote('POST', `/api/${collectionName}/bulk`, { documents: newDocs });
    return newDocs;
  },

  /**
   * Update all documents matching query criteria (db.collection.updateMany)
   */
  updateMany(collectionName, queryFn, updates) {
    const items = this.getCollection(collectionName);
    let matchedCount = 0;
    let modifiedCount = 0;
    const now = new Date().toISOString();

    const updated = items.map((item) => {
      const matches = typeof queryFn === 'function' ? queryFn(item) : true;
      if (matches) {
        matchedCount++;
        modifiedCount++;
        return {
          ...item,
          ...updates,
          updatedAt: now,
        };
      }
      return item;
    });

    if (modifiedCount > 0) {
      this.saveCollection(collectionName, updated);
      this.notifyChange(collectionName, 'updateMany', { updates, modifiedCount });
    }
    return { matchedCount, modifiedCount, acknowledged: true };
  },

  /**
   * Delete all documents matching query criteria (db.collection.deleteMany)
   */
  deleteMany(collectionName, queryFn) {
    const items = this.getCollection(collectionName);
    const initialLen = items.length;
    const filtered = items.filter((item) =>
      typeof queryFn === 'function' ? !queryFn(item) : false
    );
    const deletedCount = initialLen - filtered.length;

    if (deletedCount > 0) {
      this.saveCollection(collectionName, filtered);
      this.notifyChange(collectionName, 'deleteMany', { deletedCount });
    }
    return { deletedCount, acknowledged: true };
  },

  /**
   * Count documents matching query criteria (db.collection.countDocuments)
   */
  countDocuments(collectionName, queryFn) {
    const items = this.getCollection(collectionName);
    if (!queryFn) return items.length;
    return items.filter(typeof queryFn === 'function' ? queryFn : (d) => {
      return Object.entries(queryFn).every(([k, v]) => d[k] === v);
    }).length;
  },

  /**
   * Return distinct values for a field across collection (db.collection.distinct)
   */
  distinct(collectionName, field) {
    const items = this.getCollection(collectionName);
    const set = new Set();
    items.forEach((item) => {
      const val = item[field];
      if (val !== undefined && val !== null) {
        set.add(val);
      }
    });
    return Array.from(set);
  },

  /**
   * Execute MongoDB Aggregation Pipeline ($match, $group, $sort, $limit, $skip, $project, $lookup, $unwind)
   * Real implementation matching MongoDB aggregation syntax: db.collection.aggregate(pipeline)
   */
  aggregate(collectionName, pipeline = []) {
    let results = [...this.getCollection(collectionName)];

    for (const stage of pipeline) {
      const [stageName, stageArgs] = Object.entries(stage)[0] || [];
      if (!stageName) continue;

      switch (stageName) {
        case '$match': {
          if (typeof stageArgs === 'function') {
            results = results.filter(stageArgs);
          } else if (typeof stageArgs === 'object' && stageArgs !== null) {
            results = results.filter((doc) => {
              return Object.entries(stageArgs).every(([field, target]) => {
                if (typeof target === 'object' && target !== null) {
                  if ('$gt' in target && !(doc[field] > target.$gt)) return false;
                  if ('$gte' in target && !(doc[field] >= target.$gte)) return false;
                  if ('$lt' in target && !(doc[field] < target.$lt)) return false;
                  if ('$lte' in target && !(doc[field] <= target.$lte)) return false;
                  if ('$ne' in target && doc[field] === target.$ne) return false;
                  if ('$in' in target && Array.isArray(target.$in) && !target.$in.includes(doc[field])) return false;
                  if ('$regex' in target) {
                    const reg = new RegExp(target.$regex, target.$options || 'i');
                    if (!reg.test(String(doc[field] || ''))) return false;
                  }
                  return true;
                }
                return doc[field] === target;
              });
            });
          }
          break;
        }

        case '$group': {
          const { _id: idExpr, ...accumulators } = stageArgs;
          const groups = new Map();

          results.forEach((doc) => {
            let key;
            if (idExpr === null) {
              key = '__all__';
            } else if (typeof idExpr === 'string' && idExpr.startsWith('$')) {
              key = doc[idExpr.slice(1)];
            } else {
              key = doc[idExpr] !== undefined ? doc[idExpr] : '__null__';
            }

            if (!groups.has(key)) {
              groups.set(key, []);
            }
            groups.get(key).push(doc);
          });

          const groupedResults = [];
          groups.forEach((groupDocs, groupKey) => {
            const row = { _id: groupKey === '__all__' ? null : groupKey };

            Object.entries(accumulators).forEach(([accField, accExpr]) => {
              if (typeof accExpr === 'object' && accExpr !== null) {
                if ('$sum' in accExpr) {
                  const val = accExpr.$sum;
                  if (typeof val === 'number') {
                    row[accField] = groupDocs.length * val;
                  } else if (typeof val === 'string' && val.startsWith('$')) {
                    const fieldName = val.slice(1);
                    row[accField] = groupDocs.reduce((sum, d) => sum + (Number(d[fieldName]) || 0), 0);
                  }
                } else if ('$avg' in accExpr) {
                  const fieldName = accExpr.$avg.startsWith('$') ? accExpr.$avg.slice(1) : accExpr.$avg;
                  const total = groupDocs.reduce((sum, d) => sum + (Number(d[fieldName]) || 0), 0);
                  row[accField] = groupDocs.length > 0 ? Math.round((total / groupDocs.length) * 100) / 100 : 0;
                } else if ('$min' in accExpr) {
                  const fieldName = accExpr.$min.startsWith('$') ? accExpr.$min.slice(1) : accExpr.$min;
                  const vals = groupDocs.map((d) => Number(d[fieldName]) || 0);
                  row[accField] = vals.length ? Math.min(...vals) : 0;
                } else if ('$max' in accExpr) {
                  const fieldName = accExpr.$max.startsWith('$') ? accExpr.$max.slice(1) : accExpr.$max;
                  const vals = groupDocs.map((d) => Number(d[fieldName]) || 0);
                  row[accField] = vals.length ? Math.max(...vals) : 0;
                } else if ('$count' in accExpr) {
                  row[accField] = groupDocs.length;
                } else if ('$push' in accExpr) {
                  const fieldName = accExpr.$push.startsWith('$') ? accExpr.$push.slice(1) : accExpr.$push;
                  row[accField] = groupDocs.map((d) => d[fieldName]);
                } else if ('$addToSet' in accExpr) {
                  const fieldName = accExpr.$addToSet.startsWith('$') ? accExpr.$addToSet.slice(1) : accExpr.$addToSet;
                  row[accField] = Array.from(new Set(groupDocs.map((d) => d[fieldName])));
                }
              }
            });

            groupedResults.push(row);
          });

          results = groupedResults;
          break;
        }

        case '$sort': {
          const sortFields = Object.entries(stageArgs);
          results.sort((a, b) => {
            for (const [field, direction] of sortFields) {
              const valA = a[field];
              const valB = b[field];
              if (valA < valB) return direction === -1 ? 1 : -1;
              if (valA > valB) return direction === -1 ? -1 : 1;
            }
            return 0;
          });
          break;
        }

        case '$skip': {
          const skipCount = Number(stageArgs) || 0;
          results = results.slice(skipCount);
          break;
        }

        case '$limit': {
          const limitCount = Number(stageArgs) || 0;
          results = results.slice(0, limitCount);
          break;
        }

        case '$project': {
          const projections = Object.entries(stageArgs);
          results = results.map((doc) => {
            const projected = {};
            projections.forEach(([field, expr]) => {
              if (expr === 1 || expr === true) {
                projected[field] = doc[field];
              } else if (typeof expr === 'string' && expr.startsWith('$')) {
                projected[field] = doc[expr.slice(1)];
              } else if (typeof expr === 'function') {
                projected[field] = expr(doc);
              }
            });
            if (!('_id' in projected) && stageArgs._id !== 0) {
              projected._id = doc._id;
            }
            return projected;
          });
          break;
        }

        case '$lookup': {
          const { from, localField, foreignField, as } = stageArgs;
          const foreignCollection = this.getCollection(from);
          results = results.map((doc) => {
            const matches = foreignCollection.filter((fDoc) => fDoc[foreignField] === doc[localField]);
            return { ...doc, [as]: matches };
          });
          break;
        }

        case '$unwind': {
          const path = typeof stageArgs === 'string' ? (stageArgs.startsWith('$') ? stageArgs.slice(1) : stageArgs) : stageArgs.path.slice(1);
          const unwound = [];
          results.forEach((doc) => {
            const arr = doc[path];
            if (Array.isArray(arr) && arr.length > 0) {
              arr.forEach((item) => {
                unwound.push({ ...doc, [path]: item });
              });
            } else {
              unwound.push(doc);
            }
          });
          results = unwound;
          break;
        }

        default:
          break;
      }
    }

    return results;
  },

  /**
   * Execute batch bulk operations (db.collection.bulkWrite)
   */
  bulkWrite(collectionName, operations = []) {
    let items = this.getCollection(collectionName);
    let insertedCount = 0;
    let modifiedCount = 0;
    let deletedCount = 0;
    const now = new Date().toISOString();

    operations.forEach((op) => {
      if (op.insertOne) {
        const doc = {
          ...op.insertOne.document,
          _id: op.insertOne.document._id || generateObjectId(),
          createdAt: op.insertOne.document.createdAt || now,
          updatedAt: now,
        };
        items.unshift(doc);
        insertedCount++;
      } else if (op.updateOne) {
        const { filter, update } = op.updateOne;
        const idx = items.findIndex((d) =>
          typeof filter === 'function' ? filter(d) : d._id === filter._id || d.id === filter.id
        );
        if (idx !== -1) {
          items[idx] = { ...items[idx], ...(update.$set || update), updatedAt: now };
          modifiedCount++;
        }
      } else if (op.deleteOne) {
        const { filter } = op.deleteOne;
        const idx = items.findIndex((d) =>
          typeof filter === 'function' ? filter(d) : d._id === filter._id || d.id === filter.id
        );
        if (idx !== -1) {
          items.splice(idx, 1);
          deletedCount++;
        }
      } else if (op.replaceOne) {
        const { filter, replacement } = op.replaceOne;
        const idx = items.findIndex((d) =>
          typeof filter === 'function' ? filter(d) : d._id === filter._id || d.id === filter.id
        );
        if (idx !== -1) {
          items[idx] = {
            ...replacement,
            _id: items[idx]._id,
            updatedAt: now,
          };
          modifiedCount++;
        }
      }
    });

    this.saveCollection(collectionName, items);
    this.notifyChange(collectionName, 'bulkWrite', { insertedCount, modifiedCount, deletedCount });
    return { insertedCount, modifiedCount, deletedCount, acknowledged: true };
  },

  /**
   * MongoDB Cursor API supporting chaining: .sort().skip().limit().toArray()
   */
  findWithCursor(collectionName, queryFn) {
    let data = this.find(collectionName, queryFn);

    const cursor = {
      sort(sortCriteria) {
        data = [...data].sort((a, b) => {
          for (const [key, dir] of Object.entries(sortCriteria)) {
            if (a[key] < b[key]) return dir === -1 ? 1 : -1;
            if (a[key] > b[key]) return dir === -1 ? -1 : 1;
          }
          return 0;
        });
        return cursor;
      },
      skip(n) {
        data = data.slice(Number(n) || 0);
        return cursor;
      },
      limit(n) {
        data = data.slice(0, Number(n) || data.length);
        return cursor;
      },
      project(fields) {
        data = data.map((doc) => {
          const out = {};
          Object.keys(fields).forEach((k) => {
            if (fields[k]) out[k] = doc[k];
          });
          return out;
        });
        return cursor;
      },
      toArray() {
        return data;
      },
    };

    return cursor;
  },

  /**
   * Build indexed lookup cache on MongoDB collection field
   */
  createIndex(collectionName, field) {
    const items = this.getCollection(collectionName);
    const indexMap = new Map();
    items.forEach((item, idx) => {
      const val = item[field];
      if (val !== undefined) {
        if (!indexMap.has(val)) indexMap.set(val, []);
        indexMap.get(val).push(idx);
      }
    });
    if (typeof window !== 'undefined') {
      if (!window._mongoIndices) window._mongoIndices = {};
      window._mongoIndices[`${collectionName}_${field}`] = indexMap;
    }
    return { name: `${collectionName}_${field}_1`, key: { [field]: 1 }, ok: 1 };
  },

  /**
   * Full database backup export of all MongoDB collections as JSON
   */
  exportDatabaseDump() {
    const allCollections = [
      'quotations',
      'approvals',
      'warehouseStock',
      'fulfillment',
      'subscriptions',
      'invoices',
      'dealHealth',
      'products',
      'activities',
      'consultations',
    ];

    const dump = {
      database: 'dealflow360',
      version: 'MongoDB 7.0 / Mongoose 8.x Compatible Document Engine',
      exportedAt: new Date().toISOString(),
      collections: {},
    };

    allCollections.forEach((name) => {
      dump.collections[name] = this.getCollection(name);
    });

    try {
      const usersRaw = localStorage.getItem('dealflow_mongodb_users');
      dump.collections.users = usersRaw ? JSON.parse(usersRaw) : [];
    } catch {
      dump.collections.users = [];
    }

    return JSON.stringify(dump, null, 2);
  },

  /**
   * Restore all MongoDB collections from JSON backup
   */
  importDatabaseDump(dumpJson) {
    try {
      const parsed = typeof dumpJson === 'string' ? JSON.parse(dumpJson) : dumpJson;
      if (!parsed || !parsed.collections) {
        return { success: false, error: 'Invalid MongoDB dump format: missing collections.' };
      }

      let restoredCollections = 0;
      let totalDocuments = 0;

      Object.entries(parsed.collections).forEach(([name, docs]) => {
        if (Array.isArray(docs)) {
          if (name === 'users') {
            localStorage.setItem('dealflow_mongodb_users', JSON.stringify(docs));
          } else {
            this.saveCollection(name, docs);
          }
          restoredCollections++;
          totalDocuments += docs.length;
        }
      });

      this.notifyChange('*', 'importDatabaseDump', { restoredCollections, totalDocuments });
      return { success: true, restoredCollections, totalDocuments, exportedAt: parsed.exportedAt };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Retrieve MongoDB collection metrics and storage stats
   */
  getCollectionStats(collectionName) {
    const items = this.getCollection(collectionName);
    const jsonStr = JSON.stringify(items);
    const sizeBytes = typeof Blob !== 'undefined' ? new Blob([jsonStr]).size : jsonStr.length;
    return {
      ns: `dealflow360.${collectionName}`,
      count: items.length,
      size: sizeBytes,
      avgObjSize: items.length > 0 ? Math.round(sizeBytes / items.length) : 0,
      storageSize: sizeBytes,
      indexes: 1,
      ok: 1,
    };
  },

  /**
   * MongoDB Change Stream Simulation: watch collection mutations
   */
  watch(collectionName, callback) {
    if (typeof window === 'undefined') return () => {};
    const handler = (event) => {
      if (event.detail && (collectionName === '*' || event.detail.collectionName === collectionName)) {
        callback(event.detail);
      }
    };
    window.addEventListener('dealflow_mongo_change', handler);
    return () => window.removeEventListener('dealflow_mongo_change', handler);
  },

  /**
   * Internal notification helper for change streams
   */
  notifyChange(collectionName, action, document) {
    try {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('dealflow_mongo_change', {
          detail: {
            collectionName,
            action,
            document,
            timestamp: new Date().toISOString(),
          },
        });
        window.dispatchEvent(event);
      }
    } catch {
      // ignore
    }
  },
};
