import { EmptyState } from '../ui/index.js'
import CartLine from './CartLine.jsx'

/** Tầng giữa: nhận mảng đã ghép đủ dữ liệu và map ra từng CartLine. */
export default function CartLineList({ lines }) {
  if (lines.length === 0) return <EmptyState>Giỏ hàng trống</EmptyState>

  return (
    <ul className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5">
      {lines.map((line) => (
        <CartLine key={line.id} line={line} />
      ))}
    </ul>
  )
}
