import { lineTotal, money } from '../../utils/format.js'
import CartItem from './CartItem.jsx'

/**
 * Bảng giỏ hàng.
 *
 * Hai con số tổng đều được TÍNH LÚC RENDER từ mảng items, không hề nằm trong
 * state. Đó là giá trị dẫn xuất: cho vào useState là tự tạo ra nguồn sự thật
 * thứ hai, sớm muộn cũng lệch với giỏ hàng thật.
 */
export default function CartPanel({ items, onChangeQty, onRemove, onClear, persisted = false }) {
  const totalBefore = items.reduce((sum, it) => sum + Number(it.price) * it.qty, 0)
  const totalAfter = items.reduce((sum, it) => sum + lineTotal(it), 0)
  const saved = totalBefore - totalAfter

  return (
    // Không đặt `sticky` ở đây: component này được dùng ở hai nơi (cột bên phải
    // của Câu 8, và trong menu thả xuống CartMenu). Việc định vị để nơi gọi lo.
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">
          Giỏ hàng{' '}
          <span className="text-sm font-normal text-slate-500 dark:text-slate-400">({items.length} mặt hàng)</span>
        </h2>

        {onClear && items.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 text-xs text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:underline"
          >
            Xoá tất cả
          </button>
        )}
      </div>

      {persisted && (
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Giỏ hàng được lưu lại sau khi tải lại trang</p>
      )}

      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">Giỏ hàng đang trống</p>
      ) : (
        <>
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onChangeQty={onChangeQty}
                onRemove={onRemove}
              />
            ))}
          </ul>

          <dl className="mt-4 space-y-1 border-t border-slate-200 dark:border-slate-700 pt-4 text-sm">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <dt>Tạm tính</dt>
              <dd>{money(totalBefore)}</dd>
            </div>
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <dt>Khuyến mãi</dt>
              <dd>−{money(saved)}</dd>
            </div>
            <div className="flex justify-between pt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
              <dt>Thành tiền</dt>
              <dd>{money(totalAfter)}</dd>
            </div>
          </dl>
        </>
      )}
    </div>
  )
}
