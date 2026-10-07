import { useEffect, useState } from 'react'
import ErrorBox from '../components/ErrorBox.jsx'
import ExerciseLayout from '../components/ExerciseLayout.jsx'
import ProductForm from '../components/ProductForm.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import Spinner from '../components/Spinner.jsx'
import { deleteProduct, fetchProducts } from '../services/productService.js'

// ---------------------------------------------------------------------------
// CÂU 9 — Thêm / sửa / xoá với API GIẢ LẬP.
//
// DummyJSON trả về object trông rất thật (id mới, isDeleted: true) nhưng không
// lưu gì cả. Vì vậy sau mỗi thao tác phải tự cập nhật state cục bộ; gọi lại
// /products sẽ thấy danh sách y như cũ và thay đổi "biến mất".
//
// Danh sách sản phẩm do CrudShop sở hữu. ProductForm chỉ gửi request rồi đẩy
// kết quả lên qua callback — nó không được tự sửa danh sách của người khác.
// ---------------------------------------------------------------------------

function CrudShop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null) // chỉ cho xoá 1 sản phẩm mỗi lúc
  const [editingProduct, setEditingProduct] = useState(null) // null = đang ở chế độ thêm mới
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProducts({ limit: 8 })
        setProducts(data.products)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  /** Form đẩy sản phẩm mới lên -> chèn lên đầu danh sách. */
  function handleProductCreated(created) {
    setProducts((prev) => [created, ...prev])
  }

  /** Form đẩy sản phẩm đã sửa lên -> thay đúng phần tử đó, giữ nguyên thứ tự. */
  function handleProductUpdated(updated) {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    setEditingProduct(null) // sửa xong thì form quay về chế độ thêm mới
    setNotice(`Đã sửa "${updated.title}" (chỉ trên giao diện — API không lưu)`)
  }

  /**
   * Xoá kiểu OPTIMISTIC: bỏ khỏi giao diện NGAY, gọi API sau.
   * Hỏng thì trả sản phẩm về đúng vị trí cũ và báo lỗi.
   *
   * Vì sao không chờ API xong mới xoá? Vì người dùng phải đợi, và 99% trường hợp
   * là thành công. Đổi lại, phải có đường hoàn tác cho 1% còn lại.
   */
  async function handleDelete(id) {
    if (!window.confirm('Xoá sản phẩm này?')) return

    const index = products.findIndex((p) => p.id === id)
    const backup = products[index] // giữ bản sao để hoàn tác
    if (!backup) return

    setNotice(null)
    setDeletingId(id)
    setProducts((prev) => prev.filter((p) => p.id !== id)) // biến mất tức thì

    // Đang sửa đúng sản phẩm vừa xoá thì đóng form lại, tránh sửa một thứ
    // không còn trên danh sách.
    if (editingProduct?.id === id) setEditingProduct(null)

    try {
      await deleteProduct(id)
      setNotice(`Đã xoá "${backup.title}" (chỉ trên giao diện — API không lưu)`)
    } catch (err) {
      // ROLLBACK: chèn lại đúng chỗ cũ, không phải đẩy xuống cuối danh sách
      setProducts((prev) => {
        const next = [...prev]
        next.splice(index, 0, backup)
        return next
      })
      setError(`Xoá thất bại: ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-5">
      {/* key đổi là React dựng lại form từ đầu, nên nó tự nạp dữ liệu của sản
          phẩm vừa bấm Sửa. 'new' cho chế độ thêm mới. */}
      <ProductForm
        key={editingProduct?.id ?? 'new'}
        product={editingProduct}
        onProductCreated={handleProductCreated}
        onProductUpdated={handleProductUpdated}
        onCancelEdit={() => setEditingProduct(null)}
      />

      {notice && (
        <p className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700">{notice}</p>
      )}
      {error && <ErrorBox message={error} />}

      {loading ? (
        <Spinner />
      ) : (
        <ProductGrid
          products={products}
          onEdit={setEditingProduct}
          onDelete={handleDelete}
          deletingId={deletingId}
          editingId={editingProduct?.id ?? null}
        />
      )}
    </div>
  )
}

export default function Q09Crud() {
  return (
    <ExerciseLayout
      number={9}
      title="Thêm / sửa / xoá sản phẩm"
      brief="Một form dùng chung cho cả thêm mới lẫn chỉnh sửa; nút Sửa ở mỗi thẻ nạp sản phẩm vào form, nút Xoá cập nhật giao diện trước rồi mới gọi API và hoàn tác nếu lỗi."
      highlight="Khi bấm Sửa ở sản phẩm khác, form phải NẠP LẠI dữ liệu. Cách làm ở đây là đổi prop `key` của form — React huỷ component cũ và dựng mới, mọi useState bên trong tự khởi tạo lại. Ngắn hơn và ít lỗi hơn việc tự đồng bộ bằng useEffect."
    >
      <CrudShop />
    </ExerciseLayout>
  )
}
