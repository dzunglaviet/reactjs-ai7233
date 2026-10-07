import { useEffect, useState } from 'react'
import { apiGet } from '../services/httpClient.js'
import ProductCard from '../components/ProductCard.jsx'
import ExerciseLayout from '../components/ExerciseLayout.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorBox from '../components/ErrorBox.jsx'
import Spinner from '../components/Spinner.jsx'

// ---------------------------------------------------------------------------
// CÂU 5 — Sắp xếp phía server + một useEffect duy nhất với dependency đủ.
//
// DummyJSON sắp xếp thật theo trường: sortBy=price&order=asc. Khác fakestoreapi
// (chỉ sắp theo id) nên KHÔNG cần sort lại ở client.
// ---------------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: '', label: 'Mặc định' },
  { value: 'price:asc', label: 'Giá tăng dần' },
  { value: 'price:desc', label: 'Giá giảm dần' },
  { value: 'rating:desc', label: 'Đánh giá cao nhất' },
]

function SortSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
    >
      {SORT_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

/**
 * Dựng URL ở MỘT CHỖ DUY NHẤT từ toàn bộ tham số hiện tại.
 * Gom lại đây thì chỉ cần một useEffect, và không bao giờ có chuyện tham số này
 * ghi đè tham số kia.
 *
 * (Trong dự án thật, hàm này nằm ở src/services/productService.js —
 * buildProductListPath(). Ở bài tập để ngay đây cho dễ đọc một mạch.)
 */
function buildUrl({ category, keyword, sort, limit = 8 }) {
  const params = new URLSearchParams({ limit: String(limit) })

  if (sort) {
    const [sortBy, order] = sort.split(':')
    params.set('sortBy', sortBy)
    params.set('order', order)
  }

  // sortBy dùng được cho cả 3 endpoint: /products, /products/search, /products/category/*
  if (keyword.trim()) return `/products/search?q=${encodeURIComponent(keyword.trim())}&${params}`
  if (category) return `/products/category/${category}?${params}`
  return `/products?${params}`
}

function ShopPage() {
  const [category] = useState('') // giữ nguyên ở bài này, bài tổng hợp mới dùng tới
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState('')

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      async function load() {
        try {
          setLoading(true)
          setError(null)
          const data = await apiGet(buildUrl({ category, keyword, sort }))
          setProducts(data.products)
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      load()
    }, 400)

    return () => clearTimeout(timer)
    // Dependency phải liệt kê ĐỦ mọi thứ mà buildUrl() đọc tới.
    // Thiếu `sort` -> đổi kiểu sắp xếp mà màn hình không đổi gì.
    // Thêm `products` vào đây -> vòng lặp vô hạn (effect set products -> đổi
    // tham chiếu -> effect chạy lại -> ...).
  }, [category, keyword, sort])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm sản phẩm..."
          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
        />
        <SortSelect value={sort} onChange={setSort} />
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorBox message={error} />
      ) : products.length === 0 ? (
        <EmptyState>Không tìm thấy sản phẩm nào</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Q05Sort() {
  return (
    <ExerciseLayout
      number={5}
      title="Sắp xếp phía server và dependency array đúng"
      brief="Thêm SortSelect gửi lựa chọn lên cha. URL được dựng ở một chỗ duy nhất từ { category, keyword, sort }, và chỉ một useEffect lo toàn bộ."
      highlight="Thiếu sort trong dependency array thì đổi sắp xếp không có tác dụng; cho products vào đó thì effect lặp vô hạn."
    >
      <ShopPage />
    </ExerciseLayout>
  )
}
