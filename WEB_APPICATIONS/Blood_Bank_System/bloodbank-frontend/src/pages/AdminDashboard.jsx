import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Header from '../components/Header';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeRequests, setActiveRequests] = useState(0);
  const [bloodUnits, setBloodUnits] = useState(0);
  const [unavailableTypes, setUnavailableTypes] = useState(0);
  const [systemStatus, setSystemStatus] = useState({ mongo: 'checking', api: 'checking' });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [usersRes, requestsRes, inventoryRes, healthRes] = await Promise.all([
        axiosInstance.get('/admin/users'),
        axiosInstance.get('/admin/requests'),
        axiosInstance.get('/inventory/stats'),
        axiosInstance.get('/admin/health')
      ]);

      // Handle users data
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      setTotalUsers(users.length);
      
      // Handle requests data
      const requests = Array.isArray(requestsRes.data) ? requestsRes.data : [];
      setActiveRequests(requests.filter(r => r.status === 'Pending').length);
      
      // Handle inventory data (using stats endpoint)
      const inventoryStats = inventoryRes.data?.data || {};
      const totalUnits = Object.values(inventoryStats).reduce((sum, stat) => {
        return sum + Number(stat.available || 0);
      }, 0);
      setBloodUnits(totalUnits);
      
      // Count unavailable blood types (exactly 0 units) - check all 8 blood groups
      const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
      const unavailable = BLOOD_GROUPS.filter(group => {
        const available = inventoryStats[group]?.available || 0;
        return Number(available) === 0;
      }).length;
      setUnavailableTypes(unavailable);
      
      // Handle health data
      setSystemStatus(healthRes.data || { mongo: 'online', api: 'online' });
      setLoading(false);
    } catch (err) {
      console.log('Fetch error:', err);
      setSystemStatus({ mongo: 'offline', api: 'error' });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <Header user={user} />
      <div style={{ padding: "20px" }}>
        <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all" onClick={() => navigate('/admin/users')}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">Total Users</h3>
              <p className="text-3xl font-bold">{loading ? '...' : totalUsers}</p>
            </div>
            <div className="text-4xl opacity-80">👥</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow text-white cursor-pointer hover:from-green-600 hover:to-green-700 transition-all" onClick={() => navigate('/admin/requests')}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">Active Requests</h3>
              <p className="text-3xl font-bold">{loading ? '...' : activeRequests}</p>
            </div>
            <div className="text-4xl opacity-80">📋</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg shadow text-white cursor-pointer hover:from-yellow-600 hover:to-yellow-700 transition-all" onClick={() => navigate('/admin/inventory')}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">Blood Units</h3>
              <p className="text-3xl font-bold">{loading ? '...' : bloodUnits}</p>
            </div>
            <div className="text-4xl opacity-80">🩸</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg shadow text-white cursor-pointer hover:from-red-600 hover:to-red-700 transition-all" onClick={() => navigate('/admin/inventory')}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">Unavailability</h3>
              <p className="text-3xl font-bold">{loading ? '...' : unavailableTypes}</p>
            </div>
            <div className="text-4xl opacity-80">⚠️</div>
          </div>
        </div>

      </div>

      {/* System Status */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Database</span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              systemStatus.mongo === 'online' ? 'bg-green-100 text-green-800' :
              systemStatus.mongo === 'offline' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {systemStatus.mongo === 'online' ? 'Online' :
               systemStatus.mongo === 'offline' ? 'Offline' : 'Checking...'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>API Server</span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              systemStatus.api === 'online' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {systemStatus.api === 'online' ? 'Running' : 'Error'}
            </span>
          </div>
          <button 
            onClick={fetchData}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Now
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}