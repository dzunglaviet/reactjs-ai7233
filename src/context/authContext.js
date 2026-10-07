import { createContext } from 'react'

/**
 * Context chứa state đăng nhập dùng chung cho cả app.
 *
 * Mọi component cần biết trạng thái đăng nhập chỉ việc gọi
 * `useContext(AuthContext)` — không ai phải truyền props xuống.
 *
 * Để riêng context ra file này (không kèm component) để React Fast Refresh hoạt
 * động bình thường — một file .jsx chỉ nên export component.
 */
export const AuthContext = createContext(null)
