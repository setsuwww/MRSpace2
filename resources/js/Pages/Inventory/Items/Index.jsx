import { useState } from "react"
import { useForm } from "@inertiajs/react"
import DashboardLayout from "@/Layouts/Dashboard.jsx"

export default function Index({ items }) {
  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const { data, setData, post, put, delete: destroy, reset } = useForm({
    name: "",
    sku: "",
    price: "",
    description: "",
  })

  const submitCreate = (e) => {
    e.preventDefault()
    post("/inventory/items", {
      onSuccess: () => {
        reset()
        setOpenCreate(false)
      },
    })
  }

  const submitEdit = (e) => {
    e.preventDefault()
    put(`/inventory/items/${selectedItem.id}`, {
      onSuccess: () => {
        reset()
        setOpenEdit(false)
      },
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Inventory
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage products and stock levels
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpenCreate(true)}
            className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-medium shadow hover:opacity-90 active:scale-95 transition"
          >
            + Add Item
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-gray-600">
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">SKU</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {item.sku}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs font-semibold bg-gray-100 rounded-full">
                      {item.stock}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-800">
                    ${item.price}
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedItem(item)
                        setData({
                          name: item.name,
                          sku: item.sku,
                          price: item.price,
                          description: item.description ?? "",
                        })
                        setOpenEdit(true)
                      }}
                      className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => destroy(`/inventory/items/${item.id}`)}
                      className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:opacity-90"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {openCreate && (
        <Modal onClose={() => setOpenCreate(false)} title="Create Item">
          <form onSubmit={submitCreate} className="space-y-5">
            <Input
              placeholder="Name"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
            />
            <Input
              placeholder="SKU"
              value={data.sku}
              onChange={(e) => setData("sku", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Price"
              value={data.price}
              onChange={(e) => setData("price", e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-2.5 rounded-xl font-medium"
            >
              Save Item
            </button>
          </form>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {openEdit && (
        <Modal onClose={() => setOpenEdit(false)} title="Edit Item">
          <form onSubmit={submitEdit} className="space-y-5">
            <Input
              placeholder="Name"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Price"
              value={data.price}
              onChange={(e) => setData("price", e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-2.5 rounded-xl font-medium"
            >
              Update Item
            </button>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  )
}

/* ========================= */
/* REUSABLE MODAL */
/* ========================= */

function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <h2 className="text-lg font-semibold mb-6">{title}</h2>
        {children}
      </div>
    </div>
  )
}

/* ========================= */
/* REUSABLE INPUT */
/* ========================= */

function Input(props) {
  return (
    <input
      {...props}
      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
    />
  )
}
