// ---------------------------------------------------------------------------
// Mọi endpoint về sản phẩm gom vào một chỗ.
//
// Lợi ích: component không cần biết đường dẫn, tham số hay hình dạng response.
// Hôm nào API đổi (như vừa đổi từ fakestoreapi sang DummyJSON) thì chỉ sửa file
// này, không phải lục lại 10 component.
// ---------------------------------------------------------------------------
import { apiGet, apiSend } from './httpClient.js'

/**
 * Dựng URL danh sách sản phẩm từ toàn bộ tham số hiện tại — ở MỘT chỗ duy nhất.
 * Nhờ vậy mọi màn hình chỉ cần một useEffect và không có chuyện tham số này
 * ghi đè tham số kia.
 *
 * Lưu ý: sortBy/order dùng được cho cả 3 endpoint (/products, /products/search,
 * /products/category/:slug) — đã kiểm chứng trực tiếp trên API.
 */
export function buildProductListPath({
  category = '',
  keyword = '',
  sort = '', // dạng "price:asc" | "rating:desc" | ""
  limit = 12,
  skip = 0,
} = {}) {
  const params = new URLSearchParams({ limit: String(limit), skip: String(skip) })

  if (sort) {
    const [sortBy, order] = sort.split(':')
    params.set('sortBy', sortBy)
    params.set('order', order)
  }

  const q = keyword.trim()
  if (q) return `/products/search?q=${encodeURIComponent(q)}&${params}`
  if (category) return `/products/category/${encodeURIComponent(category)}?${params}`
  return `/products?${params}`
}

/** Trả nguyên gói { products, total, skip, limit } để nơi gọi dùng được `total`. */
export function fetchProducts(options) {
  return apiGet(buildProductListPath(options))
}

export function fetchProductById(id) {
  return apiGet(`/products/${id}`)
}

/** Mảng OBJECT { slug, name, url } — hiển thị `name`, gửi đi `slug`. */
export function fetchCategories() {
  return apiGet('/products/categories')
}

/** Ghi dữ liệu chỉ là GIẢ LẬP: server trả về object hợp lệ nhưng không lưu gì. */
export function createProduct(payload) {
  return apiSend('/products/add', { method: 'POST', body: payload })
}

/**
 * Sửa sản phẩm. Dùng PUT /products/{id}.
 *
 * Response chỉ trả về id kèm các trường vừa gửi lên, KHÔNG phải object đầy đủ —
 * nên nơi gọi phải trộn với dữ liệu cũ (`{ ...cũ, ...mới }`) nếu muốn giữ lại
 * thumbnail, rating, stock...
 */
export function updateProduct(id, payload) {
  return apiSend(`/products/${id}`, { method: 'PUT', body: payload })
}

export function deleteProduct(id) {
  return apiSend(`/products/${id}`, { method: 'DELETE' })
}
