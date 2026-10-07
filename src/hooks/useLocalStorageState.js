import { useEffect, useRef, useState } from 'react'

/**
 * Giống useState nhưng tự lưu xuống localStorage và đọc lại khi tải trang.
 *
 * Hook tổng quát, không biết gì về giỏ hàng — việc kiểm tra dữ liệu có hợp lệ
 * hay không là trách nhiệm của nơi gọi (xem sanitizeItems trong useCart.js).
 *
 * BỐN CHỖ PHẢI CẨN THẬN — đây là lý do bài này đáng dạy:
 *
 * 1. Đọc bằng LAZY INITIALIZER: useState(() => read()) chứ không phải
 *    useState(read()). Viết cách sau thì localStorage bị đọc lại ở MỌI lần
 *    render, dù giá trị chỉ được dùng đúng lần đầu.
 *
 * 2. Mọi thao tác localStorage đều bọc try/catch. getItem/setItem có thể ném
 *    lỗi khi trình duyệt chặn cookie, khi ở chế độ ẩn danh, hoặc khi hết dung
 *    lượng (QuotaExceededError). Một cái throw ở đây đủ làm trắng cả app.
 *
 * 3. JSON.parse có thể ném lỗi vì dữ liệu cũ hỏng hoặc do người dùng tự sửa
 *    trong DevTools. Hỏng thì bỏ qua và quay về giá trị mặc định.
 *
 * 4. KHÔNG ghi ở lần render đầu. Nếu ghi ngay, giá trị mặc định (giỏ rỗng) sẽ
 *    đè lên dữ liệu vừa đọc lên trong một số tình huống — ta chỉ ghi khi giá
 *    trị THỰC SỰ thay đổi sau đó.
 */
export default function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initialValue : JSON.parse(raw)
    } catch {
      // localStorage bị chặn, hoặc dữ liệu cũ không parse được
      return initialValue
    }
  })

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Hết dung lượng hoặc bị chặn: app vẫn chạy bình thường, chỉ là không lưu được.
      // Không ném lỗi ra ngoài — mất khả năng lưu không đáng để làm hỏng giao diện.
    }
  }, [key, value])

  return [value, setValue]
}
