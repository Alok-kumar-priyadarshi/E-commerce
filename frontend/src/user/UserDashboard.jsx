import ProductList from "./ProductList"

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        Products
      </h1>

      <ProductList />
    </div>
  )
}
