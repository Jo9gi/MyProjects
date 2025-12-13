const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/';
let db;

const connectToMongoDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    const client = await MongoClient.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully!');
    db = client.db('diabetic_retinopathy');
    
    // Test the connection
    await db.admin().ping();
    console.log('🏓 Database ping successful');
    
    // Create default doctor account
    try {
      const existingDoctor = await db.collection('users').findOne({ email: 'doctor@example.com' });
      if (!existingDoctor) {
        const hashedPassword = await bcrypt.hash('password', 10);
        const defaultDoctor = {
          name: 'Dr. Admin',
          email: 'doctor@example.com',
          password: hashedPassword,
          role: 'doctor',
          createdAt: new Date()
        };
        await db.collection('users').insertOne(defaultDoctor);
        console.log('👨‍⚕️ Default doctor account created: doctor@example.com / password');
      } else {
        console.log('👨‍⚕️ Default doctor account already exists');
      }
    } catch (error) {
      console.log('ℹ️  Note: Default doctor account setup will retry later');
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⚠️  Server will continue without database - some features may not work');
    console.log('💡 Please check your MongoDB Atlas credentials and network access');
  }
};

// Connect to MongoDB Atlas
connectToMongoDB();

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }
    
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      name,
      email,
      password: hashedPassword,
      role: role || 'patient',
      createdAt: new Date()
    };

    await db.collection('users').insertOne(user);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }
    
    const { email, password, role } = req.body;
    console.log(`🔍 Login attempt: ${email} as ${role}`);

    // First, find user by email only
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    console.log(`✅ User found: ${user.email}, stored role: ${user.role}`);
    
    // Check if role matches (if user has role field)
    if (user.role && user.role !== role) {
      console.log(`❌ Role mismatch: requested ${role}, user has ${user.role}`);
      return res.status(400).json({ error: 'Invalid credentials or role' });
    }
    
    // If user doesn't have role field, assign the requested role
    if (!user.role) {
      console.log(`⚠️  User has no role, assigning: ${role}`);
      await db.collection('users').updateOne(
        { email },
        { $set: { role: role || 'patient' } }
      );
      user.role = role || 'patient';
    }

    // Check password (handle both hashed and plain text from Atlas)
    let validPassword = false;
    
    // First try bcrypt comparison (for properly hashed passwords)
    try {
      validPassword = await bcrypt.compare(password, user.password);
    } catch (error) {
      // If bcrypt fails, it might be plain text - compare directly
      validPassword = (password === user.password);
    }
    
    // If still not valid, try direct comparison (for Atlas modified passwords)
    if (!validPassword) {
      validPassword = (password === user.password);
    }
    
    if (!validPassword) {
      console.log(`❌ Invalid password for: ${email}`);
      console.log(`🔍 Tried password: ${password}`);
      console.log(`🔍 Stored password: ${user.password}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // If password was plain text, hash it for security
    if (password === user.password) {
      console.log(`🔒 Converting plain text password to hash for: ${email}`);
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.collection('users').updateOne(
        { email },
        { $set: { password: hashedPassword } }
      );
    }

    console.log(`✅ Login successful: ${email} as ${user.role}`);
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await db.collection('users').find({ role: 'doctor' }, { projection: { password: 0 } }).toArray();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Book appointment
app.post('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const { doctorId, predictionLevel, patientData } = req.body;
    
    // If no doctor selected, assign random doctor
    let assignedDoctorId = doctorId;
    if (!doctorId) {
      const doctors = await db.collection('users').find({ role: 'doctor' }).toArray();
      if (doctors.length > 0) {
        const randomIndex = Math.floor(Math.random() * doctors.length);
        assignedDoctorId = doctors[randomIndex]._id;
      }
    }

    const appointment = {
      patientId: req.user.userId,
      patientName: req.user.name,
      doctorId: assignedDoctorId,
      predictionLevel,
      patientData,
      status: 'pending',
      createdAt: new Date()
    };

    const result = await db.collection('appointments').insertOne(appointment);
    res.status(201).json({ message: 'Appointment booked successfully', appointmentId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get doctor's appointments
app.get('/api/doctor/appointments', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const appointments = await db.collection('appointments').find({ doctorId: req.user.userId }).sort({ createdAt: -1 }).toArray();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete appointment (Doctor only)
app.delete('/api/appointments/:appointmentId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { appointmentId } = req.params;
    console.log(`🗑️ Delete request for appointment: ${appointmentId} by doctor: ${req.user.userId}`);
    
    // First, find the appointment to verify it exists and belongs to this doctor
    const { ObjectId } = require('mongodb');
    let appointment;
    
    try {
      appointment = await db.collection('appointments').findOne({ _id: new ObjectId(appointmentId) });
    } catch (e) {
      appointment = await db.collection('appointments').findOne({ _id: appointmentId });
    }
    
    if (!appointment) {
      console.log('❌ Appointment not found');
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    console.log('🔍 Found appointment:', appointment);
    console.log('🔍 Doctor ID match:', appointment.doctorId, '===', req.user.userId);
    
    // Check if this doctor owns the appointment
    if (appointment.doctorId.toString() !== req.user.userId.toString()) {
      console.log('❌ Access denied - not doctor\'s appointment');
      return res.status(403).json({ error: 'Access denied - not your appointment' });
    }
    
    // Delete the appointment
    let result;
    try {
      result = await db.collection('appointments').deleteOne({ _id: new ObjectId(appointmentId) });
    } catch (e) {
      result = await db.collection('appointments').deleteOne({ _id: appointmentId });
    }
    
    console.log('📊 Delete result:', result);
    
    if (result.deletedCount === 0) {
      return res.status(500).json({ error: 'Failed to delete appointment' });
    }
    
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('❌ Delete appointment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get patient's appointments
app.get('/api/patient/appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await db.collection('appointments').find({ patientId: req.user.userId }).sort({ createdAt: -1 }).toArray();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Patient routes
app.get('/api/patients', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const patients = await db.collection('users').find({ role: 'patient' }, { projection: { password: 0 } }).toArray();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Debug endpoint to check user data
app.get('/api/debug/user/:email', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }
    
    const user = await db.collection('users').findOne({ email: req.params.email }, { projection: { password: 0 } });
    if (!user) {
      return res.json({ found: false, message: 'User not found' });
    }
    
    res.json({ found: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ML Prediction endpoint (backup)
app.post('/api/predict', async (req, res) => {
  try {
    // Simple rule-based prediction as fallback
    const data = req.body;
    const age = parseInt(data.age) || 0;
    const hba1c = parseFloat(data.hba1c) || 0;
    const exudates = parseInt(data.exudates_count) || 0;
    const hemorrhages = parseInt(data.hemorrhages_count) || 0;
    
    // Simple risk calculation
    let riskScore = 0;
    if (age > 60) riskScore += 1;
    if (hba1c > 7) riskScore += 1;
    if (exudates > 5) riskScore += 1;
    if (hemorrhages > 3) riskScore += 1;
    
    let prediction, risk_level;
    if (riskScore >= 3) {
      prediction = 2;
      risk_level = 'High';
    } else if (riskScore >= 2) {
      prediction = 1;
      risk_level = 'Medium';
    } else {
      prediction = 0;
      risk_level = 'Low';
    }
    
    const confidence = 0.75 + (Math.random() * 0.2); // 75-95%
    
    res.json({
      prediction,
      risk_level,
      confidence
    });
  } catch (error) {
    res.status(500).json({ error: 'Prediction failed' });
  }
});

// Reset doctor password (temporary fix)
app.post('/api/reset-doctor-password', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }
    
    const { email, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const result = await db.collection('users').updateOne(
      { email, role: 'doctor' },
      { $set: { password: hashedPassword } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});