"use client"

import { useState } from "react"
import { useForm } from "@inertiajs/react"
import DashboardLayout from "@/Layouts/Dashboard.jsx"

export default function Index({ suppliers }) {
  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)

  const { data, setData, post, put, delete: destroy, reset } = useForm({
    name: "",
    phone: "",
    email: "",
    address: "",
  })

  const submitCreate = (e) => {
    e.preventDefault()
    post("/inventory/suppliers", {
      onSuccess: () => {
        reset()
        setOpenCreate(false)
      }
    })
  }

  const submitEdit = (e) => {
    e.preventDefault()
    put(`/inventory/suppliers/${selectedSupplier.id}`, {
      onSuccess: () => {
        reset()
        setOpenEdit(false)
      }
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <button
            onClick={() => setOpenCreate(true)}
            className="px-5 py-2.5 bg-black text-white rounded-xl hover:opacity-90"
          >
            + Add Supplier
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-600">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Address</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {suppliers.map(supplier => (
                <tr key={supplier.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{supplier.name}</td>
                  <td className="px-6 py-4">{supplier.phone}</td>
                  <td className="px-6 py-4">{supplier.email}</td>
                  <td className="px-6 py-4">{supplier.address}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedSupplier(supplier)
                        setData(supplier)
                        setOpenEdit(true)
                      }}
                      className="px-3 py-1.5 border rounded-lg text-xs hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => destroy(`/inventory/suppliers/${supplier.id}`)}
                      className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs hover:opacity-90"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded-2xl w-96">
            <h2 className="text-lg font-semibold mb-4">Create Supplier</h2>
            <form onSubmit={submitCreate} className="space-y-4">
              <input
                className="w-full border px-4 py-2 rounded-xl"
                placeholder="Name"
                value={data.name}
                onChange={e => setData("name", e.target.value)}
              />
              <input
                className="w-full border px-4 py-2 rounded-xl"
                placeholder="Phone"
                value={data.phone}
                onChange={e => setData("phone", e.target.value)}
              />
              <input
                className="w-full border px-4 py-2 rounded-xl"
                placeholder="Email"
                value={data.email}
                onChange={e => setData("email", e.target.value)}
              />
              <input
                className="w-full border px-4 py-2 rounded-xl"
                placeholder="Address"
                value={data.address}
                onChange={e => setData("address", e.target.value)}
              />
              <button type="submit" className="w-full bg-black text-white py-2.5 rounded-xl">Save</button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {openEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded-2xl w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Supplier</h2>
            <form onSubmit={submitEdit} className="space-y-4">
              <input
                className="w-full border px-4 py-2 rounded-xl"
                placeholder="Name"
                value={data.name}
                onChange={e => setData("name", e.target.value)}
              />
              <input
                className="w-full border px-4 py-2 rounded-xl"
                placeholder="Phone"
                value={data.phone}
                onChange={e => setData("phone", e.target.value)}
              />
              <input
                className="w-full border px-4 py-2 rounded-xl"
                placeholder="Email"
                value={data.email}
                onChange={e => setData("email", e.target.value)}
              />
              <input
                className="w-full border px-4 py-2 rounded-xl"
                placeholder="Address"
                value={data.address}
                onChange={e => setData("address", e.target.value)}
              />
              <button type="submit" className="w-full bg-black text-white py-2.5 rounded-xl">Update</button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
