import useTheme from '../../hooks/useTheme.js'

/**
 * Nút chuyển sáng/tối.
 *
 * Component này KHÔNG nhận props nào về giao diện và cũng không có state:
 * nó lấy thẳng từ useTheme(). Nhờ vậy đặt được ở bất kỳ đâu trong app — sidebar,
 * menu mobile, hay sau này là một trang Cài đặt — mà không ai phải truyền gì.
 *
 * So sánh với CartButton.jsx: nút giỏ hàng nhận quantity/total qua props vì giỏ
 * hàng chỉ thuộc về trang /shop. Còn giao diện sáng/tối là chuyện toàn app.
 * Cùng là một cái nút, nhưng phạm vi dữ liệu khác nhau thì cách lấy dữ liệu
 * cũng phải khác nhau.
 */
export default function ThemeToggle({ showLabel = true }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      // aria-pressed cho trình đọc màn hình biết đây là công tắc hai trạng thái,
      // chứ không phải một nút bấm thường.
      aria-pressed={isDark}
      aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      title={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      {showLabel && <span>{isDark ? 'Giao diện sáng' : 'Giao diện tối'}</span>}
    </button>
  )
}

/* Hai icon để ngay trong file này: chúng chỉ phục vụ đúng cái nút này, tách ra
   file riêng chỉ làm dự án rối thêm. Component nhỏ dùng một chỗ thì cứ để cạnh
   chỗ dùng nó. */

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8z" />
    </svg>
  )
}
