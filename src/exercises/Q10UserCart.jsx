import { useState } from 'react'
import LoginForm from '../components/auth/LoginForm.jsx'
import CartLineList from '../components/cart/CartLineList.jsx'
import ExerciseLayout from '../components/layout/ExerciseLayout.jsx'
import useAuth from '../hooks/useAuth.js'
import { fetchUserCarts } from '../services/cartService.js'
import { fetchProductById } from '../services/productService.js'
import { ErrorBox, Spinner } from '../components/ui/index.js'
import { money } from '../utils/format.js'

// ---------------------------------------------------------------------------
// CÂU 10 (tổng hợp) — Đăng nhập, lấy giỏ hàng thật, ghép thêm dữ liệu tồn kho.
//
// Phân chia trách nhiệm:
//   AuthContext (useReducer)  : isLoggedIn, userInfo, token, login, logout
//   CartSummary (useState)    : dữ liệu giỏ hàng của riêng màn hình này
//   LoginForm                 : chỉ nhận callback, không biết gì về token
//   CartLineList -> CartLine  : hiển thị
//
// State đăng nhập nằm ở Context vì nó TOÀN CỤC (sidebar cũng dùng); còn dữ liệu
// giỏ hàng chỉ màn hình này cần nên để useState tại chỗ. Không phải cái gì cũng
// tống hết vào Context.
//
// Bảy trạng thái phải xử lý: chưa đăng nhập / đang đăng nhập / sai mật khẩu /
// đang tải giỏ / giỏ trống / một dòng lỗi tồn kho / tải xong.
// ---------------------------------------------------------------------------

function CartSummary() {
  // Toàn bộ phần đăng nhập lấy từ Context — không còn useState nào cho token.
  const { isLoggedIn, userInfo, loading: loggingIn, error: loginError, login } = useAuth()

  const [lines, setLines] = useState([])
  const [cartTotals, setCartTotals] = useState(null)
  const [loadingCart, setLoadingCart] = useState(false)
  const [cartError, setCartError] = useState(null)

  async function handleLogin(username, password) {
    // login() trả về userInfo khi thành công, null khi thất bại — nhờ vậy ở đây
    // biết có nên tải giỏ hàng tiếp hay không, mà không phải tự đọc state.
    const user = await login(username, password)
    if (user) await loadCart(user.id)
  }

  async function loadCart(userId) {
    setCartError(null)
    setLoadingCart(true)

    try {
      // fetchUserCarts đã bóc lớp bọc ngoài { carts: [...] } giúp.
      const carts = await fetchUserCarts(userId)

      if (carts.length === 0) {
        setLines([])
        setCartTotals(null)
        return
      }

      const cart = carts[0]
      setCartTotals({
        total: cart.total,
        discountedTotal: cart.discountedTotal,
        totalQuantity: cart.totalQuantity,
      })

      // --- Phần cốt lõi của bài ------------------------------------------
      // Dòng giỏ hàng có title/price/thumbnail nhưng THIẾU stock. Phải gọi
      // /products/{id} cho từng dòng — và gọi SONG SONG.
      //
      // allSettled chứ không phải all: một dòng lỗi thì chỉ dòng đó báo lỗi,
      // cả giỏ vẫn hiển thị bình thường.
      const results = await Promise.allSettled(
        cart.products.map((line) => fetchProductById(line.id)),
      )

      const merged = cart.products.map((line, i) => {
        const result = results[i]
        return result.status === 'fulfilled'
          ? { ...line, stock: result.value.stock, stockError: false }
          : { ...line, stock: null, stockError: true }
      })

      setLines(merged)
    } catch (err) {
      setCartError(err.message)
    } finally {
      setLoadingCart(false)
    }
  }

  // --- Trạng thái 1, 2, 3: chưa đăng nhập / đang đăng nhập / sai mật khẩu ---
  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} loading={loggingIn} error={loginError} />
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        {userInfo?.image && <img src={userInfo.image} alt="" className="h-10 w-10 rounded-full" />}
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">
            {userInfo?.firstName} {userInfo?.lastName}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{userInfo?.email}</p>
        </div>
        <p className="ml-auto text-xs text-slate-400 dark:text-slate-500">
          Nút đăng xuất nằm ở sidebar — cùng một Context
        </p>
      </div>

      {/* --- Trạng thái 4: đang tải giỏ --- */}
      {loadingCart ? (
        <Spinner label="Đang tải giỏ hàng..." />
      ) : cartError ? (
        <ErrorBox message={cartError} onRetry={() => loadCart(userInfo.id)} />
      ) : (
        <>
          {/* --- Trạng thái 5, 6, 7 nằm trong CartLineList/CartLine --- */}
          <CartLineList lines={lines} />

          {cartTotals && (
            <dl className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 text-sm">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <dt>Tạm tính ({cartTotals.totalQuantity} sản phẩm)</dt>
                <dd>{money(cartTotals.total)}</dd>
              </div>
              <div className="mt-2 flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                <dt>Thành tiền</dt>
                <dd>{money(cartTotals.discountedTotal)}</dd>
              </div>
            </dl>
          )}
        </>
      )}
    </div>
  )
}

export default function Q10UserCart() {
  return (
    <ExerciseLayout
      number={10}
      title="Đăng nhập (useReducer + Context) và Promise.all"
      brief="State đăng nhập quản lý bằng useReducer trong AuthContext: isLoggedIn, userInfo, token, login, logout. Sau khi đăng nhập, tải /carts/user/:id rồi ghép thêm tồn kho cho từng dòng bằng các request chạy song song."
      highlight="Đăng nhập xong hãy nhìn sidebar bên trái — nó cập nhật theo mà không hề nhận props từ đây. Đó là Context."
    >
      <CartSummary />
    </ExerciseLayout>
  )
}
