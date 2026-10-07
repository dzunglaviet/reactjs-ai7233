import { EXERCISE_ROUTES } from '../../routes/navigation.js'
import { API } from '../../services/httpClient.js'
import AuthStatus from './AuthStatus.jsx'
import NavItem from './NavItem.jsx'
import ThemeToggle from './ThemeToggle.jsx'

/** Cột điều hướng bên trái — chỉ hiện từ breakpoint lg trở lên. */
export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">ReactJS</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Aptech — AI7233</p>
        </div>

        <nav className="space-y-1">
          <NavItem to="/" end>
            Giới thiệu
          </NavItem>
          <NavItem to="/shop" >★ Ứng dụng tổng hợp</NavItem>
        </nav>

        <div>
          <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-slate-400 dark:text-slate-500 uppercase">
            {EXERCISE_ROUTES.length} câu hỏi
          </p>
          <nav className="space-y-1">
            {EXERCISE_ROUTES.map((ex) => (
              <NavItem key={ex.number} to={ex.path}>
                <span className="mr-2 inline-block w-5 text-right font-mono text-xs text-slate-400 dark:text-slate-500">
                  {ex.number}
                </span>
                {ex.navTitle}
              </NavItem>
            ))}
          </nav>
        </div>

        {/* Hai component này đều KHÔNG nhận props: một cái tiêu thụ AuthContext,
            một cái tiêu thụ ThemeContext. Sidebar chỉ việc đặt chúng vào chỗ cần. */}
        <AuthStatus />
        <ThemeToggle />

        <p className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 font-mono text-[11px] break-all text-slate-500 dark:text-slate-400">
          API: {API}
        </p>
      </div>
    </aside>
  )
}
