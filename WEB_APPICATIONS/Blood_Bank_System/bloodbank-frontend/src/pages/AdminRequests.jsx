import { useEffect, useState } from "react";
import axios from '../api/axiosInstance';
import Header from '../components/Header';
import { Menu } from '@headlessui/react';

export default function AdminRequests() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/requests");
      const data = Array.isArray(res.data) ? res.data : (res.data.data || res.data.requests || []);
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Update request status
  const updateStatus = async (id, status) => {
    try {
      console.log('Updating request:', id, 'to status:', status);
      const response = await axios.put(`/admin/requests/${id}`, { status });
      console.log('Update response:', response.data);
      fetchRequests(); // refresh the table
    } catch (err) {
      console.error("Status update error:", err);
      console.error("Error response:", err.response?.data);
      const errorMsg = err.response?.data?.message || 'Failed to update status';
      alert(`Error: ${errorMsg}`);
    }
  };

  // Search filter
  const filtered = requests.filter((r) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      (r.recipient?.name || '').toLowerCase().includes(query) ||
      (r.bloodGroup || '').toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <Header user={user} />
      <div className="p-6">
        {/* Page Title + Search */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Blood Requests</h1>
          <div className="w-80">
            <input
              type="text"
              placeholder="Search by name or blood group..."
              className="w-full p-2 border rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Requester</th>
                <th className="text-left p-4">Blood Group</th>
                <th className="text-left p-4">Units</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-6 text-center">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center">No requests found</td></tr>
              ) : filtered.map((req) => (
                <tr key={req._id} className="border-t">
                  <td className="p-4">
                    <div className="font-medium">{req.recipient?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{req.recipient?.email || ''}</div>
                  </td>
                  <td className="p-4">{req.bloodGroup}</td>
                  <td className="p-4">{req.units}</td>

                  {/* Status */}
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      req.status === "Approved" || req.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : req.status === "Rejected" || req.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : req.status === "Unavailable"
                        ? "bg-orange-100 text-orange-700"
                        : req.status === "Fulfilled"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {req.status || 'Pending'}
                    </span>
                  </td>

                  <td className="p-4">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions Dropdown */}
                  <td className="p-4 text-right">
                    <div className="inline-block text-left">
                      <Menu>
                        <Menu.Button className="px-3 py-1 bg-gray-100 rounded">⋮</Menu.Button>
                        <Menu.Items className="mt-2 w-40 bg-white shadow rounded">
                          <div className="p-2">
                            <button 
                              onClick={() => updateStatus(req._id, "Approved")}
                              className="block w-full text-left p-2 rounded hover:bg-gray-50 text-green-600"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => updateStatus(req._id, "Rejected")}
                              className="block w-full text-left p-2 rounded hover:bg-gray-50 text-red-600"
                            >
                              Reject
                            </button>
                            <button 
                              onClick={() => updateStatus(req._id, "Unavailable")}
                              className="block w-full text-left p-2 rounded hover:bg-gray-50 text-orange-600"
                            >
                              Mark Unavailable
                            </button>
                            <button 
                              onClick={() => updateStatus(req._id, "Fulfilled")}
                              className="block w-full text-left p-2 rounded hover:bg-gray-50 text-blue-600"
                            >
                              Fulfilled
                            </button>
                          </div>
                        </Menu.Items>
                      </Menu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}