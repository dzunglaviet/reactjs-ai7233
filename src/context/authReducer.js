// ---------------------------------------------------------------------------
// Reducer cho phần đăng nhập.
//
// Vì sao useReducer mà không phải 4 cái useState rời?
// State đăng nhập có nhiều mảnh (isLoggedIn, userInfo, token, loading, error)
// nhưng chúng LUÔN ĐỔI CÙNG NHAU theo từng sự kiện: bấm đăng nhập thì loading
// bật và error phải xoá; đăng nhập xong thì loading tắt, token và userInfo cùng
// có, isLoggedIn thành true. Viết bằng useState là 4-5 lệnh set rải rác, quên
// một cái là sinh ra trạng thái vô lý (ví dụ isLoggedIn = true mà userInfo = null).
//
// useReducer gom mỗi sự kiện vào MỘT phép chuyển trạng thái, đọc là thấy ngay
// "sau hành động này state trông như thế nào".
//
// File này là HÀM THUẦN: không React, không gọi API, nên test được dễ dàng.
// ---------------------------------------------------------------------------

export const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
}

export const initialAuthState = {
  isLoggedIn: false,
  userInfo: null, // thông tin user lấy từ /auth/me
  token: null, // accessToken dùng cho header Authorization
  loading: false,
  error: null,
}

export function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      // Bắt đầu đăng nhập: bật loading VÀ xoá lỗi cũ trong cùng một bước.
      return { ...state, loading: true, error: null }

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        isLoggedIn: true,
        userInfo: action.payload.userInfo,
        token: action.payload.token,
        loading: false,
        error: null,
      }

    case AUTH_ACTIONS.LOGIN_FAILURE:
      // Thất bại thì phải dọn sạch token/userInfo, không để sót dữ liệu nửa vời.
      return { ...initialAuthState, error: action.payload }

    case AUTH_ACTIONS.LOGOUT:
      return initialAuthState

    default:
      // Gõ sai tên action thì báo lỗi ngay lúc dev, thay vì âm thầm không làm gì.
      throw new Error(`Hành động không hợp lệ: ${action.type}`)
  }
}
