"use client"

import React, { useState } from "react"
import { useForm } from "@inertiajs/react"
import DashboardLayout from "@/Layouts/Dashboard.jsx"
import { CircleUserRound, PlusCircle, X } from "lucide-react"

export default function Index({ suppliers }) {
    const [openCreate, setOpenCreate] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [selectedSupplier, setSelectedSupplier] = useState(null)

    const { data, setData, post, put, delete: destroy, reset } = useForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        items: [{ name: "", sku: "", price: "" }]
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

    // ---------------- Nested Items Logic ----------------
    const addItemRow = () => {
        setData("items", [...data.items, { name: "", sku: "", price: "" }])
    }

    const removeItemRow = (index) => {
        const newItems = [...data.items]
        newItems.splice(index, 1)
        setData("items", newItems)
    }

    const handleItemChange = (index, field, value) => {
        const newItems = [...data.items]
        newItems[index][field] = value
        setData("items", newItems)
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl text-gray-600 font-bold">Suppliers</h1>
                    <button
                        onClick={() => setOpenCreate(true)}
                        className="px-4 py-2 bg-black text-white rounded-xl hover:opacity-90"
                    >
                        Add Supplier
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-400">
                            <tr className="text-left text-gray-600">
                                <th className="px-6 py-4 font-medium">Supplier</th>
                                <th className="px-6 py-4 font-medium">Phone</th>
                                <th className="px-6 py-4 font-medium">Address</th>
                                <th className="px-6 py-4 text-right font-medium">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {suppliers.map((supplier) => (
                                <React.Fragment key={supplier.id}>
                                    <tr className="border last:border-l-2 border-gray-200 hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 flex items-center space-x-2">
                                            <div className="p-2 bg-gray-800 text-white rounded-full">
                                                <CircleUserRound strokeWidth={1.5} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-base text-gray-600 font-semibold">{supplier.name}</span>
                                                <span className="text-sm text-gray-400">{supplier.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{supplier.phone}</td>
                                        <td className="px-6 py-4">{supplier.address}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedSupplier(supplier)
                                                    setData({
                                                        ...supplier,
                                                        items: supplier.items.length ? supplier.items : [{ name: "", sku: "", price: "" }]
                                                    })
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

                                    {supplier.items.length > 0 && (
                                        <tr className="bg-gray-50">
                                            <td colSpan={4} className="px-6 py-2">
                                                <div className="flex flex-col space-y-2 border-l-2 border-gray-300/60 pl-4">
                                                    <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 uppercase border-b border-gray-200 pb-1">
                                                        <span>Item Name</span>
                                                        <span>SKU</span>
                                                        <span>Price</span>
                                                    </div>
                                                    {supplier.items.map((item, idx) => (
                                                        <div key={idx} className="grid grid-cols-3 gap-4 items-center text-sm text-gray-700 bg-white rounded-md px-2 py-1 hover:bg-gray-50 transition">
                                                            <span className="font-semibold">{item.name}</span>
                                                            <span>{item.sku}</span>
                                                            <span>${item.price}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {(openCreate || openEdit) && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/30">
                    <div className="bg-white p-6 rounded-2xl w-[900px] max-h-[90vh] overflow-y-auto">
                        <div className="flex flex-col mb-4">
                            <h2 className="text-lg font-semibold text-gray-600">
                                {openCreate ? "Create Supplier" : "Edit Supplier"}
                            </h2>
                            <p className="text-sm text-gray-400">
                                {openCreate ? "Fill in supplier details and items provided." : "Update supplier and items details."}
                            </p>
                        </div>

                        <form onSubmit={openCreate ? submitCreate : submitEdit} className="space-y-4">
                            {/* Supplier Info */}
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="name" className="text-gray-600 font-medium">Name</label>
                                <input
                                    id="name"
                                    className="art-input"
                                    placeholder="Dirman"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                />

                                <div className="mt-1 grid grid-cols-2 space-x-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <label htmlFor="phone" className="text-gray-600 font-medium">Phone</label>
                                        <input
                                            id="phone"
                                            className="art-input"
                                            placeholder="+628XX XXXX XXXX"
                                            value={data.phone}
                                            onChange={(e) => setData("phone", e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <label htmlFor="email" className="text-gray-600 font-medium">Email</label>
                                        <input
                                            id="email"
                                            className="art-input"
                                            placeholder="email@email.com"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <label htmlFor="address" className="text-gray-600 font-medium">Address</label>
                                <input
                                    id="address"
                                    className="art-input"
                                    placeholder="Jln. Kp. Siluman"
                                    value={data.address}
                                    onChange={(e) => setData("address", e.target.value)}
                                />
                            </div>

                            {/* Items Provided */}
                            <div className="space-y-2 mt-4">
                                <h3 className="text-gray-600 font-medium">Items Provided</h3>

                                {data.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="flex-1 flex flex-col space-y-2">
                                            <label className="text-gray-400 text-xs">Item Name</label>
                                            <input
                                                className="art-input"
                                                placeholder="Item name"
                                                value={item.name}
                                                onChange={(e) => handleItemChange(index, "name", e.target.value)}
                                            />
                                        </div>

                                        <div className="w-24 flex flex-col space-y-2">
                                            <label className="text-gray-400 text-xs">SKU</label>
                                            <input
                                                className="art-input"
                                                placeholder="SKU"
                                                value={item.sku}
                                                onChange={(e) => handleItemChange(index, "sku", e.target.value)}
                                            />
                                        </div>

                                        <div className="w-24 flex flex-col space-y-2">
                                            <label className="text-gray-400 text-xs">Price</label>
                                            <input
                                                className="art-input"
                                                placeholder="Price"
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => handleItemChange(index, "price", e.target.value)}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeItemRow(index)}
                                            className="p-1 border border-gray-300 mt-6 rounded-full text-red-500 shadow-xs hover:bg-red-50 hover:border-red-300 cursor-pointer"
                                        >
                                            <X className="art-sm-icon" />
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addItemRow}
                                    className="flex items-center text-sm px-2 py-1.5 art-button-outline"
                                >
                                    <PlusCircle className="art-sm-icon mr-1" /> Add Items
                                </button>
                            </div>

                            <div className="flex items-center justify-end mt-4 gap-2">
                                {/* Cancel Button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        openCreate ? setOpenCreate(false) : setOpenEdit(false)
                                        reset()
                                    }}
                                    className="w-1/4 bg-gray-200 text-gray-700 py-2.5 rounded-xl hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>

                                {/* Save Button */}
                                <button
                                    type="submit"
                                    className="w-1/4 bg-black text-white py-2.5 rounded-xl hover:opacity-90 transition"
                                >
                                    {openCreate ? "Save Supplier" : "Update Supplier"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}
