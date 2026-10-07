import { useContext, useEffect, useState } from 'react'
import ErrorBox from '../components/ErrorBox.jsx'
import ExerciseLayout from '../components/ExerciseLayout.jsx'
import ProductForm from '../components/ProductForm.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import RequireAuth from '../components/RequireAuth.jsx'
import Spinner from '../components/Spinner.jsx'
import { AuthContext } from '../context/authContext.js'
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
//
// Ghi dữ liệu là việc cần quyền, nên cả khu vực nằm sau <RequireAuth>. Viết
// thành component bọc thay vì rải `if (!isLoggedIn) return ...` trong từng màn
// hình: luật kiểm tra nằm một chỗ, và CrudShop bên trong coi như luôn có người
// dùng hợp lệ.
// ---------------------------------------------------------------------------

function CrudShop() {
  // Không ai truyền userInfo xuống đây — lấy thẳng từ Context.
  const { userInfo } = useContext(AuthContext)

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
      <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
        Đang thao tác với quyền của <strong>{userInfo?.username}</strong>. Đăng xuất ở
        sidebar là toàn bộ khu vực này khoá lại — cùng một Context.
      </p>

      <ProductForm
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
      title="Thêm / sửa / xoá sản phẩm — có kiểm tra đăng nhập"
      brief="Toàn bộ khu vực nằm sau <RequireAuth>. Một form Formik dùng chung cho cả thêm mới lẫn chỉnh sửa; nút Sửa ở mỗi thẻ nạp sản phẩm vào form, nút Xoá cập nhật giao diện trước rồi mới gọi API và hoàn tác nếu lỗi."
      highlight="enableReinitialize của Formik là thứ khiến form nạp lại dữ liệu khi bấm Sửa ở sản phẩm khác — thiếu nó, form giữ nguyên sản phẩm cũ."
    >
      <RequireAuth message="Thêm, sửa và xoá sản phẩm là thao tác ghi dữ liệu, cần đăng nhập trước. Dùng tài khoản demo bên dưới.">
        <CrudShop />
      </RequireAuth>
    </ExerciseLayout>
  )
}
