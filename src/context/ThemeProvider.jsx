import { useCallback, useEffect, useMemo } from 'react'
import useLocalStorageState from '../hooks/useLocalStorageState.js'
import { ThemeContext } from './themeContext.js'

const STORAGE_KEY = 'dummyjson:theme:v1'

/**
 * Chế độ mặc định cho người dùng MỚI: nghe theo cài đặt hệ điều hành.
 *
 * Tính một lần lúc nạp module, không tính lại ở mỗi render — giá trị này chỉ
 * được dùng đúng lần đầu, khi localStorage còn trống. Ai đã từng bấm nút thì
 * lựa chọn của họ luôn thắng cài đặt hệ thống.
 */
const systemPrefersDark =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches

/**
 * Cung cấp chế độ sáng/tối cho toàn bộ cây component.
 *
 * Giá trị chỉ là một chuỗi 'light' | 'dark', nên dùng useState (qua
 * useLocalStorageState) là đủ — KHÔNG cần useReducer như AuthProvider.
 * useReducer đáng dùng khi nhiều ô state phải đổi cùng nhau theo luật
 * (xem authReducer.js: một lần đăng nhập đổi cả isLoggedIn, userInfo, token,
 * loading, error). Ở đây chỉ có một ô, thêm reducer là thêm việc vô ích.
 */
export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorageState(
    STORAGE_KEY,
    systemPrefersDark ? 'dark' : 'light',
  )

  /**
   * ĐÂY LÀ CHỖ ĐÁNG CHÚ Ý NHẤT CỦA CẢ FILE.
   *
   * Thẻ <html> nằm NGOÀI cây React — React không quản lý nó, nên không thể
   * đổi nó bằng cách trả về JSX. Sửa trực tiếp DOM như vậy là một "side
   * effect", và useEffect chính là chỗ dành cho side effect: effect chạy SAU
   * khi React đã vẽ xong màn hình.
   *
   * Tuyệt đối không viết document.documentElement.setAttribute(...) ngay trong
   * thân component. Thân component phải THUẦN: cùng props thì cùng kết quả,
   * không chạm vào thế giới bên ngoài. React 19 ở chế độ StrictMode còn gọi
   * component hai lần để lộ ra đúng loại lỗi này.
   */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    // Dùng dạng hàm cập nhật: giá trị mới tính từ giá trị MỚI NHẤT mà React
    // đang giữ, không phải từ biến `theme` bị "đóng băng" trong lần render này.
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  // isDark là giá trị DẪN XUẤT từ theme -> tính lúc render, không cho vào state.
  // Hai ô state cùng mô tả một sự thật thì sớm muộn cũng lệch nhau.
  const value = useMemo(
    () => ({ theme, isDark: theme === 'dark', setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
