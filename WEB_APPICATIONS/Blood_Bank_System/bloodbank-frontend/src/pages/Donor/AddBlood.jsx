import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function AddBlood() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    bloodGroup: "",
    units: "",
    donationDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Full user object:", user);
    console.log("All user keys:", Object.keys(user || {}));
    
    if (!user) return alert("User not logged in");
    
    const donorId = user.id;
    
    if (!donorId) return alert("Cannot find user ID");

    const data = { ...form, donorId };

    try {
      const res = await axios.post("http://localhost:5000/api/blood/add", data);

      alert(res.data.message || "Submitted");
    } catch (err) {
      console.error(err);
      alert("Error submitting");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Blood Sample</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <select
          name="bloodGroup"
          value={form.bloodGroup}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <input
          type="number"
          name="units"
          placeholder="Units"
          value={form.units}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="date"
          name="donationDate"
          value={form.donationDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}