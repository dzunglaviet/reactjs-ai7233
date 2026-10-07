import { NavLink } from 'react-router'

/** Link điều hướng tự tô đậm khi route đang khớp (NavLink của react-router). */
export default function NavItem({ to, children, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `block rounded-lg px-3 py-2 text-sm transition ${
          isActive
            ? 'bg-blue-600 font-medium text-white'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`
      }
    >
      {children}
    </NavLink>
  )
}
