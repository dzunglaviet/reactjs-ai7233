import { apiGet, apiSend } from './httpClient.js'

/**
 * Đăng nhập.
 *
 * Response trả về `accessToken` (KHÔNG phải `token` như fakestoreapi cũ).
 * Dùng nhầm tên trường sẽ cho ra `Bearer undefined` và một lỗi 401 rất khó hiểu.
 *
 * Tài khoản demo của DummyJSON: emilys / emilyspass
 */
export function login({ username, password }) {
  return apiSend('/auth/login', {
    method: 'POST',
    body: { username, password, expiresInMins: 30 },
  })
}

/** Gọi endpoint cần xác thực để chứng minh token thật sự dùng được. */
export function fetchCurrentUser(token) {
  return apiGet('/auth/me', { token })
}
