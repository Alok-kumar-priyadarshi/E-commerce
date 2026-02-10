import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  return (
    <>
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image_url || "https://picsum.photos/id/237/200/300"}
          alt={product.name}
          className="w-full h-48 object-cover rounded mb-3"
        />
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>

          <p className="text-gray-600 mb-2">₹ {product.price}</p>

          <button
            onClick={() => addToCart(product)}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </Link>
    </>
  );
}
