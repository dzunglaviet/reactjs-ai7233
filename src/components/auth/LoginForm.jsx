import { useState } from 'react'

/**
 * Form đăng nhập.
 *
 * Con KHÔNG giữ token: nó gọi onLogin(username, password) để cha xử lý, và nhận
 * ngược lại `loading` / `error` từ cha để hiển thị. Nhờ vậy token chỉ tồn tại ở
 * một nơi duy nhất.
 */
export default function LoginForm({ onLogin, loading, error }) {
  const [username, setUsername] = useState('emilys')
  const [password, setPassword] = useState('emilyspass')

  function handleSubmit(e) {
    e.preventDefault()
    onLogin(username, password)
  }

  const field =
    'w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-blue-500'

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-sm space-y-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6"
    >
      <h2 className="font-semibold text-slate-900 dark:text-slate-100">Đăng nhập</h2>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Tên đăng nhập"
        className={field}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mật khẩu"
        className={field}
      />

      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600"
      >
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>

      <p className="text-xs text-slate-400 dark:text-slate-500">Tài khoản demo: emilys / emilyspass</p>
    </form>
  )
}
