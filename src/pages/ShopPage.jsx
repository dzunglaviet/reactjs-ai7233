import { useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router'
import CartMenu from '../components/cart/CartMenu.jsx'
import CategoryFilter from '../components/product/CategoryFilter.jsx'
import Pagination from '../components/product/Pagination.jsx'
import ProductGrid from '../components/product/ProductGrid.jsx'
import SearchBar from '../components/product/SearchBar.jsx'
import SortSelect from '../components/product/SortSelect.jsx'
import { ErrorBox, Spinner } from '../components/ui/index.js'
import useCart from '../hooks/useCart.js'
import useDebouncedValue from '../hooks/useDebouncedValue.js'
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

function ShopList({ cart }) {
  // --- Bộ lọc (state do CHA sở hữu) ---
  const [category, setCategory] = useState('')
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(1)

  // Chỉ gọi API sau khi người dùng ngừng gõ 400ms (Câu 4).
  const debouncedKeyword = useDebouncedValue(keyword, 400)

  // --- Dữ liệu ---
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Giỏ hàng nhận từ ShopPage (xem ghi chú ở dưới về lý do đặt state ở đó).
  const { items, addToCart, changeQty, removeFromCart, clearCart } = cart

  // --- Hai ca dùng useRef đúng nghĩa: thao tác DOM, không liên quan render ---
  const searchInputRef = useRef(null) // để đặt con trỏ vào ô tìm kiếm khi mở trang
  const resultsRef = useRef(null) // để cuộn lên đầu danh sách khi sang trang khác

  // Mở trang là gõ tìm được ngay, không phải bấm chuột vào ô input.
  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  // Bấm "Sau" ở cuối trang thì trang mới lại bắt đầu từ chỗ đang cuộn — rất khó
  // chịu. Mỗi lần đổi trang, kéo màn hình về đầu danh sách.
  // Bỏ qua lần đầu (page === 1 lúc mới vào) để không giật màn hình vô cớ.
  const isFirstPageRender = useRef(true)
  useEffect(() => {
    if (isFirstPageRender.current) {
      isFirstPageRender.current = false
      return
    }
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [page])

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
      {/* ---------------------------------------------------------------
          Thanh header dính trên cùng, bố cục quen thuộc của trang bán hàng:
          tên cửa hàng — ô tìm kiếm — giỏ hàng ở góc phải.
          `sticky top-0` + `-mx-4 px-4` để nền trải hết chiều ngang khi cuộn.
      ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-30 -mx-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-950/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <h1 className="hidden shrink-0 text-lg font-semibold text-slate-900 dark:text-slate-100 md:block">
            Cửa hàng
          </h1>

          <div className="min-w-0 flex-1">
            <SearchBar
              ref={searchInputRef}
              keyword={keyword}
              onKeywordChange={handleKeyword}
              placeholder="Tìm sản phẩm... (thử: phone, laptop, watch)"
            />
          </div>

          <CartMenu
            items={items}
            onChangeQty={changeQty}
            onRemove={removeFromCart}
            onClear={clearCart}
            persisted
          />
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <CategoryFilter selectedCategory={category} onSelectCategory={handleCategory} />
        <SortSelect value={sort} onChange={handleSort} />
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        {debouncedKeyword.trim()
          ? `Tìm thấy ${total} sản phẩm cho từ khoá '${debouncedKeyword.trim()}'`
          : `Tổng ${total} sản phẩm`}
      </p>

      {/* Giỏ nằm trên header nên lưới sản phẩm dùng trọn chiều ngang */}
      <div ref={resultsRef} className="scroll-mt-24 space-y-6">
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

    </div>
  )
}

export default function ShopPage() {
  // Giỏ hàng phải nằm ở ĐÂY, bên TRÊN <Routes>, chứ không phải trong ShopList.
  // Nếu để trong ShopList thì mỗi lần mở trang chi tiết rồi quay lại, component
  // đó bị unmount và state giỏ hàng mất sạch. Đặt state cao hơn chỗ điều hướng
  // là cách giữ giỏ hàng sống qua mọi lần chuyển trang.
  //
  // storageKey bật chế độ lưu xuống localStorage: giỏ hàng sống qua cả F5.
  // Có đánh số phiên bản (:v1) để sau này đổi cấu trúc dòng giỏ hàng thì chỉ
  // cần tăng lên :v2, dữ liệu cũ bị bỏ qua thay vì gây lỗi.
  const cart = useCart({ storageKey: 'dummyjson:cart:v1' })

  return (
    <Routes>
      <Route index element={<ShopList cart={cart} />} />
      <Route path="products/:id" element={<ProductDetailPage />} />
    </Routes>
  )
}
