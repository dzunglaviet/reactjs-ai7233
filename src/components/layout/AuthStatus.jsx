import useAuth from '../../hooks/useAuth.js'

/**
 * Ô trạng thái đăng nhập trong sidebar.
 *
 * Component này nằm ở một nhánh HOÀN TOÀN KHÁC với Q10UserCart — nơi thật sự
 * thực hiện việc đăng nhập. Không có props nào nối hai chỗ đó với nhau, cả hai
 * chỉ gọi useAuth(). Đây đúng là tình huống Context sinh ra để giải quyết:
 * truyền bằng props sẽ phải đi qua App → AppLayout → Sidebar, toàn những
 * component chẳng liên quan gì tới đăng nhập.
 */
export default function AuthStatus() {
  const { isLoggedIn, userInfo, logout } = useAuth()

  if (!isLoggedIn) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 px-3 py-2 text-xs text-slate-400 dark:text-slate-500">
        Chưa đăng nhập — xem Câu 10
      </p>
    )
  }

  return (
    <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 px-3 py-2">
      <div className="flex items-center gap-2">
        {userInfo?.image && (
          <img src={userInfo.image} alt="" className="h-7 w-7 rounded-full bg-white dark:bg-slate-800" />
        )}
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-emerald-900 dark:text-emerald-100">
            {userInfo?.firstName} {userInfo?.lastName}
          </p>
          <p className="truncate text-[11px] text-emerald-700 dark:text-emerald-300">@{userInfo?.username}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={logout}
        className="mt-2 w-full rounded-md border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900"
      >
        Đăng xuất
      </button>
    </div>
  )
}
