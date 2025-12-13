require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'diabetic_retinopathy';

async function createDefaultDoctor() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db(DB_NAME);
    
    // Check if doctor already exists
    const existingDoctor = await db.collection('users').findOne({ email: 'doctor@example.com' });
    if (existingDoctor) {
      console.log('Default doctor already exists');
      await client.close();
      return;
    }
    
    // Create default doctor account
    const hashedPassword = await bcrypt.hash('password', 10);
    const defaultDoctor = {
      name: 'Dr. Admin',
      email: 'doctor@example.com',
      password: hashedPassword,
      role: 'doctor',
      createdAt: new Date()
    };
    
    await db.collection('users').insertOne(defaultDoctor);
    console.log('Default doctor account created successfully');
    console.log('Email: doctor@example.com');
    console.log('Password: password');
    
    await client.close();
  } catch (error) {
    console.error('Error creating default doctor:', error);
  }
}

createDefaultDoctor();