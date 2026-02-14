import { useState } from "react"
import { Link, usePage } from "@inertiajs/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Home, Users, Settings, Package, Truck, FileText, Layers, LogOut, Database, Menu } from "lucide-react"

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const { url } = usePage()

    const menuActiveClass = "bg-white border border-gray-200 shadow-2xs hover:bg-white"
    const iconActiveClass = "text-indigo-600"

    const SidebarLink = ({ href, icon: Icon, label }) => {
        const isActive = url === href
        return (
            <Link
                href={href}
                className={`flex items-center px-3 py-2 rounded-md gap-2 hover:bg-gray-100 transition ${isActive ? menuActiveClass : "text-gray-600"
                    }`}
            >
                <Icon className={`w-5 h-5 ${isActive ? iconActiveClass : "text-gray-600"}`} />
                {sidebarOpen && <span>{label}</span>}
            </Link>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}>
                <div className="flex items-center justify-between p-3.5 border-b border-gray-200">
                    <span className={`font-bold text-lg ${sidebarOpen ? "" : "hidden"}`}>
                        MRSpace
                    </span>
                    <Button variant="ghost" size="sm" className="p-1" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? "⏴" : "⏵"}
                    </Button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto bg-gray-100">
                    <SidebarLink href="/dashboard" icon={Home} label="Dashboard" />

                    <Collapsible>
                        <CollapsibleTrigger asChild>
                            <button className="w-full flex justify-between items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium">
                                <div className="flex items-center gap-2">
                                    <Database className="w-5 h-5" />
                                    {sidebarOpen && <span>Inventory</span>}
                                </div>
                                {sidebarOpen && <span>▸</span>}
                            </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="ml-6 mt-1 space-y-1">
                                <SidebarLink href="/inventory/items" icon={Menu} label="Items" />
                                <SidebarLink href="/inventory/suppliers" icon={Truck} label="Suppliers" />
                                <SidebarLink href="/inventory/customers" icon={Users} label="Customers" />
                                <SidebarLink href="/inventory/invoices" icon={FileText} label="Invoices" />
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Stocks */}
                    <Collapsible>
                        <CollapsibleTrigger asChild>
                            <button className="w-full flex justify-between items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium mt-2">
                                <div className="flex items-center gap-2">
                                    <Layers className="w-5 h-5" />
                                    {sidebarOpen && <span>Stocks</span>}
                                </div>
                                {sidebarOpen && <span>▸</span>}
                            </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="ml-6 mt-1 space-y-1">
                                <SidebarLink href="/stocks/in" icon={Package} label="Items In" />
                                <SidebarLink href="/stocks/out" icon={Package} label="Items Out" />
                                <SidebarLink href="/stocks/manage" icon={Settings} label="Manage" />
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    <SidebarLink href="/settings" icon={Settings} label="Settings" />
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        {sidebarOpen && "Logout"}
                    </Button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
                    <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
                </header>

                <main className="flex-1 overflow-y-auto bg-gray-50 p-8 relative z-10">
                    {children ? (
                        children
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="p-6 shadow-sm border border-gray-200 rounded-xl">
                                <h2 className="font-semibold text-gray-700">Revenue</h2>
                                <p className="text-gray-500 mt-2">$12,450</p>
                            </Card>

                            <Card className="p-6 shadow-sm border border-gray-200 rounded-xl">
                                <h2 className="font-semibold text-gray-700">Users</h2>
                                <p className="text-gray-500 mt-2">1,230 active</p>
                            </Card>

                            <Card className="p-6 shadow-sm border border-gray-200 rounded-xl">
                                <h2 className="font-semibold text-gray-700">Orders</h2>
                                <p className="text-gray-500 mt-2">320 new</p>
                            </Card>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
