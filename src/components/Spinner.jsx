export default function Spinner({ label = 'Đang tải...' }) {
  return (
    <div className="flex items-center gap-3 py-10 text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
      <span>{label}</span>
    </div>
  )
}
