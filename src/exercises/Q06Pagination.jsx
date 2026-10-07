import { useEffect, useState } from 'react'
import ExerciseLayout from '../components/ExerciseLayout.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import Pagination from '../components/Pagination.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import { fetchProducts } from '../services/productService.js'
import ErrorBox from '../components/ErrorBox.jsx'
import Spinner from '../components/Spinner.jsx'

// ---------------------------------------------------------------------------
// CÂU 6 — Phân trang bằng limit + skip + total.
//
// Cha sở hữu `page`, tính `totalPages` rồi truyền xuống; con Pagination chỉ báo
// ngược lên trang được bấm. Con KHÔNG tự tính totalPages vì con không có `total`.
// ---------------------------------------------------------------------------

const PAGE_SIZE = 12

function ShopPage() {
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)

  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProducts({
          category,
          limit: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE, // trang 1 -> skip 0, trang 2 -> skip 12...
        })
        setProducts(data.products)
        setTotal(data.total)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [category, page])

  // Giá trị DẪN XUẤT từ total -> tính lúc render, không cho vào state.
  const totalPages = Math.ceil(total / PAGE_SIZE)

  /**
   * Đổi danh mục phải ĐƯA TRANG VỀ 1.
   * Nếu không, đang ở trang 12 của "tất cả" mà bấm sang "beauty" (chỉ có 1 trang)
   * thì skip=132 vượt quá số sản phẩm -> màn hình trắng trơn, không báo lỗi gì.
   */
  function handleSelectCategory(slug) {
    setCategory(slug)
    setPage(1)
  }

  return (
    <div className="space-y-5">
      <CategoryFilter selectedCategory={category} onSelectCategory={handleSelectCategory} />

      <p className="text-sm text-slate-500">
        Tổng {total} sản phẩm — mỗi trang {PAGE_SIZE} sản phẩm
      </p>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorBox message={error} />
      ) : (
        <>
          <ProductGrid products={products} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}

export default function Q06Pagination() {
  return (
    <ExerciseLayout
      number={6}
      title="Phân trang với limit / skip / total"
      brief="Cha giữ page và PAGE_SIZE, gửi limit & skip lên API, tính totalPages từ total rồi truyền xuống. Nút Trước/Sau bị khoá ở hai đầu danh sách."
      highlight="Đổi danh mục (hoặc từ khoá, sắp xếp) phải reset page về 1, nếu không người dùng rơi vào một trang rỗng."
    >
      <ShopPage />
    </ExerciseLayout>
  )
}
