import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminRequests from "./pages/AdminRequests";
import AdminInventory from "./pages/Admin/AdminInventory";
import AdminDonations from "./pages/AdminDonations";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import AddBlood from "./pages/Donor/AddBlood";
import MyDonations from "./pages/Donor/MyDonations";
import RequestBlood from "./pages/Recipient/RequestBlood";
import MyRequests from "./pages/Recipient/MyRequests";
import BloodAvailability from "./pages/Recipient/BloodAvailability";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="donations" element={<AdminDonations />} />
        </Route>

        <Route path="/donor/add-blood" element={
          <ProtectedRoute>
            <AddBlood />
          </ProtectedRoute>
        } />
        <Route path="/donor/my-donations" element={
          <ProtectedRoute>
            <MyDonations />
          </ProtectedRoute>
        } />
        <Route path="/recipient/request" element={
          <ProtectedRoute>
            <RequestBlood />
          </ProtectedRoute>
        } />
        <Route path="/recipient/my-requests" element={
          <ProtectedRoute>
            <MyRequests />
          </ProtectedRoute>
        } />
        <Route path="/recipient/availability" element={
          <ProtectedRoute>
            <BloodAvailability />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
