export default function ErrorBox({ message, onRetry }) {
  return (
    <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-4 text-rose-800 dark:text-rose-200">
      <p className="font-medium">Đã xảy ra lỗi</p>
      <p className="mt-1 text-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700"
        >
          Thử lại
        </button>
      )}
    </div>
  )
}
