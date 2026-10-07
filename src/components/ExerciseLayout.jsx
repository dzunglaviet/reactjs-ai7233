/** Khung bọc mỗi bài: số câu, tiêu đề, tóm tắt đề và điểm mấu chốt. */
export default function ExerciseLayout({ number, title, brief, highlight, children }) {
  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">Câu {number}</p>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{brief}</p>
        {highlight && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <strong className="font-semibold">Điểm mấu chốt: </strong>
            {highlight}
          </p>
        )}
      </header>
      {children}
    </div>
  )
}
