import { useContext, useState } from 'react'
import EmptyState from '../components/EmptyState.jsx'
import ErrorBox from '../components/ErrorBox.jsx'
import ExerciseLayout from '../components/ExerciseLayout.jsx'
import LoginForm from '../components/LoginForm.jsx'
import Spinner from '../components/Spinner.jsx'
import { AuthContext } from '../context/authContext.js'
import { fetchUserCarts } from '../services/cartService.js'
import { fetchProductById } from '../services/productService.js'
import { money } from '../utils/format.js'

// ---------------------------------------------------------------------------
// CÂU 10 (tổng hợp) — Đăng nhập, lấy giỏ hàng thật, ghép thêm dữ liệu tồn kho.
//
// Phân chia trách nhiệm:
//   AuthContext (useReducer)  : isLoggedIn, userInfo, token, login, logout
//   CartSummary (useState)    : dữ liệu giỏ hàng của riêng màn hình này
//   LoginForm                 : chỉ nhận callback, không biết gì về token
//
// State đăng nhập nằm ở Context vì nó TOÀN CỤC — ô trạng thái ở sidebar và cổng
// đăng nhập của Câu 9 cũng đọc nó, mà không có props nào nối ba chỗ đó với nhau.
// Còn dữ liệu giỏ hàng chỉ màn hình này cần nên để useState tại chỗ. Không phải
// cái gì cũng tống hết vào Context.
//
// Bảy trạng thái phải xử lý: chưa đăng nhập / đang đăng nhập / sai mật khẩu /
// đang tải giỏ / giỏ trống / một dòng lỗi tồn kho / tải xong.
// ---------------------------------------------------------------------------

function CartSummary() {
  // --- Đăng nhập: lấy hết từ Context, không một useState nào cho token ---
  const {
    isLoggedIn,
    userInfo,
    token,
    loading: loggingIn,
    error: loginError,
    login,
    logout,
  } = useContext(AuthContext)

  // --- State giỏ hàng ---
  const [lines, setLines] = useState([])
  const [cartTotals, setCartTotals] = useState(null)
  const [loadingCart, setLoadingCart] = useState(false)
  const [cartError, setCartError] = useState(null)

  async function handleLogin(username, password) {
    // login() của AuthProvider trả về userInfo khi thành công, null khi thất bại —
    // nhờ vậy ở đây biết có nên tải giỏ hàng tiếp hay không, mà không phải tự đọc
    // state (setState không cập nhật biến ngay, dòng dưới vẫn thấy giá trị cũ).
    const user = await login(username, password)
    if (user) await loadCart(user.id)
  }

  function handleLogout() {
    setLines([])
    setCartTotals(null)
    setCartError(null)
    logout()
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
      // /products/{id} cho từng dòng — và gọi SONG SONG, không tuần tự.
      //
      // allSettled chứ không phải all: với Promise.all, một dòng lỗi là cả giỏ
      // vỡ. allSettled luôn chờ xong hết và trả về trạng thái từng cái, nên chỉ
      // dòng lỗi báo lỗi, phần còn lại vẫn hiển thị bình thường.
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
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        {userInfo.image && <img src={userInfo.image} alt="" className="h-10 w-10 rounded-full" />}
        <div className="min-w-0">
          <p className="font-medium text-slate-900">
            {userInfo.firstName} {userInfo.lastName}
          </p>
          <p className="truncate text-xs text-slate-500">{userInfo.email}</p>
          {/* Chỉ in 12 ký tự đầu của token cho thấy nó có thật — tuyệt đối
              không in cả token ra giao diện trong dự án thật. */}
          <p className="mt-0.5 font-mono text-[11px] text-slate-400">
            token: {token.slice(0, 12)}…
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="ml-auto shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:border-slate-400"
        >
          Đăng xuất
        </button>
      </div>

      {/* --- Trạng thái 4: đang tải giỏ --- */}
      {loadingCart ? (
        <Spinner label="Đang tải giỏ hàng..." />
      ) : cartError ? (
        <ErrorBox message={cartError} onRetry={() => loadCart(userInfo.id)} />
      ) : lines.length === 0 ? (
        /* --- Trạng thái 5: giỏ trống --- */
        <EmptyState>Người dùng này chưa có giỏ hàng nào</EmptyState>
      ) : (
        <>
          <ul className="rounded-xl border border-slate-200 bg-white px-5">
            {lines.map((line) => (
              <CartLine key={line.id} line={line} />
            ))}
          </ul>

          {cartTotals && (
            <dl className="rounded-xl border border-slate-200 bg-white p-5 text-sm">
              <div className="flex justify-between text-slate-500">
                <dt>Tạm tính ({cartTotals.totalQuantity} sản phẩm)</dt>
                <dd>{money(cartTotals.total)}</dd>
              </div>
              <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
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

/**
 * Một dòng giỏ hàng. Thuần hiển thị, không state.
 *
 * Để ngay trong file này vì chỉ Câu 10 dùng tới nó — component nhỏ dùng một chỗ
 * thì cứ đặt cạnh chỗ dùng, đừng tách file cho "gọn".
 */
function CartLine({ line }) {
  const { title, price, quantity, total, discountedTotal, thumbnail, stock, stockError } = line

  // --- Trạng thái 6: riêng dòng này lỗi khi hỏi tồn kho ---
  const overStock = stock != null && quantity > stock

  return (
    <li className="flex gap-3 border-b border-slate-100 py-4 last:border-0">
      {thumbnail && (
        <img src={thumbnail} alt={title} className="h-16 w-16 rounded-lg object-contain" />
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-900">{title}</p>
        <p className="text-sm text-slate-500">
          {money(price)} × {quantity}
        </p>

        {stockError && (
          <p className="mt-1 text-xs text-amber-600">Không lấy được tồn kho cho dòng này</p>
        )}
        {overStock && (
          <p className="mt-1 text-xs text-rose-600">Vượt tồn kho — chỉ còn {stock}</p>
        )}
      </div>

      <div className="text-right">
        <p className="font-semibold text-slate-900">{money(discountedTotal)}</p>
        {discountedTotal < total && (
          <p className="text-xs text-slate-400 line-through">{money(total)}</p>
        )}
      </div>
    </li>
  )
}

export default function Q10UserCart() {
  return (
    <ExerciseLayout
      number={10}
      title="Đăng nhập (useReducer + Context) và Promise.allSettled"
      brief="State đăng nhập quản lý bằng useReducer trong AuthContext: isLoggedIn, userInfo, token, login, logout. Sau khi đăng nhập, tải /carts/user/:id rồi ghép thêm tồn kho cho từng dòng bằng các request chạy song song."
      highlight="Đăng nhập xong hãy nhìn sidebar bên trái — nó cập nhật theo mà không hề nhận props từ đây. Đó là Context. Tài khoản demo: emilys / emilyspass; trường token tên là accessToken, không phải token."
    >
      <CartSummary />
    </ExerciseLayout>
  )
}
