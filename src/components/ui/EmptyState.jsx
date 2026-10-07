export default function EmptyState({ children = 'Không có dữ liệu' }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-10 text-center text-slate-500 dark:text-slate-400">
      {children}
    </div>
  )
}
