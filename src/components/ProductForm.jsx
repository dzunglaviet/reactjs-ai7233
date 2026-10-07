import { useEffect, useState } from 'react'
import { createProduct, fetchCategories, updateProduct } from '../services/productService.js'

// ---------------------------------------------------------------------------
// Form sản phẩm dùng CHUNG cho cả thêm mới và chỉnh sửa — viết tay bằng useState.
//
//   product = null    -> chế độ THÊM MỚI  (POST /products/add)
//   product = {...}   -> chế độ SỬA       (PUT  /products/{id})
//
// Một form cho hai việc thay vì hai component gần giống nhau: luật kiểm tra dữ
// liệu, layout và thông báo lỗi chỉ viết một lần.
//
// Ba thứ một form tự viết nào cũng phải có, và đây là lý do các thư viện form
// tồn tại:
//   1. values   — giá trị đang gõ
//   2. touched  — ô nào người dùng đã chạm vào (để không đỏ lè ngay từ đầu)
//   3. errors   — kết quả kiểm tra, tính lại ở MỖI lần render
//
// Form tự gửi request nhưng KHÔNG tự sửa danh sách: nó đẩy kết quả lên cha qua
// onProductCreated / onProductUpdated. Cha mới là nơi sở hữu mảng sản phẩm.
//
// CÁCH FORM NẠP LẠI DỮ LIỆU KHI BẤM "SỬA" Ở SẢN PHẨM KHÁC:
// không dùng useEffect để gán lại state. Cha đặt `key={editingProduct?.id}`
// cho form (xem Q09Crud.jsx) — key đổi là React HUỶ component cũ và dựng mới,
// mọi useState bên trong tự khởi tạo lại từ props. Đây là cách React khuyên
// dùng để "reset state theo prop", và nó ngắn hơn hẳn việc tự đồng bộ bằng
// effect (oxlint cũng cảnh báo react/set-state-in-effect nếu làm cách kia).
// ---------------------------------------------------------------------------

const EMPTY = { title: '', price: '', category: '', description: '' }

/** Đổi một sản phẩm thành giá trị ban đầu của form. */
function toValues(product) {
  if (!product) return EMPTY
  return {
    title: product.title ?? '',
    price: product.price ?? '',
    category: product.category ?? '',
    description: product.description ?? '',
  }
}

/**
 * Hàm kiểm tra THUẦN: cùng input thì cùng output, không chạm vào state.
 * Nhờ vậy gọi được ở bất cứ đâu và test được mà không cần React.
 */
function validate(values) {
  const errors = {}

  if (!values.title.trim()) errors.title = 'Tên sản phẩm không được để trống'
  else if (values.title.trim().length < 3) errors.title = 'Tên sản phẩm phải từ 3 ký tự'

  if (String(values.price).trim() === '') errors.price = 'Giá không được để trống'
  else if (!Number.isFinite(Number(values.price))) errors.price = 'Giá phải là số'
  else if (Number(values.price) <= 0) errors.price = 'Giá phải lớn hơn 0'

  if (!values.category) errors.category = 'Hãy chọn một danh mục'

  if (values.description.length > 200) errors.description = 'Mô tả tối đa 200 ký tự'

  return errors
}

export default function ProductForm({
  product = null,
  onProductCreated,
  onProductUpdated,
  onCancelEdit,
}) {
  const isEditing = Boolean(product)

  // Khởi tạo thẳng từ props — không cần effect đồng bộ, vì cha đổi `key` là
  // component này được dựng lại từ đầu.
  const [values, setValues] = useState(() => toValues(product))
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [notice, setNotice] = useState(null)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  // errors là GIÁ TRỊ DẪN XUẤT -> tính lúc render, không cho vào state.
  // Cho vào state là phải nhớ gọi setErrors ở mọi chỗ sửa values, quên một chỗ
  // là lỗi hiện sai.
  const errors = validate(values)
  const hasError = Object.keys(errors).length > 0

  /** Chỉ báo lỗi khi ô đó đã được chạm vào. */
  function errorOf(field) {
    return touched[field] ? errors[field] : null
  }

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleBlur(event) {
    setTouched((prev) => ({ ...prev, [event.target.name]: true }))
  }

  async function handleSubmit(event) {
    event.preventDefault() // chặn trình duyệt tải lại trang — mặc định của <form>

    // Bấm Gửi mà chưa chạm ô nào: đánh dấu tất cả là touched để lỗi hiện ra hết.
    setTouched({ title: true, price: true, category: true, description: true })
    if (hasError) return

    setSubmitError(null)
    setNotice(null)
    setSubmitting(true)

    const payload = {
      title: values.title.trim(),
      price: Number(values.price),
      category: values.category,
      description: values.description.trim(),
    }

    try {
      if (isEditing) {
        const updated = await updateProduct(product.id, payload)
        // API chỉ trả về các trường vừa gửi -> trộn với dữ liệu cũ để không
        // mất thumbnail, rating, stock...
        onProductUpdated({ ...product, ...updated })
        setNotice(`Đã cập nhật "${payload.title}"`)
      } else {
        const created = await createProduct(payload)
        onProductCreated(created)
        setNotice(`Đã tạo "${created.title}" với id ${created.id}`)
        setValues(EMPTY)
        setTouched({})
      }
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function handleCancel() {
    setNotice(null)
    setSubmitError(null)
    setValues(EMPTY)
    setTouched({})
    onCancelEdit()
  }

  function fieldClass(field) {
    return `w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ${
      errorOf(field) ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-blue-500'
    }`
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold text-slate-900">
          {isEditing ? `Sửa sản phẩm #${product.id}` : 'Thêm sản phẩm mới'}
        </h2>
        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            className="text-xs text-slate-500 hover:text-slate-900 hover:underline"
          >
            Huỷ, quay về thêm mới
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="mb-1 block text-xs text-slate-500">
            Tên sản phẩm
          </label>
          <input
            id="title"
            name="title"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldClass('title')}
          />
          {errorOf('title') && <p className="mt-1 text-xs text-rose-600">{errorOf('title')}</p>}
        </div>

        <div>
          <label htmlFor="price" className="mb-1 block text-xs text-slate-500">
            Giá ($)
          </label>
          <input
            id="price"
            name="price"
            value={values.price}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldClass('price')}
          />
          {errorOf('price') && <p className="mt-1 text-xs text-rose-600">{errorOf('price')}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-xs text-slate-500">
          Danh mục
        </label>
        <select
          id="category"
          name="category"
          value={values.category}
          onChange={handleChange}
          onBlur={handleBlur}
          className={fieldClass('category')}
        >
          <option value="">— Chọn danh mục —</option>
          {/* /products/categories trả về OBJECT { slug, name, url }:
              hiển thị name, nhưng gửi đi slug. */}
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        {errorOf('category') && <p className="mt-1 text-xs text-rose-600">{errorOf('category')}</p>}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-xs text-slate-500">
          Mô tả ({values.description.length}/200)
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          className={fieldClass('description')}
        />
        {errorOf('description') && (
          <p className="mt-1 text-xs text-rose-600">{errorOf('description')}</p>
        )}
      </div>

      {notice && <p className="text-sm text-emerald-700">{notice}</p>}
      {submitError && <p className="text-sm text-rose-600">{submitError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-300"
      >
        {submitting ? 'Đang gửi...' : isEditing ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
      </button>
    </form>
  )
}
