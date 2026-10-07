import useAuth from '../../hooks/useAuth.js'
import LoginForm from './LoginForm.jsx'

/**
 * Cổng đăng nhập: chưa đăng nhập thì chặn lại và hiện form, đăng nhập rồi mới
 * cho xem nội dung bên trong.
 *
 * Viết thành component bọc (`<RequireAuth><NoiDung /></RequireAuth>`) thay vì
 * rải `if (!isLoggedIn) return ...` trong từng màn hình: luật kiểm tra nằm một
 * chỗ, và màn hình bên trong chỉ cần lo việc của nó, coi như luôn có người dùng
 * hợp lệ.
 *
 * Form đăng nhập ở đây gọi thẳng `login` lấy từ AuthContext — nên đăng nhập tại
 * Câu 9 thì sidebar và cả Câu 10 cũng nhận ra ngay, không cần truyền gì cả.
 */
export default function RequireAuth({
  children,
  message = 'Chức năng này yêu cầu đăng nhập.',
}) {
  const { isLoggedIn, loading, error, login } = useAuth()

  if (isLoggedIn) return children

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-4 text-sm text-amber-900 dark:text-amber-100">
        <p className="font-medium">Cần đăng nhập</p>
        <p className="mt-1">{message}</p>
      </div>

      <LoginForm onLogin={login} loading={loading} error={error} />
    </div>
  )
}
