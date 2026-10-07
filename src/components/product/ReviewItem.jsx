/** Một dòng đánh giá — tầng sâu nhất của cây component ở Câu 7. */
export default function ReviewItem({ review }) {
  const { reviewerName, rating, comment, date } = review

  return (
    <li className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
      <div className="flex items-center justify-between">
        <p className="font-medium text-slate-900 dark:text-slate-100">{reviewerName ?? 'Ẩn danh'}</p>
        <span className="text-sm text-amber-600 dark:text-amber-400">{rating} ★</span>
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{comment}</p>
      {date && (
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          {new Date(date).toLocaleDateString('vi-VN')}
        </p>
      )}
    </li>
  )
}
