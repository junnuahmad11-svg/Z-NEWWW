import { MongoClient } from 'mongodb';

let db = null;

export const connectDB = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db();
    console.log('MongoDB connected successfully');
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('templates').createIndex({ createdAt: -1 });
    await db.collection('fonts').createIndex({ category: 1 });
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) throw new Error('Database not initialized');
  return db;
};
