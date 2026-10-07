import { useEffect, useState } from 'react'

/**
 * Trả về `value` nhưng trễ `delay` mili-giây sau lần thay đổi cuối cùng.
 *
 * Dùng cho ô tìm kiếm: gõ "phone" (5 ký tự) chỉ tốn 1 request thay vì 5.
 * Cleanup clearTimeout chính là thứ huỷ cái hẹn của ký tự trước đó.
 *
 * Câu 4 cố tình viết debounce thẳng trong component để sinh viên thấy cơ chế;
 * ở đây tách thành custom hook cho ứng dụng tổng hợp dùng lại.
 */
export default function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
