import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import Header from "../../components/Header";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/recipient/my-requests");
      const data = Array.isArray(res.data) ? res.data : (res.data.data || res.data.requests || []);
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      Pending: "bg-yellow-200 text-yellow-700",
      Approved: "bg-green-200 text-green-700",
      Rejected: "bg-red-200 text-red-700",
      Fulfilled: "bg-blue-200 text-blue-700",
      Cancelled: "bg-gray-300 text-gray-700",
      Unavailable: "bg-orange-200 text-orange-700"
    };
    return colors[status] || "bg-gray-200 text-gray-700";
  };

  const cancelRequest = async (requestId) => {
    if (!window.confirm("Do you want to cancel this request?")) return;
    
    try {
      const res = await axios.put(`/recipient/cancel/${requestId}`);
      
      if (res.data?.success) {
        fetchRequests();
      } else {
        alert(res.data?.message || "Could not cancel request");
      }
    } catch (err) {
      console.error("Cancel error", err);
      const msg = err?.response?.data?.message || "Server error while cancelling";
      alert(msg);
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <Header user={user} />
      <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">My Blood Requests</h1>
        <button 
          onClick={fetchRequests} 
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Request ID</th>
            <th className="p-2">Blood Group</th>
            <th className="p-2">Units</th>
            <th className="p-2">Purpose</th>
            <th className="p-2">Status</th>
            <th className="p-2">Requested Date</th>
            <th className="p-2">Updated Date</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr><td colSpan="8" className="text-center p-4">Loading...</td></tr>
          ) : requests.map((req, i) => (
            <tr key={req._id} className="border-b">
              <td className="p-2">{req._id?.slice(-6) || i + 1}</td>
              <td className="p-2">{req.bloodGroup}</td>
              <td className="p-2">{req.units}</td>
              <td className="p-2">{req.reason || "-"}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded ${getStatusBadge(req.status)}`}>
                  {req.status}
                </span>
              </td>
              <td className="p-2">{new Date(req.createdAt).toLocaleDateString()}</td>
              <td className="p-2">{new Date(req.updatedAt).toLocaleDateString()}</td>
              <td className="p-2">
                {req.status === "Pending" && (
                  <button 
                    onClick={() => cancelRequest(req._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
          {!loading && requests.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center p-4">
                No requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}