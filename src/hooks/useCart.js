import { useState } from 'react'
import useLocalStorageState from './useLocalStorageState.js'

/**
 * Toàn bộ logic giỏ hàng, tách khỏi giao diện.
 *
 * Mọi hàm đều trả về MẢNG MỚI (map / filter / spread), không bao giờ sửa trực
 * tiếp mảng cũ — sửa tại chỗ thì tham chiếu không đổi và React có thể không
 * render lại.
 *
 * Hook này giữ state, nên component nào gọi nó chính là component SỞ HỮU giỏ
 * hàng. Trong dự án này đó là ShopPage — các con chỉ nhận callback.
 *
 * @param {object}  [options]
 * @param {string}  [options.storageKey]  Có truyền thì giỏ hàng được lưu vào
 *   localStorage và còn nguyên sau khi tải lại trang. Không truyền thì giỏ chỉ
 *   nằm trong bộ nhớ (dùng cho Câu 8, để mỗi bài tập có giỏ riêng, không lẫn
 *   với giỏ của ứng dụng tổng hợp).
 */
export default function useCart({ storageKey } = {}) {
  // Gọi cả hai hook ở cấp cao nhất — luật của Hooks: không được gọi hook trong
  // if/else. Ta luôn tạo cả hai rồi mới chọn dùng cái nào.
  const memoryState = useState([])
  const storedState = useLocalStorageState(storageKey ?? '__unused_cart__', [])

  const [rawItems, setItems] = storageKey ? storedState : memoryState

  // Dữ liệu đọc từ localStorage là dữ liệu NGOÀI tầm kiểm soát: nó có thể do
  // phiên bản app cũ ghi ra, hoặc do người dùng tự sửa trong DevTools. Lọc lại
  // trước khi dùng, nếu không một dòng thiếu `qty` đủ làm vỡ phần tính tổng.
  const items = sanitizeItems(rawItems)

  /** Thêm sản phẩm; đã có trong giỏ thì tăng số lượng, không tạo dòng trùng. */
  function addToCart(product) {
    setItems((prev) => {
      const list = sanitizeItems(prev)
      const existing = list.find((it) => it.id === product.id)

      if (existing) {
        return list.map((it) =>
          it.id === product.id
            ? { ...it, qty: Math.min(it.qty + 1, it.stock ?? Infinity) }
            : it,
        )
      }

      return [
        ...list,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          discountPercentage: product.discountPercentage ?? 0,
          thumbnail: product.thumbnail,
          stock: product.stock,
          qty: 1,
        },
      ]
    })
  }

  /** Đổi số lượng: kẹp trong [1, stock]; về 0 thì xoá hẳn dòng đó. */
  function changeQty(id, newQty) {
    setItems((prev) => {
      const list = sanitizeItems(prev)
      if (newQty <= 0) return list.filter((it) => it.id !== id)
      return list.map((it) =>
        it.id === id ? { ...it, qty: Math.min(newQty, it.stock ?? Infinity) } : it,
      )
    })
  }

  function removeFromCart(id) {
    setItems((prev) => sanitizeItems(prev).filter((it) => it.id !== id))
  }

  function clearCart() {
    setItems([])
  }

  return { items, addToCart, changeQty, removeFromCart, clearCart }
}

/**
 * Giữ lại những dòng còn dùng được, bỏ những dòng hỏng.
 *
 * Không cố "sửa" dữ liệu rác cho bằng được: thiếu id hoặc giá không phải số thì
 * bỏ luôn dòng đó, còn hơn hiển thị một dòng NaN trong giỏ.
 */
function sanitizeItems(value) {
  if (!Array.isArray(value)) return []

  return value
    .filter(
      (it) =>
        it &&
        typeof it === 'object' &&
        it.id != null &&
        Number.isFinite(Number(it.price)),
    )
    .map((it) => ({
      ...it,
      price: Number(it.price),
      discountPercentage: Number(it.discountPercentage) || 0,
      // qty hỏng thì coi như 1, và không bao giờ vượt tồn kho đã lưu
      qty: Math.max(1, Math.min(Number(it.qty) || 1, it.stock ?? Infinity)),
    }))
}
