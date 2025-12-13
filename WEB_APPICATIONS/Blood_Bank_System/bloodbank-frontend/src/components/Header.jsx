import { useNavigate } from "react-router-dom";

export default function Header({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{
      width: "100%",
      padding: "12px 20px",
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      background: "#f5f5f5",
      borderBottom: "1px solid #ddd"
    }}>
      <span style={{ marginRight: "20px", fontWeight: "600" }}>
        {user?.name || "User"}
      </span>

      <button
        onClick={handleLogout}
        style={{
          background: "#d9534f",
          color: "white",
          border: "none",
          padding: "8px 14px",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "500"
        }}
      >
        Logout
      </button>
    </div>
  );
}