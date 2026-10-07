import { useEffect, useState } from 'react'
import ExerciseLayout from '../components/layout/ExerciseLayout.jsx'
import CartPanel from '../components/cart/CartPanel.jsx'
import ProductGrid from '../components/product/ProductGrid.jsx'
import useCart from '../hooks/useCart.js'
import { fetchProducts } from '../services/productService.js'
import { ErrorBox, Spinner } from '../components/ui/index.js'

// ---------------------------------------------------------------------------
// CÂU 8 — Giỏ hàng: dữ liệu đi xuyên qua BA TẦNG component.
//
//   ShopPage (sở hữu giỏ)
//      └── ProductGrid        <- chỉ CHUYỂN TIẾP onAddToCart, không dùng tới nó
//            └── ProductCard  <- nơi thật sự bấm nút
//
//   ShopPage
//      └── CartPanel
//            └── CartItem     <- gọi ngược onChangeQty / onRemove lên tận ShopPage
//
// ProductGrid phải nhận callback dù không dùng, vì chỉ ShopPage mới sửa được
// state của ShopPage. Đó là "prop drilling" — lý do tồn tại của Context sau này.
// ---------------------------------------------------------------------------

function ShopPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Toàn bộ state + logic giỏ hàng nằm ở ĐÂY (qua custom hook), không ở con nào.
  //
  // Cố ý KHÔNG truyền storageKey: giỏ ở bài tập này chỉ nằm trong bộ nhớ.
  // Nếu bật lưu localStorage ở đây, nó sẽ dùng chung dữ liệu với ứng dụng tổng
  // hợp ở /shop — thêm hàng bên này lại hiện bên kia, rất rối khi demo.
  // Xem pages/ShopPage.jsx để biết cách bật lưu.
  const { items, addToCart, changeQty, removeFromCart, clearCart } = useCart()

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const data = await fetchProducts({ limit: 8 })
        setProducts(data.products)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorBox message={error} />
        ) : (
          <ProductGrid products={products} onAddToCart={addToCart} />
        )}
      </div>

      {/* Bài tập giữ giỏ hàng ở cột bên phải cho dễ nhìn khi giảng.
          Bản giỏ nổi (nút tròn + badge) nằm ở ứng dụng tổng hợp /shop. */}
      <div className="sticky top-6 h-fit">
        <CartPanel
          items={items}
          onChangeQty={changeQty}
          onRemove={removeFromCart}
          onClear={clearCart}
        />
      </div>
    </div>
  )
}

export default function Q08Cart() {
  return (
    <ExerciseLayout
      number={8}
      title="Giỏ hàng — truyền callback qua ba tầng"
      brief="ShopPage giữ giỏ hàng; nút 'Thêm vào giỏ' nằm ở ProductCard, cách đó hai tầng. Thêm trùng thì tăng số lượng, số lượng không vượt tồn kho và không xuống dưới 1."
      highlight="Tổng tiền sau giảm KHÔNG nằm trong state — nó được tính lúc render từ mảng items, vì đó là giá trị dẫn xuất."
    >
      <ShopPage />
    </ExerciseLayout>
  )
}
