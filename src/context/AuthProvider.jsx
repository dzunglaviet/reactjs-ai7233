import { useCallback, useMemo, useReducer } from 'react'
import { fetchCurrentUser, login as loginRequest } from '../services/authService.js'
import { AuthContext } from './authContext.js'
import { AUTH_ACTIONS, authReducer, initialAuthState } from './authReducer.js'

/**
 * Cung cấp state đăng nhập cho toàn bộ cây component.
 *
 * Đặt ở main.jsx, bọc ngoài <App />, nên BẤT KỲ component nào ở bất kỳ độ sâu
 * nào cũng gọi được useContext(AuthContext) mà không cần ai truyền props xuống.
 * Đó chính là
 * thứ Context giải quyết: dữ liệu mang tính TOÀN CỤC và được dùng ở nhiều nhánh
 * rất xa nhau — ở đây là Q10UserCart (nội dung chính) và AuthStatus (sidebar).
 *
 * LƯU Ý: Context KHÔNG phải để thay thế props. Giỏ hàng trong dự án này vẫn cố
 * tình truyền bằng props qua ba tầng (Câu 8), vì đó là bài học về prop drilling —
 * phải thấy vấn đề trước thì mới hiểu Context sinh ra để làm gì.
 */
export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState)

  /**
   * Đăng nhập: gọi API, lấy accessToken, rồi dùng token đó hỏi /auth/me để
   * chứng minh token thật sự dùng được.
   */
  const login = useCallback(async (username, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START })

    try {
      const auth = await loginRequest({ username, password })

      // Trường trả về tên là accessToken, KHÔNG phải token.
      // Dùng nhầm sẽ cho "Bearer undefined" và một lỗi 401 rất khó hiểu.
      const token = auth.accessToken
      const userInfo = await fetchCurrentUser(token)

      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { token, userInfo } })
      return userInfo // trả về để nơi gọi làm tiếp việc của mình (vd: tải giỏ hàng)
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: err.message })
      return null
    }
  }, [])

  const logout = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT })
  }, [])

  // useMemo để object `value` không bị tạo mới ở mỗi lần render của Provider.
  // Nếu tạo mới liên tục thì MỌI component đang đọc Context đều render lại oan.
  const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout])

  // React 19 cho phép viết gọn <AuthContext value={value}>, nhưng ở đây dùng
  // .Provider vì đó là cú pháp sinh viên gặp trong mọi tài liệu hiện có.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
