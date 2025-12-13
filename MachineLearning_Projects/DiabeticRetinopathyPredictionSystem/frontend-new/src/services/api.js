import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';
const ML_API_URL = process.env.NODE_ENV === 'development' ? '' : 'http://localhost:6000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const login = (credentials) => api.post('/auth/login', credentials);
export const signup = (userData) => api.post('/auth/signup', userData);

// Patient endpoints
export const getPatients = () => api.get('/patients');

// Doctor endpoints
export const getDoctors = () => api.get('/doctors');
export const getDoctorAppointments = () => api.get('/doctor/appointments');

// Appointment endpoints
export const bookAppointment = (appointmentData) => api.post('/appointments', appointmentData);
export const getPatientAppointments = () => api.get('/patient/appointments');
export const deleteAppointment = (appointmentId) => api.delete(`/appointments/${appointmentId}`);

// ML prediction endpoint with fallback
export const predict = async (data) => {
  try {
    // Try Flask ML backend first
    const url = ML_API_URL ? `${ML_API_URL}/predict` : '/predict';
    return await axios.post(url, data);
  } catch (error) {
    console.log('Flask ML backend failed, trying Node.js fallback...');
    // Fallback to Node.js simple prediction
    return await api.post('/predict', data);
  }
};