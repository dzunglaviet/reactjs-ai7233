// DummyJSON sắp xếp THẬT theo trường: ?sortBy=price&order=asc
// (fakestoreapi cũ chỉ sắp theo id, nên ngày trước phải sort lại ở client).
// Không export: file component chỉ nên export component, nếu không React Fast
// Refresh mất tác dụng (oxlint cảnh báo react/only-export-components).
const SORT_OPTIONS = [
  { value: '', label: 'Mặc định' },
  { value: 'price:asc', label: 'Giá tăng dần' },
  { value: 'price:desc', label: 'Giá giảm dần' },
  { value: 'rating:desc', label: 'Đánh giá cao nhất' },
]

export default function SortSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-blue-500"
    >
      {SORT_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
