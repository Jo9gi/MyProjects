import { useEffect, useState, useContext } from "react";
import axios from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";

export default function MyDonations() {
  const { user } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchDonations();
  }, [user]);

  const fetchDonations = async () => {
    if (!user || !user.id) return;
    
    try {
      const res = await axios.get(`/blood/donations/${user.id}`);
      setDonations(res.data);
    } catch (err) {
      console.error("Failed to fetch donations", err);
    }
  };

  const withdrawDonation = async (donationId) => {
    if (!window.confirm("Do you want to withdraw this donation?")) return;
    
    try {
      const res = await axios.put(`/blood/withdraw/${donationId}`);
      
      if (res.data?.success) {
        fetchDonations();
      } else {
        alert(res.data?.message || "Could not withdraw donation");
      }
    } catch (err) {
      console.error("Withdraw error", err);
      const msg = err?.response?.data?.message || "Server error while withdrawing";
      alert(msg);
    }
  };

  return (
    <div>
      <Header user={user} />
      <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Donations</h1>

      <div className="bg-white shadow rounded p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Blood Group</th>
              <th className="p-2 text-left">Units</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {donations.map((d, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{d.bloodGroup}</td>
                <td className="p-2">{d.units}</td>
                <td className="p-2">{d.donationDate?.slice(0, 10)}</td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded text-white ${
                      d.status === "Approved"
                        ? "bg-green-600"
                        : d.status === "Rejected"
                        ? "bg-red-600"
                        : d.status === "Cancelled"
                        ? "bg-gray-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="p-2">
                  {d.status === "Pending" && (
                    <button 
                      onClick={() => withdrawDonation(d._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Withdraw
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {donations.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No donations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}