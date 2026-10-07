import { apiGet } from './httpClient.js'

/**
 * Giỏ hàng của một user.
 *
 * CHÚ Ý response bị bọc HAI LẦN:
 *   { carts: [ { id, userId, products: [...], total, ... } ], total, skip, limit }
 * `total` ở ngoài cùng là SỐ LƯỢNG GIỎ, còn `total` bên trong mỗi giỏ mới là
 * tổng tiền — hai thứ khác nhau hoàn toàn.
 */
export async function fetchUserCarts(userId) {
  const data = await apiGet(`/carts/user/${userId}`)
  return data.carts
}

export function fetchCartById(id) {
  return apiGet(`/carts/${id}`)
}
