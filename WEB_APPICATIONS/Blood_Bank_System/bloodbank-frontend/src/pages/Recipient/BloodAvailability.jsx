import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function BloodAvailability() {
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const res = await axiosInstance.get("/inventory/stats");
      const stats = res.data?.data || {};
      
      const map = {};
      BLOOD_GROUPS.forEach(g => map[g] = 0);
      
      Object.keys(stats).forEach(group => {
        if (BLOOD_GROUPS.includes(group)) {
          map[group] = Math.max(0, stats[group].available || 0);
        }
      });
      
      setInventory(map);
    } catch (err) {
      console.error("Failed to load inventory", err);
      const zeroMap = {};
      BLOOD_GROUPS.forEach(g => zeroMap[g] = 0);
      setInventory(zeroMap);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    const interval = setInterval(fetchInventory, 30000);
    return () => clearInterval(interval);
  }, []);

  const getAvailabilityStatus = (units) => {
    if (units === 0) return { status: "Unavailable", color: "bg-red-100 text-red-700", icon: "❌" };
    if (units <= 10) return { status: "Low Stock", color: "bg-yellow-100 text-yellow-700", icon: "⚠️" };
    return { status: "Available", color: "bg-green-100 text-green-700", icon: "✅" };
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Blood Availability</h1>
        <button 
          onClick={fetchInventory}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-medium mb-2">📋 How to Use</h2>
        <p className="text-sm text-gray-700">
          Check blood availability before making a request. Green means good stock, yellow means low stock, and red means unavailable.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading availability...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {BLOOD_GROUPS.map(group => {
              const units = inventory[group] || 0;
              const { status, color, icon } = getAvailabilityStatus(units);
              
              return (
                <div key={group} className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold">{group}</h3>
                    <span className="text-2xl">{icon}</span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-2xl font-semibold">{units}</div>
                    <div className="text-sm text-gray-500">units available</div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm text-center ${color}`}>
                    {status}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">📊 Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {BLOOD_GROUPS.filter(g => inventory[g] > 10).length}
                </div>
                <div className="text-sm text-gray-600">Available Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {BLOOD_GROUPS.filter(g => inventory[g] > 0 && inventory[g] <= 10).length}
                </div>
                <div className="text-sm text-gray-600">Low Stock Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {BLOOD_GROUPS.filter(g => inventory[g] === 0).length}
                </div>
                <div className="text-sm text-gray-600">Unavailable Types</div>
              </div>
            </div>

            <div className="flex justify-center">
              <Link 
                to="/recipient/request"
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                🩸 Make Blood Request
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}