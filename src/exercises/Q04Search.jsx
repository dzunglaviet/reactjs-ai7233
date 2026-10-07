import { useEffect, useState } from 'react'
import { apiGet } from '../services/httpClient.js'
import ProductCard from '../components/ProductCard.jsx'
import ExerciseLayout from '../components/ExerciseLayout.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorBox from '../components/ErrorBox.jsx'
import Spinner from '../components/Spinner.jsx'

// ---------------------------------------------------------------------------
// CÂU 4 — Tìm kiếm phía server + debounce.
//
// Hai component anh em KHÔNG nói chuyện trực tiếp với nhau:
//   SearchBar  --(onKeywordChange)-->  ShopPage  --(products)-->  ProductGrid
// Đây chính là mẫu "lifting state up" của Buổi 4.
// ---------------------------------------------------------------------------

/** Con: chỉ có ô input, không giữ dữ liệu sản phẩm nào. */
function SearchBar({ keyword, onKeywordChange }) {
  return (
    <input
      type="search"
      value={keyword}
      onChange={(e) => onKeywordChange(e.target.value)}
      placeholder="Tìm sản phẩm... (thử: phone, laptop, watch)"
      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  )
}

/** Con anh em: chỉ nhận mảng ĐÃ XỬ LÝ, tự nó không lọc gì cả. */
function ProductGrid({ products }) {
  if (products.length === 0) return <EmptyState>Không tìm thấy sản phẩm nào</EmptyState>

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

function ShopPage() {
  const [keyword, setKeyword] = useState('')
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // DEBOUNCE: không gọi API ngay mà hẹn 400ms.
    // Mỗi lần keyword đổi, React chạy cleanup của lần trước -> clearTimeout huỷ
    // cái hẹn cũ. Gõ "phone" (5 ký tự) vì thế chỉ tốn 1 request, không phải 5.
    const timer = setTimeout(() => {
      async function load() {
        try {
          setLoading(true)
          setError(null)

          // Từ khoá rỗng thì quay về danh sách thường, không search chuỗi "".
          const path = keyword.trim()
            ? `/products/search?q=${encodeURIComponent(keyword.trim())}&limit=8`
            : '/products?limit=8'

          const data = await apiGet(path)
          setProducts(data.products)
          // total là TỔNG số kết quả khớp, khác products.length (đã bị limit cắt).
          setTotal(data.total)
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      load()
    }, 400)

    return () => clearTimeout(timer) // <-- cleanup huỷ timer đang chờ
  }, [keyword])

  return (
    <div className="space-y-5">
      <SearchBar keyword={keyword} onKeywordChange={setKeyword} />

      <p className="text-sm text-slate-500">
        {keyword.trim()
          ? `Tìm thấy ${total} sản phẩm cho từ khoá '${keyword.trim()}'`
          : `Đang hiển thị ${products.length} / ${total} sản phẩm`}
      </p>

      {loading ? <Spinner /> : error ? <ErrorBox message={error} /> : <ProductGrid products={products} />}
    </div>
  )
}

export default function Q04Search() {
  return (
    <ExerciseLayout
      number={4}
      title="Tìm kiếm phía server có debounce"
      brief="SearchBar đẩy từ khoá lên cha; cha gọi /products/search?q= nhưng hoãn 400ms, và huỷ cái hẹn cũ mỗi lần gõ thêm. Số lượng lấy từ total trong response."
      highlight="Cleanup của useEffect ở đây huỷ setTimeout đang chờ — đó là thứ biến 5 request thành 1."
    >
      <ShopPage />
    </ExerciseLayout>
  )
}
