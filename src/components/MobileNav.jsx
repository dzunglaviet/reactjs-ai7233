import { EXERCISE_ROUTES } from '../routes/navigation.js'
import NavItem from './NavItem.jsx'

/** Menu rút gọn nằm ngang, chỉ hiện dưới breakpoint lg. */
export default function MobileNav() {
  return (
    <nav className="mb-5 flex flex-wrap gap-2 lg:hidden">
      <NavItem to="/" end>
        Giới thiệu
      </NavItem>
      <NavItem to="/shop">Tổng hợp</NavItem>
      {EXERCISE_ROUTES.map((ex) => (
        <NavItem key={ex.number} to={ex.path}>
          {ex.number}
        </NavItem>
      ))}
    </nav>
  )
}
