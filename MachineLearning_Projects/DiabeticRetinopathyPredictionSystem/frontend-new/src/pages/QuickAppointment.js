import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoctors } from '../services/api';

function QuickAppointment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    password: '',
    doctorId: '',
    reason: 'General Consultation'
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await getDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First verify patient credentials
      const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.patientEmail,
          password: formData.password,
          role: 'patient'
        })
      });

      if (!loginResponse.ok) {
        throw new Error('Invalid patient credentials');
      }

      const loginData = await loginResponse.json();
      
      // Store token temporarily
      const token = loginData.token;
      
      // Select doctor (random if not specified)
      let selectedDoctorId = formData.doctorId;
      if (!selectedDoctorId && doctors.length > 0) {
        const randomIndex = Math.floor(Math.random() * doctors.length);
        selectedDoctorId = doctors[randomIndex]._id;
      }

      // Book appointment
      const appointmentData = {
        doctorId: selectedDoctorId,
        predictionLevel: 'General',
        patientData: {
          reason: formData.reason,
          appointmentType: 'Quick Booking'
        }
      };

      await fetch('http://localhost:3001/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(appointmentData)
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      setError(err.message || 'Booking failed');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">🎉 Congratulations!</h2>
          <p className="text-lg">Your appointment has been booked successfully!</p>
          <p className="text-sm mt-2">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">📅 Book Appointment</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Patient Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              value={formData.patientName}
              onChange={(e) => setFormData({...formData, patientName: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Patient Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg"
              value={formData.patientEmail}
              onChange={(e) => setFormData({...formData, patientEmail: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select Doctor</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={formData.doctorId}
              onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
            >
              <option value="">Random Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Reason for Visit</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            >
              <option value="General Consultation">General Consultation</option>
              <option value="Eye Examination">Eye Examination</option>
              <option value="Diabetic Check-up">Diabetic Check-up</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default QuickAppointment;