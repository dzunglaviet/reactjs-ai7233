import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import CartPanel from '../components/CartPanel.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import ErrorBox from '../components/ErrorBox.jsx'
import Pagination from '../components/Pagination.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import SearchBar from '../components/SearchBar.jsx'
import Spinner from '../components/Spinner.jsx'
import SortSelect from '../components/SortSelect.jsx'
import { fetchProducts } from '../services/productService.js'
import ProductDetailPage from './ProductDetailPage.jsx'

// ---------------------------------------------------------------------------
// ỨNG DỤNG TỔNG HỢP — gộp Câu 3 đến Câu 8 thành một cửa hàng hoàn chỉnh:
// lọc danh mục + tìm kiếm (debounce) + sắp xếp + phân trang + giỏ hàng + chi tiết.
//
// Toàn bộ state nằm ở ShopList; mọi component con đều thuần hiển thị và chỉ
// giao tiếp ngược lên bằng callback.
// ---------------------------------------------------------------------------

const PAGE_SIZE = 12
const MAX_QTY_WHEN_UNKNOWN = 99

function ShopList({ cart }) {
  // --- Bộ lọc (state do CHA sở hữu) ---
  const [category, setCategory] = useState('')
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(1)

  // --- Debounce ô tìm kiếm, viết thẳng tại đây ---
  // Mỗi lần `keyword` đổi, hẹn 400ms rồi mới sao sang `debouncedKeyword`.
  // Người dùng gõ tiếp thì cleanup HUỶ cái hẹn cũ và hẹn lại — nên chỉ lần gõ
  // cuối cùng mới thật sự gọi API. Thiếu clearTimeout là gõ 10 ký tự gọi 10 lần.
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 400)
    return () => clearTimeout(timer)
  }, [keyword])

  // --- Dữ liệu ---
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Giỏ hàng nhận từ ShopPage (xem ghi chú ở dưới về lý do đặt state ở đó).
  const { items, addToCart, changeQty, removeFromCart, clearCart } = cart

  useEffect(() => {
    // Đổi bộ lọc liên tục sinh ra nhiều request chồng nhau. Cờ `ignore` bảo đảm
    // chỉ kết quả của lần chạy MỚI NHẤT được ghi vào state — response cũ về
    // muộn sẽ bị bỏ qua thay vì ghi đè lên danh sách đang đúng.
    let ignore = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProducts({
          category,
          keyword: debouncedKeyword,
          sort,
          limit: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE,
        })
        if (ignore) return
        setProducts(data.products)
        setTotal(data.total)
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
    // Dependency liệt kê ĐỦ mọi tham số mà request phụ thuộc vào.
  }, [category, debouncedKeyword, sort, page])

  const totalPages = Math.ceil(total / PAGE_SIZE) // giá trị dẫn xuất

  // Mọi thay đổi bộ lọc đều kéo trang về 1 (Câu 6).
  function handleCategory(slug) {
    setCategory(slug)
    setPage(1)
  }
  function handleKeyword(value) {
    setKeyword(value)
    setPage(1)
  }
  function handleSort(value) {
    setSort(value)
    setPage(1)
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-slate-900">Cửa hàng</h1>

      <SearchBar
        keyword={keyword}
        onKeywordChange={handleKeyword}
        placeholder="Tìm sản phẩm... (thử: phone, laptop, watch)"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <CategoryFilter selectedCategory={category} onSelectCategory={handleCategory} />
        <SortSelect value={sort} onChange={handleSort} />
      </div>

      <p className="text-sm text-slate-500">
        {debouncedKeyword.trim()
          ? `Tìm thấy ${total} sản phẩm cho từ khoá '${debouncedKeyword.trim()}'`
          : `Tổng ${total} sản phẩm`}
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {loading ? (
            <Spinner />
          ) : error ? (
            <ErrorBox message={error} />
          ) : (
            <>
              <ProductGrid
                products={products}
                detailBasePath="/shop/products"
                onAddToCart={addToCart}
              />
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>

        <div className="sticky top-6 h-fit">
          <CartPanel
            items={items}
            onChangeQty={changeQty}
            onRemove={removeFromCart}
            onClear={clearCart}
          />
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  // Giỏ hàng phải nằm ở ĐÂY, bên TRÊN <Routes>, chứ không phải trong ShopList.
  // Nếu để trong ShopList thì mỗi lần mở trang chi tiết rồi quay lại, component
  // đó bị unmount và state giỏ hàng mất sạch. Đặt state cao hơn chỗ điều hướng
  // là cách giữ giỏ hàng sống qua mọi lần chuyển trang.
  const [items, setItems] = useState([])

  function addToCart(product) {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === product.id)
      if (existing) {
        return prev.map((it) =>
          it.id === product.id
            ? { ...it, qty: Math.min(it.qty + 1, it.stock ?? MAX_QTY_WHEN_UNKNOWN) }
            : it,
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          discountPercentage: product.discountPercentage,
          stock: product.stock,
          qty: 1,
        },
      ]
    })
  }

  function changeQty(id, nextQty) {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, qty: Math.max(1, Math.min(nextQty, it.stock ?? MAX_QTY_WHEN_UNKNOWN)) }
          : it,
      ),
    )
  }

  function removeFromCart(id) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  function clearCart() {
    setItems([])
  }

  // Bốn hàm trên giống y hệt Câu 8 — cố ý lặp lại trong bản đơn giản này, để
  // mỗi bài đọc độc lập được. Đúng lúc thấy việc copy này khó chịu là lúc nên
  // gom chúng vào một custom hook (useCart) như bản đầy đủ đã làm.
  const cart = { items, addToCart, changeQty, removeFromCart, clearCart }

  return (
    <Routes>
      <Route index element={<ShopList cart={cart} />} />
      <Route path="products/:id" element={<ProductDetailPage />} />
    </Routes>
  )
}
