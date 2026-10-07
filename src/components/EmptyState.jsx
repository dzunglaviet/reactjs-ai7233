export default function EmptyState({ children = 'Không có dữ liệu' }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
      {children}
    </div>
  )
}
