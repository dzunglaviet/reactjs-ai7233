import { useContext } from 'react'
import { AuthContext } from '../context/authContext.js'

/**
 * Lấy state đăng nhập từ context.
 *
 * Trả về: { isLoggedIn, userInfo, token, loading, error, login, logout }
 *
 * Bọc useContext trong một hook riêng có hai cái lợi:
 *  1. Component chỉ cần `useAuth()`, không phải import cả context lẫn useContext.
 *  2. Kiểm tra được việc dùng sai chỗ và báo lỗi đúng nguyên nhân.
 */
export default function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth() phải được dùng bên trong <AuthProvider>')
  }

  return context
}
