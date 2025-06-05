import AdminSidebar from "./components/admin.sidebar"
export default function AdminLayout({ children }) {
  return( 
  <>
  <AdminSidebar/>
  {children}
  </>
 ) 
}
