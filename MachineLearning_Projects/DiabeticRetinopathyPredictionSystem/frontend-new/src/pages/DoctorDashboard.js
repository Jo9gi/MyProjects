import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteAppointment } from '../services/api';

function DoctorDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'doctor') {
      navigate('/');
      return;
    }

    setUser(parsedUser);
    fetchAppointments();
  }, [navigate]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/doctor/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
    setLoading(false);
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        console.log('Deleting appointment:', appointmentId);
        const response = await deleteAppointment(appointmentId);
        console.log('Delete response:', response);
        
        // Remove from local state
        setAppointments(appointments.filter(apt => apt._id !== appointmentId));
        alert('Appointment deleted successfully!');
      } catch (error) {
        console.error('Failed to delete appointment:', error);
        console.error('Error details:', error.response?.data);
        alert(`Failed to delete appointment: ${error.response?.data?.error || error.message}`);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-xl">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
          <p className="text-gray-600">Welcome, Dr. {user?.name}</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Patient Appointments</h2>
          <p className="text-gray-600">Total appointments: {appointments.length}</p>
        </div>

        {appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">No Appointments Yet</h3>
            <p>Appointments will appear here when patients book them.</p>
          </div>
        ) : (
          <div className="divide-y">
            {appointments.map((appointment, index) => (
              <div key={appointment._id || index} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        👤 {appointment.patientName}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(appointment.predictionLevel)}`}>
                        {appointment.predictionLevel} Risk
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {appointment.status || 'Pending'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">📅 Date & Time:</span>
                        <span>{formatDate(appointment.createdAt)}</span>
                      </div>
                      
                      {appointment.patientData?.reason && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">🩺 Reason:</span>
                          <span>{appointment.patientData.reason}</span>
                        </div>
                      )}
                      
                      {appointment.patientData?.appointmentType && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">📋 Type:</span>
                          <span>{appointment.patientData.appointmentType}</span>
                        </div>
                      )}
                    </div>

                    {appointment.patientData && Object.keys(appointment.patientData).length > 2 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-2">Clinical Data:</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(appointment.patientData)
                            .filter(([key]) => !['reason', 'appointmentType'].includes(key))
                            .slice(0, 6)
                            .map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                                <span className="font-medium">{value || 'N/A'}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex gap-2">
                    <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm">
                      View Details
                    </button>
                    <button 
                      onClick={() => handleDeleteAppointment(appointment._id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;