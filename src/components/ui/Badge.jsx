const TONES = {
  slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  green: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
  amber: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
  rose: 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300',
  blue: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
}

export default function Badge({ children, tone = 'slate' }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${TONES[tone]}`}>
      {children}
    </span>
  )
}
