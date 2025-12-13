require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/';
const DB_NAME = 'diabetic_retinopathy';

async function setupDatabase() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    
    const db = client.db(DB_NAME);
    
    // Create collections
    await db.createCollection('users');
    await db.createCollection('predictions');
    await db.createCollection('patients');
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('predictions').createIndex({ timestamp: 1 });
    
    // Insert default doctor account
    const defaultDoctor = {
      name: 'Dr. Admin',
      email: 'doctor@example.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      role: 'doctor',
      createdAt: new Date()
    };
    
    await db.collection('users').insertOne(defaultDoctor);
    
    console.log('Database setup completed successfully');
    await client.close();
  } catch (error) {
    console.error('Database setup error:', error);
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };