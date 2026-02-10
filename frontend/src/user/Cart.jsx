import { useState } from "react";
import { useCart } from "../context/CartContext";
import api from "../api/axios";
import { FiMinus, FiPlus } from "react-icons/fi";

export default function Cart() {
  const { cartItems, increment, decrement, total, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setMessage("");

      const orderPayload = {
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      await api.post("/orders/", orderPayload);

      clearCart();
      setMessage("Order placed successfully!");
    } catch (err) {
      console.log(err)
      setMessage("Checkout failed ");
    } finally {
      setLoading(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        <p>No items in cart</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {cartItems.map((item) => (
        <div
          key={item.id}
          className="bg-white p-4 mb-4 rounded shadow flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-gray-500">₹ {item.price}</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => decrement(item.id)}
              className="w-8 h-8 rounded-full border flex items-center justify-center"
            >
              <FiMinus />
            </button>

            <span className="w-8 text-center font-semibold">
              {item.quantity}
            </span>

            <button
              onClick={() => increment(item.id)}
              className="w-8 h-8 rounded-full border flex items-center justify-center"
            >
              <FiPlus />
            </button>
          </div>
        </div>
      ))}

      <div className="mt-6 text-right text-xl font-bold">Total: ₹ {total}</div>

      <div className="mt-6 text-right">
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Processing..." : "Checkout"}
        </button>
      </div>

      {message && (
        <div className="mt-4 text-green-600 font-medium">{message}</div>
      )}
    </div>
  );
}
