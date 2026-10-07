import { Link } from 'react-router'
import { discountedPrice, money } from '../utils/format.js'
import Badge from './Badge.jsx'

// ---------------------------------------------------------------------------
// Thẻ sản phẩm — component THUẦN HIỂN THỊ (presentational).
// Không state, không useEffect, không gọi API.
// Mọi hành động đều báo ngược lên cha qua callback props.
// ---------------------------------------------------------------------------
export default function ProductCard({
  product,
  currency = '$', // default parameter
  detailTo, // có -> bọc tiêu đề trong <Link> (Câu 7)
  onAddToCart, // có -> hiện nút "Thêm vào giỏ" (Câu 8)
  onEdit, // có -> hiện nút "Sửa" (Câu 9)
  onDelete, // có -> hiện nút "Xoá" (Câu 9)
  deleting = false,
  editing = false, // sản phẩm này đang được mở trong form sửa
}) {
  const { title, price, discountPercentage, thumbnail, rating, stock } = product
  const outOfStock = stock === 0
  const hasDiscount = Number(discountPercentage) > 0

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-xl border bg-white transition hover:shadow-md ${
        editing ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'
      }`}
    >
      <div className="relative flex h-40 items-center justify-center bg-slate-50 p-3">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="h-full object-contain" loading="lazy" />
        ) : (
          <span className="text-slate-400">—</span>
        )}
        {hasDiscount && (
          <span className="absolute top-2 left-2 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
            -{Math.round(discountPercentage)}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-medium text-slate-900">
          {detailTo ? (
            <Link to={detailTo} className="hover:text-blue-600 hover:underline">
              {title ?? '—'}
            </Link>
          ) : (
            (title ?? '—')
          )}
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-slate-900">
            {money(discountedPrice(price, discountPercentage), currency)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-slate-400 line-through">{money(price, currency)}</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          {/* rating của DummyJSON là MỘT SỐ, không phải object { rate, count } */}
          <span className="text-sm text-amber-600">{rating != null ? `${rating} ★` : '—'}</span>
          {outOfStock ? <Badge tone="rose">Hết hàng</Badge> : <Badge tone="green">Còn {stock ?? '—'}</Badge>}
        </div>

        {(onAddToCart || onEdit || onDelete) && (
          <div className="flex gap-2 pt-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              >
                {editing ? 'Đang sửa...' : 'Sửa'}
              </button>
            )}
            {onAddToCart && (
              <button
                type="button"
                disabled={outOfStock}
                // Bọc trong arrow function. Viết onClick={onAddToCart(product)}
                // sẽ gọi callback NGAY LÚC RENDER — lỗi kinh điển của Buổi 4.
                onClick={() => onAddToCart(product)}
                className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                {outOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                disabled={deleting}
                onClick={() => onDelete(product.id)}
                className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50"
              >
                {deleting ? '...' : 'Xoá'}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
