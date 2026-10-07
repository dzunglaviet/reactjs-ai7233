import { useEffect, useState } from 'react'
import { apiGet } from '../services/httpClient.js'
import ProductCard from '../components/ProductCard.jsx'
import ExerciseLayout from '../components/ExerciseLayout.jsx'
import ErrorBox from '../components/ErrorBox.jsx'
import Spinner from '../components/Spinner.jsx'

// ---------------------------------------------------------------------------
// CÂU 3 — Lọc theo danh mục, dữ liệu đi LÊN từ con.
//
// Luồng dữ liệu:
//   ShopPage (cha)  --- selectedCategory (prop) --->  CategoryFilter (con)
//   ShopPage (cha)  <-- onSelectCategory(slug)  ---   CategoryFilter (con)
//
// Con HIỂN THỊ trạng thái đang chọn nhưng KHÔNG SỞ HỮU nó.
// ---------------------------------------------------------------------------

function CategoryFilter({ selectedCategory, onSelectCategory }) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    // Con được phép tự lấy danh sách danh mục vì đó là dữ liệu RIÊNG của nó,
    // cha không có và cũng không cần. Khác hẳn việc con đi fetch lại sản phẩm
    // mà cha đã cầm trong tay (Câu 2).
    apiGet('/products/categories')
      .then(setCategories)
      .catch(() => setCategories([])) // lỗi danh mục không được làm chết cả trang
  }, [])

  const base = 'rounded-full border px-3 py-1.5 text-sm transition'
  const activeCls = 'border-blue-600 bg-blue-600 text-white'
  const idleCls = 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelectCategory('')}
        className={`${base} ${selectedCategory === '' ? activeCls : idleCls}`}
      >
        Tất cả
      </button>

      {categories.map((cat) => (
        <button
          key={cat.slug}
          type="button"
          // CHÚ Ý: /products/categories trả về MẢNG OBJECT { slug, name, url }.
          // Hiện ra là cat.name, nhưng thứ gửi lên cha phải là cat.slug.
          // Render thẳng {cat} sẽ ra "[object Object]".
          onClick={() => onSelectCategory(cat.slug)}
          className={`${base} ${selectedCategory === cat.slug ? activeCls : idleCls}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

function ShopPage() {
  // State nằm ở CHA vì chính cha là nơi phải fetch lại khi danh mục đổi.
  const [selectedCategory, setSelectedCategory] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const path = selectedCategory
          ? `/products/category/${selectedCategory}?limit=8`
          : '/products?limit=8'
        const data = await apiGet(path)
        setProducts(data.products)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedCategory]) // đổi danh mục -> effect chạy lại -> fetch lại

  return (
    <div className="space-y-5">
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorBox message={error} />
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

export default function Q03CategoryFilter() {
  return (
    <ExerciseLayout
      number={3}
      title="Lọc danh mục — đẩy dữ liệu từ con lên cha"
      brief="CategoryFilter tự lấy danh sách danh mục, gửi slug được chọn lên cha qua callback, và nhận lại selectedCategory từ cha để tô đậm nút đang chọn."
      highlight="/products/categories trả mảng OBJECT { slug, name, url }: hiển thị name, gửi đi slug."
    >
      <ShopPage />
    </ExerciseLayout>
  )
}
