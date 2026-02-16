"use client"

import React, { useState } from "react"
import { useForm } from "@inertiajs/react"
import DashboardLayout from "@/Layouts/Dashboard.jsx"
import { CircleUserRound, PlusCircle, X, Phone, MapPin, Package, Edit2, Trash2, ChevronDown, ChevronRight, TrendingDown, TrendingUp, ShoppingCart, CheckCircle, Clock, AlertCircle, DollarSign, BarChart3 } from "lucide-react"
import PageHeader from "@/Components/common/PageHeader"
import ItemsStats from "../Items/ItemsStats"

export default function Index({ suppliers, purchaseRequests = [] }) {
  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openRequest, setOpenRequest] = useState(false)
  const [openAddItem, setOpenAddItem] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [expandedRows, setExpandedRows] = useState([])
  const [activeTab, setActiveTab] = useState("suppliers")

  const { data, setData, post, put, delete: destroy, reset } = useForm({
    name: "", phone: "", email: "", address: "",
    items: [{ name: "", sku: "", selling_price: "", cost_price: "", stock: 0 }]
  })

  const { data: requestData, setData: setRequestData, post: postRequest, reset: resetRequest } = useForm({
    supplier_id: "", item_id: "", quantity: 1, notes: ""
  })

  const { data: newItemData, setData: setNewItemData, post: postNewItem, reset: resetNewItem } = useForm({
    name: "", sku: "", selling_price: "", cost_price: "", stock: 0, supplier_id: ""
  })

  const submitCreate = (e) => {
    e.preventDefault()

    const invalidItems = data.items.filter(item =>
      item.selling_price && item.cost_price && parseFloat(item.selling_price) < parseFloat(item.cost_price)
    )

    if (invalidItems.length > 0) {
      alert("Selling price cannot be less than cost price for some items")
      return
    }

    post("/inventory/suppliers", {
      onSuccess: () => {
        reset()
        setOpenCreate(false)
      }
    })
  }

  const submitEdit = (e) => {
    e.preventDefault()

    const invalidItems = data.items.filter(item =>
      item.selling_price && item.cost_price && parseFloat(item.selling_price) < parseFloat(item.cost_price)
    )

    if (invalidItems.length > 0) {
      alert("Selling price cannot be less than cost price for some items")
      return
    }

    put(`/inventory/suppliers/${selectedSupplier.id}`, {
      onSuccess: () => {
        reset()
        setOpenEdit(false)
      }
    })
  }

  const submitPurchaseRequest = (e) => {
    e.preventDefault()
    postRequest("/inventory/purchase-requests", {
      onSuccess: () => {
        resetRequest()
        setOpenRequest(false)
        setSelectedSupplier(null)
        setSelectedItem(null)
      }
    })
  }

  const submitAddItem = (e) => {
    e.preventDefault()

    const cost = Number(newItemData.cost_price)
    const price = Number(newItemData.selling_price)
    const stock = Number(newItemData.stock) || 0

    if (price && cost && price < cost) {
      alert("Selling price cannot be less than cost price")
      return
    }

    postNewItem("/inventory/items", {
      data: {
        name: newItemData.name,
        sku: newItemData.sku,
        supplier_id: newItemData.supplier_id,
        cost_price: cost,
        selling_price: price,
        stock: stock
      },
      onSuccess: () => {
        resetNewItem()
        setOpenAddItem(false)
        setSelectedSupplier(null)
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
    setData("items", [...data.items, { name: "", sku: "", selling_price: "", cost_price: "", stock: 0 }])
  }

  const removeItemRow = (index) => {
    const newItems = [...data.items]
    newItems.splice(index, 1)
    setData("items", newItems)
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...data.items]
    newItems[index][field] = value

    // Validasi harga jual tidak boleh kurang dari harga beli
    if (field === "selling_price" || field === "cost_price") {
      const price = field === "selling_price" ? parseFloat(value) : parseFloat(newItems[index].selling_price)
      const costPrice = field === "cost_price" ? parseFloat(value) : parseFloat(newItems[index].cost_price)

      if (price && costPrice && price < costPrice) {
        alert("Warning: Selling price is less than cost price!")
      }
    }

    setData("items", newItems)
  }

  const handleRequestItemChange = (index, field, value) => {
    // Implementation for request item change
  }

  const totalSuppliers = suppliers.length
  const allItems = suppliers.flatMap(s => s.items)
  const totalItems = allItems.length

  const pendingRequests = purchaseRequests.filter(pr => pr.status === "pending").length
  const approvedRequests = purchaseRequests.filter(pr => pr.status === "approved").length
  const totalRequestValue = purchaseRequests
    .filter(pr => pr.status === "approved")
    .reduce((acc, pr) => acc + (pr.quantity * pr.item.cost_price), 0)

  const cheapestItem = allItems.length
    ? allItems.reduce((min, item) => item.cost_price < min.cost_price ? item : min, allItems[0])
    : null

  const expensiveItem = allItems.length
    ? allItems.reduce((max, item) => item.cost_price > max.cost_price ? item : max, allItems[0])
    : null

  const formatCurrency = (cost_price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(cost_price)
  }

  const calculateProfit = (selling_price, costPrice) => {
    if (!selling_price || !costPrice) return null
    const profit = selling_price - costPrice
    const margin = (profit / costPrice) * 100
    return { profit, margin }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Suppliers & Purchase Requests"
          description="Manage suppliers, track items, and handle purchase requests"
          action={() => setOpenCreate(true)}
          actionText="Add Supplier"
          icon={PlusCircle}
        />

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab("suppliers")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "suppliers"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Suppliers
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "requests"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Purchase Requests
              {pendingRequests > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                  {pendingRequests} pending
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Stats Cards - Different based on active tab */}
        {activeTab === "suppliers" ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ItemsStats
              title="Total Suppliers"
              value={totalSuppliers}
              icon={<CircleUserRound className="w-5 h-5" />}
              iconBg="bg-indigo-50"
              iconColor="text-indigo-600"
            />

            <ItemsStats
              title="Total Items"
              value={totalItems}
              icon={<Package className="w-5 h-5" />}
              iconBg="bg-green-50"
              iconColor="text-green-600"
            />

            <ItemsStats
              title="Cheapest Item"
              value={cheapestItem ? formatCurrency(cheapestItem.price) : "-"}
              icon={<TrendingDown className="w-5 h-5" />}
              iconBg="bg-red-50"
              iconColor="text-red-600"
            />

            <ItemsStats
              title="Expensive Item"
              value={expensiveItem ? formatCurrency(expensiveItem.price) : "-"}
              icon={<TrendingUp className="w-5 h-5" />}
              iconBg="bg-green-100/50"
              iconColor="text-green-600"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ItemsStats
              title="Pending Requests"
              value={pendingRequests}
              icon={<Clock className="w-5 h-5" />}
              iconBg="bg-yellow-50"
              iconColor="text-yellow-600"
            />

            <ItemsStats
              title="Approved Requests"
              value={approvedRequests}
              icon={<CheckCircle className="w-5 h-5" />}
              iconBg="bg-green-50"
              iconColor="text-green-600"
            />

            <ItemsStats
              title="Total Request Value"
              value={formatCurrency(totalRequestValue)}
              icon={<DollarSign className="w-5 h-5" />}
              iconBg="bg-purple-50"
              iconColor="text-purple-600"
            />

            <ItemsStats
              title="Avg. Profit Margin"
              value="32%"
              icon={<BarChart3 className="w-5 h-5" />}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
            />
          </div>
        )}

        {/* Suppliers Table */}
        {activeTab === "suppliers" && (
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
                            <button onClick={() => toggleRow(supplier.id)} className="mr-2 text-gray-400 hover:text-gray-600">
                              {expandedRows.includes(supplier.id)
                                ? (<ChevronDown className="w-4 h-4" />)
                                : (<ChevronRight className="w-4 h-4" />)
                              }
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
                                setOpenRequest(true)
                              }}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="Request Item"
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedSupplier(supplier)
                                setData({
                                  name: supplier.name || "",
                                  phone: supplier.phone || "",
                                  email: supplier.email || "",
                                  address: supplier.address || "",
                                  items: supplier.items.length
                                    ? supplier.items.map(item => ({
                                      name: item.name,
                                      sku: item.sku,
                                      selling_price: item.selling_price,
                                      cost_price: item.cost_price,
                                      stock: item.stock || 0
                                    }))
                                    : [{ name: "", sku: "", selling_price: "", cost_price: "", stock: 0 }]
                                })
                                setOpenEdit(true)
                              }} className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
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

                      {expandedRows.includes(supplier.id) && (
                        <tr className="bg-gray-50">
                          <td colSpan={5} className="px-6 py-4">
                            <div className="ml-6">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Items Provided by {supplier.name}
                                </h4>
                                <button
                                  onClick={() => {
                                    setSelectedSupplier(supplier)
                                    setNewItemData({
                                      name: "",
                                      sku: "",
                                      selling_price: "",
                                      cost_price: "",
                                      stock: 0,
                                      supplier_id: supplier.id
                                    })
                                    setOpenAddItem(true)
                                  }}
                                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-50"
                                >
                                  <PlusCircle className="w-3 h-3 mr-1" />
                                  Add Item
                                </button>
                              </div>

                              {supplier.items.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                  {supplier.items.map((item, idx) => {
                                    const profit = calculateProfit(item.price, item.cost_price)
                                    return (
                                      <div key={idx} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                          <div>
                                            <p className="text-md font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                                          </div>
                                          <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                            Stock : {item.stock || 0}
                                          </span>
                                        </div>

                                        <div className="gap-2 text-xs mb-2">
                                          <div>
                                            <span className="text-gray-500">Cost:</span>
                                            <span className="ml-1 font-medium text-gray-700">
                                              {formatCurrency(item.cost_price || 0)}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-gray-500">Sell:</span>
                                            <span className="ml-1 font-medium text-yellow-600">
                                              {formatCurrency(item.selling_price)}
                                            </span>
                                          </div>
                                        </div>

                                        {profit && (
                                          <div className="mt-2 pt-2 border-t border-gray-100">
                                            <div className="flex justify-between text-xs">
                                              <span className="text-gray-500">Profit:</span>
                                              <span className="font-medium text-green-600">
                                                {formatCurrency(profit.profit)} ({profit.margin.toFixed(1)}%)
                                              </span>
                                            </div>
                                          </div>
                                        )}

                                        <div className="mt-4 flex justify-start">
                                          <button
                                            onClick={() => {
                                              setSelectedSupplier(supplier)
                                              setSelectedItem(item)
                                              setRequestData({
                                                supplier_id: supplier.id,
                                                item_id: item.id,
                                                quantity: 1,
                                                notes: ""
                                              })
                                              setOpenRequest(true)
                                            }}
                                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                                          >
                                            <ShoppingCart className="w-3 h-3 mr-1" />
                                            Request
                                          </button>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 italic">No items available</p>
                              )}
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
        )}

        {/* Purchase Requests Table */}
        {activeTab === "requests" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchaseRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                        #{request.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {request.supplier.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.item.name}</div>
                        <div className="text-xs text-gray-500">{request.item.sku}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(request.quantity * request.item.cost_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'}`}>
                          {request.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {request.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {request.status === 'rejected' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {request.status === 'pending' && (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => post(`/inventory/purchase-requests/${request.id}/approve`)}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => post(`/inventory/purchase-requests/${request.id}/reject`)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {purchaseRequests.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No purchase requests</h3>
                <p className="mt-1 text-sm text-gray-500">Requests will appear here when created.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Purchase Request Modal */}
      {openRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Request Item</h2>
              <button
                onClick={() => {
                  setOpenRequest(false)
                  setSelectedSupplier(null)
                  setSelectedItem(null)
                  resetRequest()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitPurchaseRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Supplier
                </label>
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                  {selectedSupplier?.name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Item
                </label>
                <select
                  value={requestData.item_id}
                  onChange={(e) => setRequestData("item_id", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select item</option>
                  {selectedSupplier?.items.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} - {formatCurrency(item.cost_price || 0)}/unit
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={requestData.quantity}
                  onChange={(e) => setRequestData("quantity", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Notes
                </label>
                <textarea
                  value={requestData.notes}
                  onChange={(e) => setRequestData("notes", e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add any notes..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setOpenRequest(false)
                    setSelectedSupplier(null)
                    setSelectedItem(null)
                    resetRequest()
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {openAddItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add New Item to {selectedSupplier?.name}</h2>
              <button
                onClick={() => {
                  setOpenAddItem(false)
                  setSelectedSupplier(null)
                  resetNewItem()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitAddItem} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={newItemData.name}
                  onChange={(e) => setNewItemData("name", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  value={newItemData.sku}
                  onChange={(e) => setNewItemData("sku", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="SKU-001"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Cost Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={newItemData.cost_price}
                    onChange={(e) => setNewItemData("cost_price", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Selling Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="1000"
                    min={newItemData.selling_price || 0}
                    value={newItemData.selling_price}
                    onChange={(e) => setNewItemData("selling_price", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Initial Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={newItemData.stock}
                  onChange={(e) => setNewItemData("stock", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setOpenAddItem(false)
                    setSelectedSupplier(null)
                    resetNewItem()
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create/Edit Supplier Modal - Keep existing but add cost_price field */}
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
                      <div className="flex-1 grid grid-cols-4 gap-3">
                        <div className="col-span-1">
                          <label className="block text-xs text-gray-500 mb-1">Item Name</label>
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Product name"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, "name", e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-xs text-gray-500 mb-1">SKU</label>
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="SKU-001"
                            value={item.sku}
                            onChange={(e) => handleItemChange(index, "sku", e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-xs text-gray-500 mb-1">Selling Price</label>
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="0"
                            type="number"
                            step="1000"
                            min="0"
                            value={item.cost_price}
                            onChange={(e) => handleItemChange(index, "cost_price", Number(e.target.value))}
                            required
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-xs text-gray-500 mb-1">Cost Price</label>
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="0"
                            type="number"
                            step="1000"
                            min={item.cost_price || 0}
                            value={item.selling_price}
                            onChange={(e) => handleItemChange(index, "selling_price", Number(e.target.value))}
                            required
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
