import { EmptyState } from '../ui/index.js'
import ProductCard from './ProductCard.jsx'

/**
 * Lưới sản phẩm.
 *
 * Component TRUNG GIAN: nó không sở hữu giỏ hàng, cũng không dùng onAddToCart —
 * nhưng vẫn phải nhận và chuyển tiếp callback xuống ProductCard, vì chỉ cha
 * (ShopPage) mới sửa được state của cha. Đây chính là "prop drilling".
 */
export default function ProductGrid({
  products,
  detailBasePath, // ví dụ "/shop/products" -> link chi tiết
  onAddToCart,
  onEdit,
  onDelete,
  deletingId = null,
  editingId = null,
  emptyMessage = 'Không tìm thấy sản phẩm nào',
}) {
  if (products.length === 0) return <EmptyState>{emptyMessage}</EmptyState>

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          detailTo={detailBasePath ? `${detailBasePath}/${product.id}` : undefined}
          onAddToCart={onAddToCart}
          onEdit={onEdit}
          onDelete={onDelete}
          deleting={deletingId === product.id}
          editing={editingId === product.id}
        />
      ))}
    </div>
  )
}
