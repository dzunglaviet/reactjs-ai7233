import { discountedPrice, money } from '../utils/format.js'
import Badge from './Badge.jsx'
import ReviewList from './ReviewList.jsx'

/**
 * Hiển thị chi tiết sản phẩm.
 *
 * Thuần trình bày: nhận product đã tải xong qua props, không biết gì về
 * useParams, fetch hay loading — việc đó là của ProductDetailPage.
 */
export default function ProductDetailView({ product }) {
  const {
    title,
    brand,
    category,
    price,
    discountPercentage,
    description,
    rating,
    stock,
    availabilityStatus,
    warrantyInformation,
    shippingInformation,
    returnPolicy,
    images,
    thumbnail,
    reviews,
  } = product

  const cover = images?.[0] ?? thumbnail

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex h-80 items-center justify-center rounded-xl border border-slate-200 bg-white p-6">
          {cover ? (
            <img src={cover} alt={title} className="h-full object-contain" />
          ) : (
            <span className="text-slate-400">Không có ảnh</span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {brand && <Badge tone="blue">{brand}</Badge>}
              {category && <Badge>{category}</Badge>}
              {stock === 0 ? (
                <Badge tone="rose">Hết hàng</Badge>
              ) : (
                <Badge tone="green">{availabilityStatus ?? `Còn ${stock}`}</Badge>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-amber-600">{rating} ★</p>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">
              {money(discountedPrice(price, discountPercentage))}
            </span>
            {Number(discountPercentage) > 0 && (
              <>
                <span className="text-lg text-slate-400 line-through">{money(price)}</span>
                <Badge tone="rose">-{Math.round(discountPercentage)}%</Badge>
              </>
            )}
          </div>

          <p className="leading-relaxed text-slate-600">{description}</p>

          <dl className="grid gap-2 border-t border-slate-200 pt-4 text-sm">
            {warrantyInformation && (
              <div className="flex gap-2">
                <dt className="w-32 shrink-0 text-slate-500">Bảo hành</dt>
                <dd className="text-slate-700">{warrantyInformation}</dd>
              </div>
            )}
            {shippingInformation && (
              <div className="flex gap-2">
                <dt className="w-32 shrink-0 text-slate-500">Vận chuyển</dt>
                <dd className="text-slate-700">{shippingInformation}</dd>
              </div>
            )}
            {returnPolicy && (
              <div className="flex gap-2">
                <dt className="w-32 shrink-0 text-slate-500">Đổi trả</dt>
                <dd className="text-slate-700">{returnPolicy}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Đánh giá ({reviews?.length ?? 0})
        </h2>
        <ReviewList reviews={reviews} />
      </section>
    </div>
  )
}
