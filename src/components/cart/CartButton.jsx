import { money } from '../../utils/format.js'

/**
 * Nút giỏ hàng trên thanh header.
 *
 * Thuần hiển thị: không giữ state, chỉ nhận số liệu để vẽ và gọi onClick.
 * Tổng tiền chỉ hiện từ màn hình sm trở lên cho đỡ chật trên điện thoại.
 */
export default function CartButton({ ref, quantity = 0, total = 0, isOpen, onClick }) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-label={quantity > 0 ? `Giỏ hàng, ${quantity} sản phẩm` : 'Giỏ hàng đang trống'}
      className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
        isOpen
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500'
      }`}
    >
      <span className="relative">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M2 3h2.5l2.2 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.55L21 7H6" />
        </svg>

        {/* Badge đếm — chỉ hiện khi giỏ có hàng */}
        {quantity > 0 && (
          <span className="absolute -top-2 -right-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white ring-2 ring-white">
            {quantity > 99 ? '99+' : quantity}
          </span>
        )}
      </span>

      <span className="hidden sm:inline">{quantity > 0 ? money(total) : 'Giỏ hàng'}</span>
    </button>
  )
}
