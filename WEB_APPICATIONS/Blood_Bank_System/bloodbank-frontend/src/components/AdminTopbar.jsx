export default function AdminTopbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="bg-white shadow p-4 flex justify-between">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>

      <div className="font-medium">
        {user?.name} (Admin)
      </div>
    </div>
  );
}