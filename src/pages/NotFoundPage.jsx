import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 text-center">
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">404</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">Không có trang này.</p>
      <Link
        to="/"
        className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Về trang giới thiệu
      </Link>
    </div>
  )
}
