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
    'rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:border-slate-400 dark:hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40'

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

      <span className="text-sm text-slate-600 dark:text-slate-300">
        Trang <strong className="text-slate-900 dark:text-slate-100">{page}</strong> / {totalPages}
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
