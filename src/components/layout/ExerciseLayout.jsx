/** Khung bọc mỗi bài: số câu, tiêu đề, tóm tắt đề và điểm mấu chốt. */
export default function ExerciseLayout({ number, title, brief, highlight, children }) {
  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
        <p className="text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase">Câu {number}</p>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{brief}</p>
        {highlight && (
          <p className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-950 px-3 py-2 text-sm text-amber-900 dark:text-amber-100">
            <strong className="font-semibold">Điểm mấu chốt: </strong>
            {highlight}
          </p>
        )}
      </header>
      {children}
    </div>
  )
}
