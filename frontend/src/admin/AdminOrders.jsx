import { useEffect, useState } from "react"
import api from "../api/axios"

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const limit = 5

  const fetchOrders = async () => {
    const response = await api.get("/orders/all", {
      params: { page, limit },
    })

    setOrders(response.data.items)
    setTotalPages(response.data.pages)
  }

  useEffect(() => {
    fetchOrders()
  }, [page])

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, null, {
      params: { new_status: status },
    })
    fetchOrders()
  }

  return (
    <div className="bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-semibold mb-4">
        Manage Orders
      </h2>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map((order) => (
        <div
          key={order.id}
          className="border-b pb-3 mb-3 flex justify-between items-center"
        >
          <div>
            <div>Order #{order.id}</div>
            <div className="text-sm text-gray-500">
              ₹ {order.total_amount}
            </div>
          </div>

          <select
            value={order.status}
            onChange={(e) =>
              updateStatus(order.id, e.target.value)
            }
            className="border p-2 rounded"
          >
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="PACKED">PACKED</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-2">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`px-3 py-1 border rounded ${
              page === index + 1
                ? "bg-blue-600 text-white"
                : ""
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </div>
  )
}
