import { useEffect, useState } from 'react'
import { API } from '../services/httpClient.js'
import ExerciseLayout from '../components/ExerciseLayout.jsx'
import ErrorBox from '../components/ErrorBox.jsx'
import Spinner from '../components/Spinner.jsx'

// ---------------------------------------------------------------------------
// CÂU 1 — Fetch 8 sản phẩm trong useEffect, hiện title trong <ul>.
//
// Ở bài này cố tình KHÔNG dùng helper apiGet() để thấy rõ từng bước:
// kiểm tra res.ok -> parse JSON -> lấy data.products.
// ---------------------------------------------------------------------------

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Hàm async khai báo BÊN TRONG effect, rồi gọi ra.
    // Không được viết useEffect(async () => {...}) — xem giải thích ở ANSWERS.md.
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`${API}/products?limit=8`)
        // Kiểm tra res.ok TRƯỚC khi parse: DummyJSON trả 404 thật khi lỗi.
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()
        // Response bị BỌC: { products, total, skip, limit }.
        // data.map(...) sẽ lỗi "data.map is not a function".
        setProducts(data.products)
      } catch (err) {
        setError(err.message)
      } finally {
        // finally để spinner cũng tắt khi lỗi, không chỉ khi thành công.
        setLoading(false)
      }
    }

    fetchProducts()
  }, []) // [] = chỉ chạy một lần khi component mount

  if (loading) return <Spinner />
  if (error) return <ErrorBox message={error} />

  return (
    <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
      {products.map((product) => (
        <li key={product.id} className="px-5 py-3 text-slate-700">
          {product.title}
        </li>
      ))}
    </ul>
  )
}

export default function Q01ProductList() {
  return (
    <ExerciseLayout
      number={1}
      title="Fetch danh sách sản phẩm với useEffect"
      brief="Gọi /products?limit=8 trong useEffect với dependency array rỗng, xử lý đủ 3 trạng thái loading / error / dữ liệu, và hiện title của từng sản phẩm."
      highlight="Response của DummyJSON bị bọc trong { products, total, skip, limit } — phải đọc data.products, không phải data."
    >
      <ProductList />
    </ExerciseLayout>
  )
}
