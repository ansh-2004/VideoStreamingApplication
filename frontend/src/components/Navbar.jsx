import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1
        className="font-bold cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        Video Platform
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm">
          {user?.email} ({user?.role})
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}