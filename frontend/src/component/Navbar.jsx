import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FiShoppingCart } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  // STRICT CHECK
  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  let role = localStorage.getItem("role");

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <Link
        className="font-semibold text-lg"
        to={user?.role === "admin" ? "/admin" : "/user"}
      >
        Ecommerce App
      </Link>

      <div className="flex items-center gap-6">
        {user.role === "user" && (
          <Link to="/cart" className="relative">
            <FiShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        )}

        {user.role === "user" && (
          <Link to="/orders" className="text-blue-600 font-medium">
            Orders
          </Link>
        )}

        <span className="text-gray-600">{user.email}</span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
