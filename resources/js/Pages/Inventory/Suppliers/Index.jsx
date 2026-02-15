"use client"

import React, { useState } from "react"
import { useForm } from "@inertiajs/react"
import DashboardLayout from "@/Layouts/Dashboard.jsx"
import {
  CircleUserRound,
  PlusCircle,
  X,
  Phone,
  MapPin,
  Package,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight
} from "lucide-react"

export default function Index({ suppliers }) {
    const [openCreate, setOpenCreate] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [selectedSupplier, setSelectedSupplier] = useState(null)
    const [expandedRows, setExpandedRows] = useState([])

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

    const toggleRow = (supplierId) => {
        setExpandedRows(prev =>
            prev.includes(supplierId)
                ? prev.filter(id => id !== supplierId)
                : [...prev, supplierId]
        )
    }

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

    const formatCurrency = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(price)
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Suppliers</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage your suppliers and their provided items
                        </p>
                    </div>
                    <button
                        onClick={() => setOpenCreate(true)}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Supplier
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Package className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-gray-500">Total Suppliers</p>
                                <p className="text-xl font-semibold text-gray-900">{suppliers.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <Package className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-gray-500">Active Items</p>
                                <p className="text-xl font-semibold text-gray-900">
                                    {suppliers.reduce((acc, s) => acc + s.items.length, 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Package className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-gray-500">Avg Items/Supplier</p>
                                <p className="text-xl font-semibold text-gray-900">
                                    {(suppliers.reduce((acc, s) => acc + s.items.length, 0) / suppliers.length || 0).toFixed(1)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Supplier
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Address
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {suppliers.map((supplier) => (
                                    <React.Fragment key={supplier.id}>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => toggleRow(supplier.id)}
                                                        className="mr-2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {expandedRows.includes(supplier.id) ? (
                                                            <ChevronDown className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronRight className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                                        <CircleUserRound className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {supplier.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {supplier.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                                    {supplier.phone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-start text-sm text-gray-900">
                                                    <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                                                    <span className="line-clamp-2">{supplier.address}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                    {supplier.items.length} items
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedSupplier(supplier)
                                                            setData({
                                                                ...supplier,
                                                                items: supplier.items.length ? supplier.items : [{ name: "", sku: "", price: "" }]
                                                            })
                                                            setOpenEdit(true)
                                                        }}
                                                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                                        title="Edit supplier"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this supplier?')) {
                                                                destroy(`/inventory/suppliers/${supplier.id}`)
                                                            }
                                                        }}
                                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                        title="Delete supplier"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Expanded Items Row */}
                                        {expandedRows.includes(supplier.id) && supplier.items.length > 0 && (
                                            <tr className="bg-gray-50">
                                                <td colSpan={5} className="px-6 py-4">
                                                    <div className="ml-6">
                                                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                                                            Items Provided by
                                                        </h4>
                                                        <div className="rounded-l-lg border-l-2 border-gray-300 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                                            {supplier.items.map((item, idx) => (
                                                                <div key={idx} className="bg-gray-200/40 rounded-lg border border-gray-200 p-3 hover:border-gray-400 transition-border">
                                                                    <div className="flex justify-between items-start">
                                                                        <div>
                                                                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                                            <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
                                                                        </div>
                                                                        <span className="text-sm font-semibold text-yellow-600">
                                                                            {formatCurrency(item.price)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {suppliers.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No suppliers</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by adding your first supplier.</p>
                            <div className="mt-6">
                                <button
                                    onClick={() => setOpenCreate(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    Add Supplier
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal (keep your existing modal code but you can enhance it similarly) */}
            {(openCreate || openEdit) && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/30">
                    <div className="bg-white p-6 rounded-xl w-[900px] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {openCreate ? "Add New Supplier" : "Edit Supplier"}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {openCreate ? "Fill in supplier details and items provided." : "Update supplier and items details."}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    openCreate ? setOpenCreate(false) : setOpenEdit(false)
                                    reset()
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={openCreate ? submitCreate : submitEdit} className="space-y-6">
                            {/* Supplier Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-700">Supplier Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Enter supplier name"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone
                                        </label>
                                        <input
                                            id="phone"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="+62 812-3456-7890"
                                            value={data.phone}
                                            onChange={(e) => setData("phone", e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="supplier@example.com"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                            Address
                                        </label>
                                        <textarea
                                            id="address"
                                            rows="2"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Enter full address"
                                            value={data.address}
                                            onChange={(e) => setData("address", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Items Provided */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-medium text-gray-700">Items Provided</h3>
                                    <button
                                        type="button"
                                        onClick={addItemRow}
                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-50"
                                    >
                                        <PlusCircle className="w-4 h-4 mr-1" /> Add Item
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {data.items.map((item, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1 grid grid-cols-3 gap-3">
                                                <div className="col-span-1">
                                                    <label className="block text-xs text-gray-500 mb-1">Item Name</label>
                                                    <input
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                        placeholder="Product name"
                                                        value={item.name}
                                                        onChange={(e) => handleItemChange(index, "name", e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <label className="block text-xs text-gray-500 mb-1">SKU</label>
                                                    <input
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                        placeholder="SKU-001"
                                                        value={item.sku}
                                                        onChange={(e) => handleItemChange(index, "sku", e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <label className="block text-xs text-gray-500 mb-1">Price</label>
                                                    <input
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                        placeholder="0.00"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={item.price}
                                                        onChange={(e) => handleItemChange(index, "price", e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            {data.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItemRow(index)}
                                                    className="mt-6 p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        openCreate ? setOpenCreate(false) : setOpenEdit(false)
                                        reset()
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {openCreate ? "Create Supplier" : "Update Supplier"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}
