import { useEffect, useState } from "react";
import axios from '../api/axiosInstance';
import Header from '../components/Header';
import { Menu } from '@headlessui/react';

export default function AdminDonations() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [donations, setDonations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all donations
  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/blood/all");
      const data = Array.isArray(res.data) ? res.data : (res.data.data || res.data.donations || []);
      setDonations(data);
    } catch (err) {
      console.error("Failed to fetch donations", err);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // Update donation status
  const updateStatus = async (id, status) => {
    try {
      console.log('Updating donation:', id, 'to status:', status);
      const response = await axios.put(`/blood/status/${id}`, { status });
      console.log('Update response:', response.data);
      fetchDonations(); // refresh the table
    } catch (err) {
      console.error("Status update error:", err);
      console.error("Error response:", err.response?.data);
      const errorMsg = err.response?.data?.message || 'Failed to update status';
      alert(`Error: ${errorMsg}`);
    }
  };

  // Search filter
  const filtered = donations.filter((d) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      (d.donorId?.name || '').toLowerCase().includes(query) ||
      (d.bloodGroup || '').toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <Header user={user} />
      <div className="p-6">
        {/* Page Title + Search */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Blood Donations</h1>
          <div className="w-80">
            <input
              type="text"
              placeholder="Search by donor name or blood group..."
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
                <th className="text-left p-4">Donor</th>
                <th className="text-left p-4">Blood Group</th>
                <th className="text-left p-4">Units</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Donation Date</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-6 text-center">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center">No donations found</td></tr>
              ) : filtered.map((donation) => (
                <tr key={donation._id} className="border-t">
                  <td className="p-4">
                    <div className="font-medium">{donation.donorId?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{donation.donorId?.email || ''}</div>
                  </td>
                  <td className="p-4">{donation.bloodGroup}</td>
                  <td className="p-4">{donation.units}</td>

                  {/* Status */}
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      donation.status === "Approved" || donation.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : donation.status === "Rejected" || donation.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : donation.status === "Cancelled"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {donation.status || 'Pending'}
                    </span>
                  </td>

                  <td className="p-4">
                    {new Date(donation.donationDate).toLocaleDateString()}
                  </td>

                  {/* Actions Dropdown */}
                  <td className="p-4 text-right">
                    {donation.status === "Cancelled" ? (
                      <span className="text-gray-400 text-sm">User Cancelled</span>
                    ) : (
                      <div className="inline-block text-left">
                        <Menu>
                          <Menu.Button className="px-3 py-1 bg-gray-100 rounded">⋮</Menu.Button>
                          <Menu.Items className="mt-2 w-40 bg-white shadow rounded">
                            <div className="p-2">
                              <button 
                                onClick={() => updateStatus(donation._id, "Approved")}
                                className="block w-full text-left p-2 rounded hover:bg-gray-50 text-green-600"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => updateStatus(donation._id, "Rejected")}
                                className="block w-full text-left p-2 rounded hover:bg-gray-50 text-red-600"
                              >
                                Reject
                              </button>
                            </div>
                          </Menu.Items>
                        </Menu>
                      </div>
                    )}
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