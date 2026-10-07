import { useEffect, useState } from 'react'
import { Link, Route, Routes, useParams } from 'react-router'
import ExerciseLayout from '../components/ExerciseLayout.jsx'
import ProductDetailView from '../components/ProductDetailView.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import { fetchProductById, fetchProducts } from '../services/productService.js'
import ErrorBox from '../components/ErrorBox.jsx'
import Spinner from '../components/Spinner.jsx'

// ---------------------------------------------------------------------------
// CÂU 7 — Trang chi tiết /bai/7/:id, tách rõ trách nhiệm:
//
//   ProductDetailPage  : đọc useParams, fetch, giữ loading/error/product
//   ProductDetailView  : chỉ nhận product đã tải xong rồi hiển thị
//   ReviewList         : map mảng reviews
//   ReviewItem         : một đánh giá
//
// -> 4 tầng component, mỗi tầng một việc.
// ---------------------------------------------------------------------------

/** Danh sách rút gọn, mỗi thẻ là một <Link> sang trang chi tiết. */
function ProductListPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts({ limit: 8 })
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <>
      <p className="mb-4 text-sm text-slate-500">Bấm vào tên sản phẩm để mở trang chi tiết.</p>
      <ProductGrid products={products} detailBasePath="/bai/7" />
    </>
  )
}

function ProductDetailPage() {
  const { id } = useParams() // lấy :id từ URL
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Cờ `ignore` chống hai vấn đề:
    //  1. Response về sau khi component đã unmount -> setState vào component
    //     không còn tồn tại.
    //  2. Race condition: bấm nhanh từ id=5 sang id=9, nếu response của 5 về
    //     chậm hơn thì nó sẽ GHI ĐÈ lên dữ liệu của 9 đang hiển thị.
    let ignore = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProductById(id)
        // DummyJSON trả 404 THẬT cho id không tồn tại, apiGet đã ném lỗi sẵn.
        if (!ignore) setProduct(data)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [id]) // đổi id -> chạy lại, và cleanup vô hiệu hoá lần chạy cũ

  if (loading) return <Spinner />

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorBox message={`Không tìm thấy sản phẩm (${error})`} />
        <Link to="/bai/7" className="text-sm text-blue-600 hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <Link to="/bai/7" className="inline-block text-sm text-blue-600 hover:underline">
        ← Quay lại danh sách
      </Link>
      <ProductDetailView product={product} />
    </div>
  )
}

export default function Q07Detail() {
  return (
    <ExerciseLayout
      number={7}
      title="Trang chi tiết với router, reviews và cleanup"
      brief="Route /bai/7/:id đọc id bằng useParams. Trang lo fetch, View lo hiển thị, ReviewList/ReviewItem lo danh sách đánh giá. Thử /bai/7/9999 để xem nhánh 404."
      highlight="Cleanup trong useEffect chặn race condition: response cũ về muộn không được ghi đè dữ liệu mới."
    >
      <Routes>
        <Route index element={<ProductListPage />} />
        <Route path=":id" element={<ProductDetailPage />} />
      </Routes>
    </ExerciseLayout>
  )
}
