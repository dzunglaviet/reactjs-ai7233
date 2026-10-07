import { useEffect, useState } from 'react'
import { fetchCategories } from '../../services/productService.js'

/**
 * Bộ lọc danh mục.
 *
 * - HIỂN THỊ danh mục đang chọn (nhận từ prop) nhưng KHÔNG SỞ HỮU nó.
 * - Bấm nút -> gọi ngược lên cha qua onSelectCategory(slug).
 *
 * Nó tự fetch danh sách danh mục vì đó là dữ liệu riêng của nó, cha không có.
 * Khác hẳn việc con đi fetch lại sản phẩm mà cha đã cầm sẵn.
 */
export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([])) // lỗi danh mục không được làm chết cả trang
  }, [])

  const base = 'rounded-full border px-3 py-1.5 text-sm transition'
  const active = 'border-blue-600 bg-blue-600 text-white'
  const idle = 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500'

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelectCategory('')}
        className={`${base} ${selectedCategory === '' ? active : idle}`}
      >
        Tất cả
      </button>

      {categories.map((cat) => (
        <button
          key={cat.slug}
          type="button"
          // /products/categories trả MẢNG OBJECT { slug, name, url }:
          // hiện ra là cat.name, nhưng gửi lên cha phải là cat.slug.
          onClick={() => onSelectCategory(cat.slug)}
          className={`${base} ${selectedCategory === cat.slug ? active : idle}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
