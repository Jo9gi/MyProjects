import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Requests", path: "/admin/requests" },
    { name: "Donations", path: "/admin/donations" },
    { name: "Inventory", path: "/admin/inventory" }
  ];

  return (
    <div className="w-64 bg-red-700 text-white p-5">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

      {menu.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `block px-3 py-2 rounded mb-2 ${isActive ? "bg-red-900" : "bg-red-800"}`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </div>
  );
}