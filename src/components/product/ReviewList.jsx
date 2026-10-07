import ReviewItem from './ReviewItem.jsx'

/** Danh sách đánh giá: tầng giữa, chỉ nhận mảng và map ra ReviewItem. */
export default function ReviewList({ reviews = [] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Chưa có đánh giá nào</p>
  }

  return (
    <ul className="space-y-3">
      {reviews.map((review, index) => (
        // Mảng reviews không có id. Ghép reviewerEmail + date thành khoá hợp lý;
        // kẹp thêm index để chắc chắn duy nhất nếu API trả trùng.
        <ReviewItem
          key={`${review.reviewerEmail ?? 'anon'}-${review.date ?? index}`}
          review={review}
        />
      ))}
    </ul>
  )
}
