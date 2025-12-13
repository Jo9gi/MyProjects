import { useState } from "react";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const RequestBlood = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bloodGroup: "",
    units: "",
    reason: "",
    hospitalName: "",
    urgency: "Normal"
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/recipient/request", form);
      const { message, stockInfo } = response.data;
      
      if (stockInfo?.isUnavailable) {
        alert(`⚠️ ${message}. Your request has been marked as unavailable.`);
      } else if (stockInfo?.isLow) {
        alert(`⚠️ ${message}. Available units: ${stockInfo.available}`);
      } else {
        alert(message);
      }
      
      navigate("/recipient/my-requests");
    } catch (err) {
      alert(err?.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Request Blood</h2>

      <form onSubmit={submitRequest} className="space-y-4">

        <div>
          <label className="block font-medium">Blood Group</label>
          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select</option>
            {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Units Required</label>
          <input
            type="number"
            name="units"
            min="1"
            value={form.units}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Hospital Name</label>
          <input
            type="text"
            name="hospitalName"
            value={form.hospitalName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Reason</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Urgency</label>
          <select
            name="urgency"
            value={form.urgency}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default RequestBlood;