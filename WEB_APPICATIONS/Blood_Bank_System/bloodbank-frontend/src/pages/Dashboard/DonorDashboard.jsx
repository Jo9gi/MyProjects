import { Link } from "react-router-dom";

export default function DonorDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Donor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Link
          to="/donor/add-blood"
          className="p-6 bg-white shadow rounded-lg hover:shadow-md transition"
        >
          <h2 className="text-xl font-medium mb-2">Add Blood Sample</h2>
          <p className="text-gray-600">Register a new blood donation.</p>
        </Link>

        <Link
          to="/donor/my-donations"
          className="p-6 bg-white shadow rounded-lg hover:shadow-md transition"
        >
          <h2 className="text-xl font-medium mb-2">My Donations</h2>
          <p className="text-gray-600">View your donated blood inventory.</p>
        </Link>

      </div>
    </div>
  );
}