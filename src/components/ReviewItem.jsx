/** Một dòng đánh giá — tầng sâu nhất của cây component ở Câu 7. */
export default function ReviewItem({ review }) {
  const { reviewerName, rating, comment, date } = review

  return (
    <li className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="font-medium text-slate-900">{reviewerName ?? 'Ẩn danh'}</p>
        <span className="text-sm text-amber-600">{rating} ★</span>
      </div>
      <p className="mt-1 text-sm text-slate-600">{comment}</p>
      {date && (
        <p className="mt-2 text-xs text-slate-400">
          {new Date(date).toLocaleDateString('vi-VN')}
        </p>
      )}
    </li>
  )
}
