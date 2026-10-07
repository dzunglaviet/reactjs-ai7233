import { useEffect, useState } from 'react'
import { apiGet } from '../services/httpClient.js'
import { money } from '../utils/format.js'
import ExerciseLayout from '../components/layout/ExerciseLayout.jsx'
import { Badge, ErrorBox, Spinner } from '../components/ui/index.js'

// ---------------------------------------------------------------------------
// CÂU 2 — Tách thành component phức hợp:
//   ProductList  (CHA)  : giữ state, gọi API            -> "container"
//   ProductCard  (CON)  : chỉ nhận props và hiển thị     -> "presentational"
//
// ProductCard KHÔNG gọi fetch, KHÔNG có useEffect, KHÔNG có state.
// ---------------------------------------------------------------------------

/**
 * Con thuần hiển thị.
 * - Destructure props ngay trong danh sách tham số.
 * - currency có giá trị mặc định qua default parameter.
 * - Dùng ?. và ?? để thiếu trường nào thì hiện "—" chứ không vỡ app.
 */
function ProductCard({ title, price, thumbnail, rating, stock, availabilityStatus, currency = '$' }) {
  const outOfStock = stock === 0

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition hover:shadow-md">
      <div className="flex h-40 items-center justify-center bg-slate-50 dark:bg-slate-900 p-3">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="h-full object-contain" loading="lazy" />
        ) : (
          <span className="text-slate-400 dark:text-slate-500">—</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-medium text-slate-900 dark:text-slate-100">{title ?? '—'}</h3>

        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {price == null ? '—' : money(price, currency)}
        </p>

        <div className="mt-auto flex items-center justify-between">
          {/* rating của DummyJSON là MỘT SỐ, không phải object { rate, count } */}
          <span className="text-sm text-amber-600 dark:text-amber-400">
            {rating != null ? `${rating} ★` : '—'}
          </span>

          {outOfStock ? (
            <Badge tone="rose">Tạm hết hàng</Badge>
          ) : (
            <Badge tone="green">Còn {stock ?? '—'} sản phẩm</Badge>
          )}
        </div>

        {availabilityStatus && (
          <p className="text-xs text-slate-400 dark:text-slate-500">{availabilityStatus}</p>
        )}
      </div>
    </article>
  )
}

/** Cha: sở hữu toàn bộ state và là nơi duy nhất gọi API. */
function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await apiGet('/products?limit=8')
        setProducts(data.products)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Spinner />
  if (error) return <ErrorBox message={error} />

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((p) => (
        // Truyền từng trường xuống làm prop riêng (đúng yêu cầu đề).
        // Thực tế có thể viết gọn <ProductCard key={p.id} {...p} /> — nhưng ở
        // đây tách ra để thấy rõ cha quyết định con được nhận cái gì.
        <ProductCard
          key={p.id}
          title={p.title}
          price={p.price}
          thumbnail={p.thumbnail}
          rating={p.rating}
          stock={p.stock}
          availabilityStatus={p.availabilityStatus}
        />
      ))}
    </div>
  )
}

export default function Q02CompositeList() {
  return (
    <ExerciseLayout
      number={2}
      title="Tách container và presentational"
      brief="ProductList giữ state và gọi API; ProductCard chỉ nhận props rồi hiển thị ảnh, giá, đánh giá và tồn kho. Thêm prop currency có giá trị mặc định."
      highlight="Con không được tự fetch: 8 thẻ tự gọi API là 8 request thừa cho dữ liệu mà cha đã có sẵn."
    >
      <ProductList />
    </ExerciseLayout>
  )
}
