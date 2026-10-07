import { createContext } from 'react'

/**
 * Context chứa state đăng nhập dùng chung cho cả app.
 *
 * Giá trị mặc định là `null` có chủ đích: hook useAuth() dựa vào đó để phát hiện
 * component đang nằm NGOÀI <AuthProvider> và báo lỗi rõ ràng, thay vì trả về
 * undefined rồi vỡ ở một chỗ khác chẳng liên quan.
 *
 * Để riêng context ra file này (không kèm component) để React Fast Refresh hoạt
 * động bình thường — một file .jsx chỉ nên export component.
 */
export const AuthContext = createContext(null)
