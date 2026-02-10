import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import AdminDashboard from "../admin/AdminDashboard";
import UserDashboard from "../user/UserDashboard";
import ProtectedRoute from "../auth/ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";
import Cart from "../user/Cart";
import OrderHistory from "../user/OrderHistory";
import ProductDetail from "../user/ProductDetail"


export default function AppRouter() {
  return (
    // <BrowserRouter>

    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute allowedRole="user">
            <Cart />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute allowedRole="user">
            <OrderHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/product/:id"
        element={
          <ProtectedRoute allowedRole="user">
            <ProductDetail />
          </ProtectedRoute>
        }
      />

      <Route path="/register" element={<Register />} />
    </Routes>

    // </BrowserRouter>
  );
}
