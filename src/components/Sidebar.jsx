import { EXERCISE_ROUTES } from '../routes/navigation.js'
import { API } from '../services/httpClient.js'
import AuthStatus from './AuthStatus.jsx'
import NavItem from './NavItem.jsx'

/** Cột điều hướng bên trái — chỉ hiện từ breakpoint lg trở lên. */
export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Bài giải DummyJSON</h2>
          <p className="mt-1 text-xs text-slate-500">Bản đơn giản — ReactJS AI7233</p>
        </div>

        <nav className="space-y-1">
          <NavItem to="/" end>
            Giới thiệu
          </NavItem>
          <NavItem to="/shop">★ Ứng dụng tổng hợp</NavItem>
        </nav>

        <div>
          <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase">
            10 câu hỏi
          </p>
          <nav className="space-y-1">
            {EXERCISE_ROUTES.map((ex) => (
              <NavItem key={ex.number} to={ex.path}>
                <span className="mr-2 inline-block w-5 text-right font-mono text-xs text-slate-400">
                  {ex.number}
                </span>
                {ex.navTitle}
              </NavItem>
            ))}
          </nav>
        </div>

        {/* Đọc AuthContext ở một nhánh rất xa chỗ đăng nhập (Câu 9, Câu 10) */}
        <AuthStatus />

        <p className="rounded-lg bg-slate-100 px-3 py-2 font-mono text-[11px] break-all text-slate-500">
          API: {API}
        </p>
      </div>
    </aside>
  )
}
