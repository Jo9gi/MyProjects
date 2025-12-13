import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDoctors, bookAppointment } from '../services/api';

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Get prediction data from navigation state
  const { predictionLevel, patientData } = location.state || {};

  useEffect(() => {
    if (!user.name) {
      navigate('/login');
      return;
    }
    fetchDoctors();
  }, [navigate, user.name]);

  const fetchDoctors = async () => {
    try {
      const response = await getDoctors();
      setDoctors(response.data);
    } catch (error) {
      setError('Failed to load doctors');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!predictionLevel) {
      setError('Missing prediction data. Please go back and complete the prediction first.');
      return;
    }

    // Verify password (simple check against stored user)
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser.email) {
      setError('Please login again');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const appointmentData = {
        doctorId: selectedDoctor || null,
        predictionLevel,
        patientData
      };

      await bookAppointment(appointmentData);
      setSuccess('Appointment booked successfully!');
      
      setTimeout(() => {
        navigate('/prediction');
      }, 2000);
    } catch (error) {
      setError('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!predictionLevel) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>No prediction data found. Please complete a prediction first.</p>
          <button 
            onClick={() => navigate('/prediction')}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Go to Prediction
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Book Doctor's Appointment</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Patient Name *</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg bg-gray-100"
              value={user.name}
              readOnly
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Prediction Level *</label>
            <input
              type="text"
              className={`w-full p-3 border rounded-lg ${
                predictionLevel === 'High' ? 'bg-red-100 text-red-700' :
                predictionLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}
              value={predictionLevel}
              readOnly
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select Doctor (Optional)</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="">Random Assignment</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              If no doctor is selected, one will be assigned randomly
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Confirm Password *</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password to confirm"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;