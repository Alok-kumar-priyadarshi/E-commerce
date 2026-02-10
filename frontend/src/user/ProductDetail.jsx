import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6">Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-10 p-8">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <img
              src={
                product.image_url ||
                "https://via.placeholder.com/400x400?text=No+Image"
              }
              alt={product.name}
              className="w-full max-w-md rounded-lg object-cover shadow-md"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              <p className="text-gray-600 mb-6">
                {product.description || "No description available."}
              </p>

              <div className="text-2xl font-semibold text-green-600 mb-6">
                ₹ {product.price}
              </div>
            </div>

            {/* Quantity + Add To Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 border rounded hover:bg-gray-200"
                >
                  -
                </button>

                <span className="text-lg font-medium">{quantity}</span>

                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="px-4 py-2 border rounded hover:bg-gray-200"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
