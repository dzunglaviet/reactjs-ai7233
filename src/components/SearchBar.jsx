/**
 * Ô tìm kiếm — chỉ đẩy từ khoá lên cha, không giữ dữ liệu sản phẩm nào.
 *
 * `ref` ở đây được nhận như một PROP BÌNH THƯỜNG. Từ React 19 trở đi không cần
 * forwardRef nữa — tài liệu cũ vẫn bắt bọc `forwardRef(...)`, giờ bỏ được.
 * Nhờ vậy component cha cầm được ô input thật để gọi .focus().
 */
export default function SearchBar({ ref, keyword, onKeywordChange, placeholder = 'Tìm sản phẩm...' }) {
  return (
    <input
      ref={ref}
      type="search"
      value={keyword}
      onChange={(e) => onKeywordChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  )
}
