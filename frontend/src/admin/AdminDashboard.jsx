import { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import ProductsTable from "./ProductsTable";
import api from "../api/axios";
import AdminOrders from "./AdminOrders";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      const dashboardRes = await api.get("/dashboard");
      const productsRes = await api.get("/products", {
  params: { page: 1, limit: 50 }, // get first 50 products for admin
});

      setProducts(productsRes.data.items || []);
      setStats(dashboardRes.data);
    } catch (err) {
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const addProduct = async (productData) => {
    try {
      const response = await api.post("/products", productData);
      setProducts((prev) => [...prev, response.data]);
    } catch {
      alert("Failed to create product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch {
      alert("Failed to delete product");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* ===== STATS SECTION ===== */}
      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value={`₹ ${stats.total_revenue}`}
            />

            <StatCard title="Total Orders" value={stats.total_orders} />

            <StatCard title="Total Users" value={stats.total_users} />

            <StatCard title="Total Products" value={stats.total_products} />
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-4 rounded shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

            {!stats.recent_orders || stats.recent_orders.length === 0 ? (
              <p>No recent orders</p>
            ) : (
              <div className="space-y-3">
                {stats.recent_orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between border-b pb-2"
                  >
                    <span>Order #{order.id}</span>
                    <span>₹ {order.total_amount}</span>
                    <span className="text-green-600">{order.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ===== PRODUCT MANAGEMENT ===== */}
      <ProductForm addProduct={addProduct} />

      <ProductsTable products={products} deleteProduct={deleteProduct} />

      <AdminOrders />

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-8 mt-10">
        {/* Orders by Status */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.orders_by_status}
                dataKey="count"
                nameKey="status"
                outerRadius={100}
                label
              >
                {stats.orders_by_status.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"][
                        index % 5
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Top Products</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.top_products}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_sold" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <div className="text-gray-500 text-sm mb-2">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
