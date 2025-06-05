import AdminSidebar from "./components/admin.sidebar"

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-0 p-6">
        {children}
      </main>
    </div>
  )
}
