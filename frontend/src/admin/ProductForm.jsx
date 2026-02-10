import { useState } from "react"

export default function ProductForm({ addProduct }) {

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name || !price) return

    addProduct({
      name,
      price: Number(price),
      description,
      image_url: imageUrl,
    })

    // Reset fields after submit
    setName("")
    setPrice("")
    setDescription("")
    setImageUrl("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow mb-8"
    >
      <h2 className="text-xl font-semibold mb-4">
        Add Product
      </h2>

      {/* Name */}
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      />

      {/* Price */}
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      />

      {/* Description */}
      <textarea
        placeholder="Product Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
        rows={3}
      />

      {/* Image URL */}
      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Product
      </button>
    </form>
  )
}
