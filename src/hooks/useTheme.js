import { useContext } from 'react'
import { ThemeContext } from '../context/themeContext.js'

/**
 * Lấy chế độ sáng/tối từ context.
 *
 * Trả về: { theme, isDark, setTheme, toggleTheme }
 *
 * Cùng một khuôn với useAuth(): bọc useContext lại thành hook riêng để
 * component chỉ cần gọi useTheme(), và để báo lỗi rõ ràng khi dùng sai chỗ.
 */
export default function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme() phải được dùng bên trong <ThemeProvider>')
  }

  return context
}
