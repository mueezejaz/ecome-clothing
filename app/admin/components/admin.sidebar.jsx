"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  Settings,
  FileText,
  Tag,
  TrendingUp,
  Home,
  Menu,
  X,
} from "lucide-react"
import { Button } from "../../../components/ui/button"
import Link from "next/link"

export default function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/admin" },
    { id: "products", label: "Products", icon: Package, href: "/admin/products" },
    { id: "orders", label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
    { id: "customers", label: "Customers", icon: Users, href: "/admin/customers" },
    { id: "analytics", label: "Analytics", icon: TrendingUp, href: "/admin/analytics" },
    { id: "categories", label: "Categories", icon: Tag, href: "/admin/categories" },
    { id: "reports", label: "Reports", icon: FileText, href: "/admin/reports" },
    { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
  ]

  const handleMenuItemClick = (itemId) => {
    setActiveTab(itemId)
    setIsMobileMenuOpen(false)
  }

  const DesktopSidebar = () => (
    <aside className="hidden lg:block w-64 bg-white shadow-lg h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-xl font-bold text-gray-900">ELEGANCE</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <Link href={item.href}>
                <Button
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === item.id
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={() => handleMenuItemClick(item.id)}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              </Link>
            </div>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start">
              <Home className="w-4 h-4 mr-3" />
              Back to Store
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  )

  const MobileMenuButton = () => (
    <div className="lg:hidden fixed top-4 left-4 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="bg-white shadow-lg"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>
    </div>
  )

  const MobileSidebar = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 w-64 bg-white shadow-xl h-full z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">ELEGANCE</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-500"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={item.href}>
                      <Button
                        variant={activeTab === item.id ? "default" : "ghost"}
                        className={`w-full justify-start ${
                          activeTab === item.id
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                        onClick={() => handleMenuItemClick(item.id)}
                      >
                        <item.icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <Home className="w-4 h-4 mr-3" />
                    Back to Store
                  </Button>
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <DesktopSidebar />
      <MobileMenuButton />
      <MobileSidebar />
    </>
  )
}

