import MobileNav from './MobileNav.jsx'
import Sidebar from './Sidebar.jsx'

/** Bố cục chung: cột điều hướng bên trái (desktop) + vùng nội dung bên phải. */
export default function AppLayout({ children }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6">
      <Sidebar />
      <main className="min-w-0 flex-1 pb-16">
        <MobileNav />
        {children}
      </main>
    </div>
  )
}
