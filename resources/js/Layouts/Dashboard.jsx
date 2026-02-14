import { useState } from "react"
import { Link } from "@inertiajs/react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo + toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className={`font-bold text-lg ${sidebarOpen ? "" : "hidden"}`}>
            MyApp
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "⏴" : "⏵"}
          </Button>
        </div>

        {/* Sidebar nav */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
            href="/dashboard"
            className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
          >
            {sidebarOpen ? "Dashboard" : "D"}
          </Link>

          {/* Inventory collapsible */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <button
                className="w-full flex justify-between items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
              >
                <span>{sidebarOpen ? "Inventory" : "I"}</span>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-4 mt-1 space-y-1">
                <Link href="/inventory/items" className="block px-2 py-1 rounded-md hover:bg-gray-100 text-gray-600">
                  Items
                </Link>
                <Link href="/inventory/suppliers" className="block px-2 py-1 rounded-md hover:bg-gray-100 text-gray-600">
                  Suppliers
                </Link>
                <Link href="/inventory/customers" className="block px-2 py-1 rounded-md hover:bg-gray-100 text-gray-600">
                  Customers
                </Link>
                <Link href="/inventory/invoices" className="block px-2 py-1 rounded-md hover:bg-gray-100 text-gray-600">
                  Invoices
                </Link>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Stocks collapsible */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <button
                className="w-full flex justify-between items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 mt-2"
              >
                <span>{sidebarOpen ? "Stocks" : "S"}</span>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-4 mt-1 space-y-1">
                <Link href="/stocks/in" className="block px-2 py-1 rounded-md hover:bg-gray-100 text-gray-600">
                  Items In
                </Link>
                <Link href="/stocks/out" className="block px-2 py-1 rounded-md hover:bg-gray-100 text-gray-600">
                  Items Out
                </Link>
                <Link href="/stocks/manage" className="block px-2 py-1 rounded-md hover:bg-gray-100 text-gray-600">
                  Manage
                </Link>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Link
            href="/settings"
            className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 mt-2"
          >
            {sidebarOpen ? "Settings" : "⚙"}
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <Button variant="outline" size="sm">Logout</Button>
        </header>

        <main className="p-6 flex-1 overflow-y-auto bg-gray-50">
          {children || (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-4 shadow-sm border border-gray-200">
                <h2 className="font-semibold text-gray-700">Card 1</h2>
                <p className="text-gray-500 mt-2">Some quick info</p>
              </Card>
              <Card className="p-4 shadow-sm border border-gray-200">
                <h2 className="font-semibold text-gray-700">Card 2</h2>
                <p className="text-gray-500 mt-2">Another info</p>
              </Card>
              <Card className="p-4 shadow-sm border border-gray-200">
                <h2 className="font-semibold text-gray-700">Card 3</h2>
                <p className="text-gray-500 mt-2">More info here</p>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
