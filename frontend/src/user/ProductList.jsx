import { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import api from "../api/axios"

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const limit = 6

  const fetchProducts = async () => {
    try {
      setLoading(true)

      const params = {
        page,
        limit,
      }

      if (search.trim() !== "") params.search = search
      if (sort !== "") params.sort = sort
      if (maxPrice !== "") params.max_price = maxPrice

      const response = await api.get("/products", { params })

      setProducts(response.data.items)
      setTotalPages(response.data.pages)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchProducts()
    }, 400)

    return () => clearTimeout(debounce)
  }, [search, sort, maxPrice, page])

  return (
    <div className="p-6">

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded shadow">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setPage(1)
            setSearch(e.target.value)
          }}
          className="border p-2 rounded w-60"
        />

        <select
          value={sort}
          onChange={(e) => {
            setPage(1)
            setSort(e.target.value)
          }}
          className="border p-2 rounded"
        >
          <option value="">Sort</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => {
            setPage(1)
            setMaxPrice(e.target.value)
          }}
          className="border p-2 rounded w-40"
        />
      </div>

      {loading && <div className="mb-4">Loading...</div>}

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-8 gap-2">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`px-4 py-2 border rounded ${
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
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  )
}
