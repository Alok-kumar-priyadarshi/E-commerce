import { useEffect, useState } from "react";
import api from "../api/axios";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/me");
        setOrders(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load Orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-6">Loading orders ...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>
        <p>No orders yet</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 && (
        <div className="bg-white p-6 rounded shadow">No orders yet</div>
      )}

      {orders.map((order) => (
        <div key={order.id} className="bg-white p-6 mb-6 rounded shadow">
          {/* Order Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="font-semibold">Order ID #{order.id}</div>
            <div className="text-green-600 font-bold">
              ₹ {order.total_amount}
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between border-b pb-3">
                <div>
                  <div className="font-medium">{item.product_name}</div>

                  <div className="text-sm text-gray-500">
                    ₹ {item.price} × {item.quantity}
                  </div>
                </div>

                <div className="font-semibold">
                  ₹ {item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="mt-4 text-right">
            <span
              className={`px-3 py-1 text-sm rounded ${
                order.status === "DELIVERED"
                  ? "bg-green-100 text-green-700"
                  : order.status === "SHIPPED"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "PACKED"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
