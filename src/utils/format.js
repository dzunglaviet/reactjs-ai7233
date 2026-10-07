// ---------------------------------------------------------------------------
// Hàm định dạng thuần tuý — không phụ thuộc React, không gọi API.
// Tách riêng ra đây để test được và dùng lại ở mọi nơi.
// ---------------------------------------------------------------------------

/** 1099.99 -> "$1,099.99" */
export function money(value, currency = '$') {
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return `${currency}${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Giá sau giảm.
 *
 * `price` của DummyJSON là giá GỐC; số tiền thực trả phải tự tính từ
 * discountPercentage. Đây là GIÁ TRỊ DẪN XUẤT: luôn tính lúc render,
 * tuyệt đối không bỏ vào useState (xem Câu 8 và Buổi 9 câu 8).
 */
export function discountedPrice(price, discountPercentage = 0) {
  return Number(price) * (1 - Number(discountPercentage) / 100)
}

/** Tổng tiền một dòng giỏ hàng, đã trừ khuyến mãi. */
export function lineTotal({ price, discountPercentage = 0, qty = 1 }) {
  return discountedPrice(price, discountPercentage) * qty
}
