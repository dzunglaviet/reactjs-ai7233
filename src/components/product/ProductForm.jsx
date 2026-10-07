import { useFormik } from 'formik'
import { useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import {
  createProduct,
  fetchCategories,
  updateProduct,
} from '../../services/productService.js'

// ---------------------------------------------------------------------------
// Form sản phẩm dùng CHUNG cho cả thêm mới và chỉnh sửa (Formik + Yup, Buổi 6).
//
//   product = null         -> chế độ THÊM MỚI  (POST /products/add)
//   product = {...}        -> chế độ SỬA       (PUT  /products/{id})
//
// Một form cho hai việc thay vì hai component gần giống nhau: luật kiểm tra dữ
// liệu, layout và thông báo lỗi chỉ viết một lần.
//
// CHÌA KHOÁ là `enableReinitialize: true`. Mặc định Formik chỉ đọc
// initialValues ĐÚNG MỘT LẦN lúc mount; không bật cờ này thì bấm "Sửa" ở sản
// phẩm khác, form vẫn giữ nguyên dữ liệu cũ — lỗi rất hay gặp.
//
// Form tự gửi request nhưng KHÔNG tự sửa danh sách: nó đẩy kết quả lên cha qua
// onProductCreated / onProductUpdated. Cha mới là nơi sở hữu mảng sản phẩm.
// ---------------------------------------------------------------------------

const productSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required('Tên sản phẩm không được để trống')
    .min(3, 'Tên sản phẩm phải từ 3 ký tự'),
  price: Yup.number()
    .typeError('Giá phải là số')
    .required('Giá không được để trống')
    .positive('Giá phải lớn hơn 0'),
  category: Yup.string().required('Hãy chọn một danh mục'),
  description: Yup.string().max(200, 'Mô tả tối đa 200 ký tự'),
})

export default function ProductForm({
  product = null,
  onProductCreated,
  onProductUpdated,
  onCancelEdit,
}) {
  const isEditing = Boolean(product)

  const [categories, setCategories] = useState([])
  const [notice, setNotice] = useState(null)
  const [submitError, setSubmitError] = useState(null)

  // useRef trỏ tới ô input thật trong DOM — dùng để focus và cuộn tới form.
  const titleInputRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  // Bấm "Sửa" ở một thẻ sản phẩm nằm tít dưới lưới: kéo màn hình về form và đặt
  // sẵn con trỏ vào ô đầu tiên, người dùng khỏi phải tự tìm.
  useEffect(() => {
    if (!isEditing) return
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    titleInputRef.current?.focus()
  }, [isEditing, product?.id])

  const formik = useFormik({
    // Bật cờ này để form nạp lại dữ liệu mỗi khi `product` đổi.
    enableReinitialize: true,
    initialValues: {
      title: product?.title ?? '',
      price: product?.price ?? '',
      category: product?.category ?? '',
      description: product?.description ?? '',
    },
    validationSchema: productSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitError(null)
      setNotice(null)

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
          resetForm()
          titleInputRef.current?.focus()
        }
      } catch (err) {
        setSubmitError(err.message)
      }
    },
  })

  function handleCancel() {
    setNotice(null)
    setSubmitError(null)
    formik.resetForm()
    onCancelEdit()
  }

  /** Chỉ báo lỗi khi ô đó đã được chạm vào — đỡ đỏ lè ngay từ đầu. */
  const errorOf = (field) => (formik.touched[field] ? formik.errors[field] : null)

  const fieldClass = (field) =>
    `w-full rounded-lg border bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none ${
      errorOf(field)
        ? 'border-rose-400 focus:border-rose-500'
        : 'border-slate-300 dark:border-slate-600 focus:border-blue-500'
    }`

  return (
    <form
      ref={formRef}
      onSubmit={formik.handleSubmit}
      noValidate // tắt validate mặc định của trình duyệt, để Yup lo toàn bộ
      className={`space-y-3 rounded-xl border bg-white dark:bg-slate-800 p-5 ${
        isEditing ? 'border-blue-400 ring-2 ring-blue-100 dark:ring-blue-900' : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          {isEditing ? `Sửa sản phẩm #${product.id}` : 'Thêm sản phẩm mới'}
        </h3>
        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:underline"
          >
            Huỷ, quay lại thêm mới
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <input
            ref={titleInputRef}
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur} // đánh dấu touched khi rời khỏi ô
            placeholder="Tên sản phẩm *"
            className={fieldClass('title')}
          />
          {errorOf('title') && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errorOf('title')}</p>}
        </div>

        <div>
          <input
            name="price"
            type="number"
            step="0.01"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Giá *"
            className={fieldClass('price')}
          />
          {errorOf('price') && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errorOf('price')}</p>}
        </div>
      </div>

      <div>
        <select
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={fieldClass('category')}
        >
          <option value="">-- Chọn danh mục * --</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        {errorOf('category') && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errorOf('category')}</p>}
      </div>

      <div>
        <textarea
          name="description"
          rows={2}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Mô tả"
          className={fieldClass('description')}
        />
        {errorOf('description') && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errorOf('description')}</p>
        )}
      </div>

      {submitError && <p className="text-sm text-rose-600 dark:text-rose-400">{submitError}</p>}
      {notice && <p className="text-sm text-emerald-600 dark:text-emerald-400">{notice}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600"
        >
          {formik.isSubmitting
            ? 'Đang gửi...'
            : isEditing
              ? 'Lưu thay đổi'
              : 'Thêm sản phẩm'}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            Huỷ
          </button>
        )}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        API chỉ giả lập: tải lại trang là mọi thay đổi biến mất.
      </p>
    </form>
  )
}
