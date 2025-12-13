import { Link } from "react-router-dom";

export default function RecipientDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Recipient Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Link
          to="/recipient/request"
          className="p-6 bg-white shadow rounded-lg hover:shadow-md transition"
        >
          <h2 className="text-xl font-medium mb-2">Request Blood</h2>
          <p className="text-gray-600">Submit a new blood request.</p>
        </Link>

        <Link
          to="/recipient/my-requests"
          className="p-6 bg-white shadow rounded-lg hover:shadow-md transition"
        >
          <h2 className="text-xl font-medium mb-2">My Requests</h2>
          <p className="text-gray-600">Track your requests status.</p>
        </Link>

        <Link
          to="/recipient/availability"
          className="p-6 bg-white shadow rounded-lg hover:shadow-md transition"
        >
          <h2 className="text-xl font-medium mb-2">Blood Availability</h2>
          <p className="text-gray-600">Check current blood stock levels.</p>
        </Link>

      </div>
    </div>
  );
}