// ---------------------------------------------------------------------------
// Tầng HTTP dùng chung. Không component nào gọi fetch() trực tiếp (trừ Câu 1,
// cố ý để sinh viên thấy fetch thô một lần), mọi thứ đi qua đây.
//
// Base URL đọc từ biến môi trường (kiến thức Buổi 10) để đổi giữa API công khai
// và server mirror local chỉ bằng 1 dòng trong .env.local.
// ---------------------------------------------------------------------------
export const API = import.meta.env.VITE_API_URL ?? 'https://dummyjson.com'

/** Đọc thông báo lỗi từ body (DummyJSON trả { message }), hỏng thì dùng status. */
async function toError(res) {
  try {
    const body = await res.json()
    if (body?.message) return new Error(body.message)
  } catch {
    /* body không phải JSON — bỏ qua */
  }
  return new Error(`HTTP ${res.status}`)
}

/**
 * GET một endpoint và trả JSON.
 *
 * Luôn kiểm tra res.ok TRƯỚC khi parse: DummyJSON trả 404 thật cho id không
 * tồn tại, nên res.ok ở API này là cách bắt lỗi đúng.
 */
export async function apiGet(path, { token } = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  if (!res.ok) throw await toError(res)
  return res.json()
}

/** POST / PUT / PATCH / DELETE có body JSON và tuỳ chọn Bearer token. */
export async function apiSend(path, { method = 'POST', body, token } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) throw await toError(res)
  return res.json()
}
