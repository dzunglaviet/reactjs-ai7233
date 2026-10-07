import { money } from '../../utils/format.js'
import { Badge } from '../ui/index.js'

/**
 * Một dòng giỏ hàng của user (Câu 10).
 *
 * Dòng này đã được cha GHÉP THÊM dữ liệu tồn kho từ /products/{id}.
 * Nó không tự fetch gì cả — nếu mỗi dòng tự gọi API thì 5 dòng là 5 request
 * rời rạc, đúng thứ Câu 10 muốn tránh.
 */
export default function CartLine({ line }) {
  const { title, price, quantity, total, discountedTotal, thumbnail, stock, stockError } = line

  const overStock = stock != null && quantity > stock

  return (
    <li className="flex gap-3 border-b border-slate-100 dark:border-slate-700 py-4 last:border-0">
      {thumbnail && (
        <img src={thumbnail} alt={title} className="h-16 w-16 rounded-lg object-contain" />
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-900 dark:text-slate-100">{title}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {money(price)} × {quantity}
        </p>

        <div className="mt-1.5">
          {stockError ? (
            <Badge tone="amber">Không tải được tồn kho</Badge>
          ) : overStock ? (
            <Badge tone="rose">Chỉ còn {stock} sản phẩm — vượt quá tồn kho</Badge>
          ) : (
            <Badge tone="green">Còn {stock} trong kho</Badge>
          )}
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold text-slate-900 dark:text-slate-100">{money(discountedTotal)}</p>
        {discountedTotal < total && (
          <p className="text-xs text-slate-400 dark:text-slate-500 line-through">{money(total)}</p>
        )}
      </div>
    </li>
  )
}
