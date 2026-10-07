import { useEffect, useState } from 'react'
import CartPanel from '../components/CartPanel.jsx'
import ErrorBox from '../components/ErrorBox.jsx'
import ExerciseLayout from '../components/ExerciseLayout.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import Spinner from '../components/Spinner.jsx'
import { fetchProducts } from '../services/productService.js'

// ---------------------------------------------------------------------------
// CÂU 8 — Giỏ hàng: dữ liệu đi xuyên qua BA TẦNG component.
//
//   CartDemo (sở hữu giỏ)
//      └── ProductGrid        <- chỉ CHUYỂN TIẾP onAddToCart, không dùng tới nó
//            └── ProductCard  <- nơi thật sự bấm nút
//
//   CartDemo
//      └── CartPanel
//            └── CartItem     <- gọi ngược onChangeQty / onRemove lên tận CartDemo
//
// ProductGrid phải nhận callback dù không dùng, vì chỉ CartDemo mới sửa được
// state của CartDemo. Đó là "prop drilling" — lý do tồn tại của Context.
// ---------------------------------------------------------------------------

const MAX_QTY_WHEN_UNKNOWN = 99 // dùng khi sản phẩm không khai báo stock

function CartDemo() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Toàn bộ state giỏ hàng nằm ở ĐÂY, không ở component con nào.
  const [items, setItems] = useState([])

  useEffect(() => {
    async function load() {
      try {
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

  /**
   * Thêm vào giỏ.
   *
   * Luôn dùng DẠNG HÀM của setState (prev => ...) khi giá trị mới phụ thuộc giá
   * trị cũ. Viết setItems([...items, x]) sẽ đọc `items` của lần render này —
   * bấm nhanh hai lần là mất một lần thêm.
   *
   * Và luôn TẠO MẢNG/OBJECT MỚI. Sửa trực tiếp (items.push) thì React không
   * thấy gì thay đổi và sẽ không render lại.
   */
  function addToCart(product) {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === product.id)

      // Đã có trong giỏ -> chỉ tăng số lượng, không thêm dòng mới.
      if (existing) {
        return prev.map((it) =>
          it.id === product.id
            ? { ...it, qty: Math.min(it.qty + 1, it.stock ?? MAX_QTY_WHEN_UNKNOWN) }
            : it,
        )
      }

      // Chỉ lấy đúng những trường giỏ hàng cần, không nhét cả object sản phẩm.
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

  /** Số lượng bị kẹp trong khoảng [1, stock] — không âm, không vượt tồn kho. */
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
      brief="CartDemo giữ giỏ hàng; nút 'Thêm vào giỏ' nằm ở ProductCard, cách đó hai tầng. Thêm trùng thì tăng số lượng, số lượng không vượt tồn kho và không xuống dưới 1."
      highlight="Tổng tiền sau giảm KHÔNG nằm trong state — nó được tính lúc render từ mảng items, vì đó là giá trị dẫn xuất."
    >
      <CartDemo />
    </ExerciseLayout>
  )
}
