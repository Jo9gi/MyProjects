import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  if (user?.role === "Admin") {
    return (
      <div>
        <Header user={user} />
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/admin/dashboard" className="bg-blue-500 text-white p-4 rounded text-center">
            Admin Panel
          </Link>
          <Link to="/admin/users" className="bg-green-500 text-white p-4 rounded text-center">
            Manage Users
          </Link>
          <Link to="/admin/requests" className="bg-yellow-500 text-white p-4 rounded text-center">
            Manage Requests
          </Link>
          <Link to="/admin/inventory" className="bg-purple-500 text-white p-4 rounded text-center">
            Manage Inventory
          </Link>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header user={user} />
      <div className="p-6">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/donor/add-blood" className="bg-red-500 text-white p-4 rounded text-center">
            Donate Blood
          </Link>
          <Link to="/recipient/availability" className="bg-purple-500 text-white p-4 rounded text-center">
            Check Availability
          </Link>
          <Link to="/recipient/request" className="bg-blue-500 text-white p-4 rounded text-center">
            Request Blood
          </Link>
          <Link to="/donor/my-donations" className="bg-green-500 text-white p-4 rounded text-center">
            My Donations
          </Link>
          <Link to="/recipient/my-requests" className="bg-yellow-500 text-white p-4 rounded text-center">
            My Requests
          </Link>
        </div>
      </div>
    </div>
  );
}