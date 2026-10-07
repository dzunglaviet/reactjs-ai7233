import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import ProductDetailView from '../components/ProductDetailView.jsx'
import ErrorBox from '../components/ErrorBox.jsx'
import Spinner from '../components/Spinner.jsx'
import { fetchProductById } from '../services/productService.js'

/**
 * Trang chi tiết của ứng dụng tổng hợp (route /shop/products/:id).
 *
 * Container: lo useParams + fetch + loading/error.
 * Việc hiển thị giao cho ProductDetailView.
 */
export default function ProductDetailPage() {
  const { id } = useParams()
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
        if (!ignore) setProduct(data)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => {
      ignore = true // vô hiệu hoá lần chạy này khi unmount hoặc khi id đổi
    }
  }, [id])

  return (
    <div className="space-y-5">
      <Link to="/shop" className="inline-block text-sm text-blue-600 hover:underline">
        ← Quay lại cửa hàng
      </Link>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorBox message={`Không tìm thấy sản phẩm (${error})`} />
      ) : (
        <ProductDetailView product={product} />
      )}
    </div>
  )
}
