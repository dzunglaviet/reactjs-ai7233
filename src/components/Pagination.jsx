/**
 * Phân trang — component thuần hiển thị.
 *
 * Nó KHÔNG tự tính totalPages: con số đó suy ra từ `total` trong response, mà
 * chỉ cha mới có. Cha tính rồi truyền xuống, con chỉ việc báo ngược lên trang
 * được bấm qua onPageChange.
 */
export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const btn =
    'rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        className={btn}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Trước
      </button>

      <span className="text-sm text-slate-600">
        Trang <strong className="text-slate-900">{page}</strong> / {totalPages}
      </span>

      <button
        type="button"
        className={btn}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Sau →
      </button>
    </div>
  )
}
