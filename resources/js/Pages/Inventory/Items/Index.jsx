import { useState, useMemo } from "react"
import { useForm } from "@inertiajs/react"
import DashboardLayout from "@/Layouts/Dashboard.jsx"
import {
  Package,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  X,
  Tag,
  Barcode,
  DollarSign,
  Archive,
  ChevronDown,
  ChevronUp,
  FolderOutput,
  Filter,
  XCircle
} from "lucide-react"
import ItemsStats from "./ItemsStats"
import PageHeader from "@/Components/common/PageHeader"

export default function Index({ items }) {
  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const [openFilter, setOpenFilter] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")
  const [stockFilter, setStockFilter] = useState("all")
  const [sortField, setSortField] = useState("name")

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

  // Filter options dengan label yang lebih deskriptif
  const filterOptions = [
    { value: "all", label: "All", },
    { value: "low", label: "Low Stock (< 10)" },
    { value: "high", label: "High Stock (≥ 10)" },
  ]

  // Mendapatkan label filter yang aktif
  const activeFilterLabel = filterOptions.find(f => f.value === stockFilter)?.label || "All Stock"

  const filteredItems = items
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(item => {
      if (stockFilter === "low") return item.stock < 10
      if (stockFilter === "high") return item.stock >= 10
      return true
    })

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

  // Stats dengan useMemo untuk optimasi
  const stats = useMemo(() => {
    const totalValue = items.reduce((acc, item) => acc + (item.price * item.stock), 0)
    const totalItems = items.length
    const totalStock = items.reduce((acc, item) => acc + item.stock, 0)
    const lowStockItems = items.filter(item => item.stock < 10).length

    return { totalValue, totalItems, totalStock, lowStockItems }
  }, [items])

  const clearFilters = () => {
    setSearchTerm("")
    setStockFilter("all")
    setSortField("name")
    setSortDirection("asc")
  }

  const hasActiveFilters = searchTerm !== "" || stockFilter !== "all" || sortField !== "name"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Inventory"
          description="Manage your products and track stock levels"
          action={() => setOpenCreate(true)}
          actionText="Add Item"
          icon={PlusCircle}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ItemsStats
            title="Total Items"
            value={stats.totalItems}
            icon={<Package />}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />

          <ItemsStats
            title="Total Stock"
            value={stats.totalStock}
            icon={<Archive />}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <ItemsStats
            title="Inventory Value"
            value={formatCurrency(stats.totalValue)}
            icon={<DollarSign />}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />

          <ItemsStats
            title="Low Stock Items"
            value={stats.lowStockItems}
            icon={<Tag />}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <button onClick={() => setOpenFilter(!openFilter)} className={`inline-flex items-center px-4 py-2.5 border rounded-xl text-sm font-medium transition-all
                   bg-white border-gray-300 text-gray-700 hover:bg-gray-50`}
              >
                <span>Filter : <span className="text-gray-400">{activeFilterLabel}</span></span>
                <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
              </button>

              {openFilter && (
                <div className="absolute mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1">
                  {filterOptions.map((option) => {
                    return (
                      <button key={option.value} onClick={() => {
                          setStockFilter(option.value)
                          setOpenFilter(false)
                        }}
                        className={`w-full flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors
                          ${stockFilter === option.value ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}`}
                      >
                        {option.label}
                        {stockFilter === option.value && (
                          <span className="ml-auto text-xs text-indigo-600">✓</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={() => alert("Export feature coming soon")}
            className="inline-flex items-center px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
          >
            <FolderOutput className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-500">
            Showing <span className="font-medium text-gray-900">{sortedItems.length}</span> of{' '}
            <span className="font-medium text-gray-900">{items.length}</span> items
          </p>
          {hasActiveFilters && (
            <p className="text-indigo-600">
              Filtered by: {stockFilter !== "all" && `Stock: ${activeFilterLabel}`}
              {searchTerm && (stockFilter !== "all" ? " • " : "")}
              {searchTerm && `Search: "${searchTerm}"`}
            </p>
          )}
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: "name", label: "Product", icon: Package },
                    { key: "sku", label: "SKU", icon: Barcode },
                    { key: "stock", label: "Stock", icon: Archive },
                    { key: "price", label: "Price", icon: DollarSign },
                  ].map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors"
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-1">
                        <column.icon className="w-3.5 h-3.5" />
                        <span>{column.label}</span>
                        {sortField === column.key && (
                          sortDirection === "asc"
                            ? <ChevronUp className="w-4 h-4 ml-1 text-indigo-600" />
                            : <ChevronDown className="w-4 h-4 ml-1 text-indigo-600" />
                        )}
                      </div>
                    </th>
                  ))}
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Barcode className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-mono">{item.sku}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                        ${item.stock === 0
                          ? 'bg-red-100 text-red-700 ring-1 ring-red-200'
                          : item.stock < 10
                            ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
                            : 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
                        }`}>
                        <Archive className="w-3 h-3 mr-1" />
                        {item.stock} {item.stock === 1 ? 'unit' : 'units'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
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
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
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
            <div className="text-center py-16 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No items found</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                {searchTerm || stockFilter !== "all"
                  ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                  : 'Get started by adding your first inventory item.'}
              </p>
              {(searchTerm || stockFilter !== "all") ? (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear all filters
                </button>
              ) : (
                <button
                  onClick={() => setOpenCreate(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Item
                </button>
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="1000"
                  min="0"
                  placeholder="0"
                  value={data.price}
                  onChange={(e) => setData("price", e.target.value)}
                  error={errors.price}
                  icon={<DollarSign className="w-4 h-4 text-gray-400" />}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                placeholder="Enter item description..."
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setOpenCreate(false)
                  reset()
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                SKU
              </label>
              <div className="flex items-center px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-600">
                <Barcode className="w-4 h-4 text-gray-400 mr-2" />
                <span className="font-mono">{data.sku}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">SKU cannot be changed</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="1000"
                  min="0"
                  placeholder="0"
                  value={data.price}
                  onChange={(e) => setData("price", e.target.value)}
                  error={errors.price}
                  icon={<DollarSign className="w-4 h-4 text-gray-400" />}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                placeholder="Enter item description..."
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setOpenEdit(false)
                  reset()
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
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
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
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
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 outline-none border ${error ? 'border-red-300 ring-1 ring-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${className}`}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
