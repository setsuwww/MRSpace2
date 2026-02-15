import { useState } from "react"
import { useForm } from "@inertiajs/react"
import DashboardLayout from "@/Layouts/Dashboard.jsx"
import { Package, PlusCircle, Search, Edit2, Trash2, X, Tag, Barcode, DollarSign, Archive, ChevronDown, ChevronUp, MoreVertical } from "lucide-react"
import ItemsStats from "./ItemsStats"

export default function Index({ items }) {
  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  const { data, setData, post, put, delete: destroy, reset, errors } = useForm({
    name: "",
    sku: "",
    price: "",
    stock: "",
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    const direction = sortDirection === "asc" ? 1 : -1

    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * direction
    }
    return String(aValue).localeCompare(String(bValue)) * direction
  })

  const formatCurrency = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const totalValue = items.reduce((acc, item) => acc + (item.price * item.stock), 0)
  const totalItems = items.length
  const totalStock = items.reduce((acc, item) => acc + item.stock, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your products and track stock levels
            </p>
          </div>
          <button
            onClick={() => setOpenCreate(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Item
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ItemsStats
            title="Total Items"
            value={totalItems}
            icon={<Package />}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />

          <ItemsStats
            title="Total Stock"
            value={totalStock}
            icon={<Archive />}
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />

          <ItemsStats
            title="Inventory Value"
            value={formatCurrency(totalValue)}
            icon={<DollarSign />}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />

          <ItemsStats
            title="Low Stock Items"
            value={items.filter(item => item.stock < 10).length}
            icon={<Tag />}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
          />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="art-table">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="art-th"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Product
                      {sortField === "name" && (
                        sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="art-th"
                    onClick={() => handleSort("sku")}
                  >
                    <div className="flex items-center">
                      SKU
                      {sortField === "sku" && (
                        sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="art-th"
                    onClick={() => handleSort("stock")}
                  >
                    <div className="flex items-center">
                      Stock
                      {sortField === "stock" && (
                        sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="art-th"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center">
                      Price
                      {sortField === "price" && (
                        sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="art-td">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="art-td">
                      <div className="flex items-center text-sm text-gray-600">
                        <Barcode className="w-4 h-4 text-gray-400 mr-2" />
                        {item.sku}
                      </div>
                    </td>
                    <td className="art-td">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.stock === 0
                          ? 'bg-red-100 text-red-800'
                          : item.stock < 10
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                        <Archive className="w-3 h-3 mr-1" />
                        {item.stock} {item.stock === 1 ? 'unit' : 'units'}
                      </span>
                    </td>
                    <td className="art-td">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.price)}
                      </span>
                    </td>
                    <td className="art-td text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item)
                            setData({
                              name: item.name,
                              sku: item.sku,
                              price: item.price,
                              stock: item.stock,
                              description: item.description ?? "",
                            })
                            setOpenEdit(true)
                          }}
                          className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Edit item"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this item?')) {
                              destroy(`/inventory/items/${item.id}`)
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {sortedItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first inventory item.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <button
                    onClick={() => setOpenCreate(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Item
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {openCreate && (
        <Modal onClose={() => setOpenCreate(false)} title="Add New Item">
          <form onSubmit={submitCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., Wireless Mouse"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                error={errors.name}
                icon={<Package className="w-4 h-4 text-gray-400" />}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., WM-001"
                value={data.sku}
                onChange={(e) => setData("sku", e.target.value)}
                error={errors.sku}
                icon={<Barcode className="w-4 h-4 text-gray-400" />}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={data.price}
                  onChange={(e) => setData("price", e.target.value)}
                  error={errors.price}
                  icon={<DollarSign className="w-4 h-4 text-gray-400" />}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={data.stock}
                  onChange={(e) => setData("stock", e.target.value)}
                  error={errors.stock}
                  icon={<Archive className="w-4 h-4 text-gray-400" />}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Enter item description..."
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setOpenCreate(false)
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
                Create Item
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {openEdit && (
        <Modal onClose={() => setOpenEdit(false)} title="Edit Item">
          <form onSubmit={submitEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., Wireless Mouse"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                error={errors.name}
                icon={<Package className="w-4 h-4 text-gray-400" />}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500">
                <Barcode className="w-4 h-4 text-gray-400 mr-2" />
                {data.sku}
              </div>
              <p className="text-xs text-gray-500 mt-1">SKU cannot be changed</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={data.price}
                  onChange={(e) => setData("price", e.target.value)}
                  error={errors.price}
                  icon={<DollarSign className="w-4 h-4 text-gray-400" />}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={data.stock}
                  onChange={(e) => setData("stock", e.target.value)}
                  error={errors.stock}
                  icon={<Archive className="w-4 h-4 text-gray-400" />}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Enter item description..."
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setOpenEdit(false)
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
                Update Item
              </button>
            </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

function Input({ icon, error, className = "", ...props }) {
  return (
    <div>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
        <input {...props}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2 outline-none border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
