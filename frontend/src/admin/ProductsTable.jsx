import { FiTrash } from "react-icons/fi";

export default function ProductsTable({ products, deleteProduct }) {
  // console.log(products);
  // console.log("Is array?", Array.isArray(products));

  return (
    <>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Products</h3>

        {products.length === 0 ? (
          <p>No products added</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Price</th>
                <th className="text-right py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="py-2">{product.name}</td>
                  <td className="py-2">₹ {product.price}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
