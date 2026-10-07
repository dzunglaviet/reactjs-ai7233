import { discountedPrice, money } from '../../utils/format.js'

/**
 * Một dòng trong giỏ.
 *
 * Không tự sửa số lượng — mọi thay đổi đều gọi ngược lên cha:
 *   onChangeQty(id, newQty) / onRemove(id)
 */
export default function CartItem({ item, onChangeQty, onRemove }) {
  const { id, title, price, discountPercentage, qty, stock, thumbnail } = item
  const unit = discountedPrice(price, discountPercentage)
  const atMax = stock != null && qty >= stock

  const qtyBtn =
    'h-7 w-7 rounded-md border border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <li className="flex gap-3 py-3">
      {thumbnail && (
        <img src={thumbnail} alt={title} className="h-14 w-14 rounded-md object-contain" />
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{money(unit)} / sản phẩm</p>

        <div className="mt-1.5 flex items-center gap-2">
          <button type="button" className={qtyBtn} onClick={() => onChangeQty(id, qty - 1)}>
            −
          </button>
          <span className="w-8 text-center text-sm font-medium">{qty}</span>
          <button
            type="button"
            className={qtyBtn}
            disabled={atMax} // không cho đặt vượt tồn kho
            onClick={() => onChangeQty(id, qty + 1)}
          >
            +
          </button>

          <button
            type="button"
            onClick={() => onRemove(id)}
            className="ml-auto text-xs text-rose-600 dark:text-rose-400 hover:underline"
          >
            Xoá
          </button>
        </div>

        {atMax && <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">Đã đạt tồn kho tối đa ({stock})</p>}
      </div>

      <div className="text-right text-sm font-semibold text-slate-900 dark:text-slate-100">{money(unit * qty)}</div>
    </li>
  )
}
