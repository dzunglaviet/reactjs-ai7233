import { Link } from 'react-router'
import { EXERCISE_ROUTES } from '../routes/navigation.js'
import { API } from '../services/httpClient.js'

export default function HomePage() {
  return (
    <div className="space-y-8">
      <header className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Bài giải — Practice Set: DummyJSON API
        </h1>
        <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">
          Lời giải đầy đủ cho 10 câu trong <code className="text-sm">DummyJSON-Thuc-hanh.md</code>,
          viết bằng React 19 + Vite + TailwindCSS v4. Mỗi câu là một file độc lập đọc được một
          mạch từ trên xuống; phần trả lời bằng chữ nằm trong{' '}
          <code className="text-sm">ANSWERS.md</code>.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/shop"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Mở ứng dụng tổng hợp →
          </Link>
          <Link
            to="/bai/1"
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            Bắt đầu từ Câu 1
          </Link>
        </div>

        <p className="mt-4 font-mono text-xs break-all text-slate-400 dark:text-slate-500">API đang dùng: {API}</p>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">10 câu hỏi</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {EXERCISE_ROUTES.map((ex) => (
            <Link
              key={ex.number}
              to={ex.path}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 transition hover:border-blue-400 hover:shadow-sm"
            >
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Câu {ex.number}</p>
              <p className="mt-0.5 font-medium text-slate-900 dark:text-slate-100">{ex.navTitle}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{ex.focus}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-5">
        <h2 className="font-semibold text-amber-900 dark:text-amber-100">Sáu chỗ sinh viên hay vấp</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-amber-900 dark:text-amber-100">
          <li>
            Danh sách trả về bị bọc: <code>{'{ products, total, skip, limit }'}</code> — phải đọc{' '}
            <code>data.products</code>, không phải <code>data</code>.
          </li>
          <li>
            <code>/products/categories</code> trả mảng <strong>object</strong>{' '}
            <code>{'{ slug, name, url }'}</code> — hiện <code>name</code>, gửi đi <code>slug</code>.
          </li>
          <li>
            Id không tồn tại trả <strong>404 thật</strong>, nên <code>res.ok</code> là cách kiểm tra
            đúng ở API này.
          </li>
          <li>
            Thêm/sửa/xoá chỉ <strong>giả lập</strong> — phải tự cập nhật state, fetch lại là mất
            thay đổi.
          </li>
          <li>
            <code>rating</code> là <strong>một số</strong>, không phải object{' '}
            <code>{'{ rate, count }'}</code> như fakestoreapi cũ.
          </li>
          <li>
            <code>price</code> là giá <strong>gốc</strong>; tiền thực trả phải tính từ{' '}
            <code>discountPercentage</code>.
          </li>
        </ol>
      </section>
    </div>
  )
}
