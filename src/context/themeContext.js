import { createContext } from 'react'

/**
 * Context chứa chế độ hiển thị sáng/tối dùng chung cho cả app.
 *
 * Giống AuthContext: giá trị mặc định là `null` để hook useTheme() phát hiện
 * được component đang nằm NGOÀI <ThemeProvider> và báo lỗi đúng nguyên nhân.
 *
 * Vì sao giao diện sáng/tối là ca dùng Context điển hình nhất?
 *  - Ai cũng cần biết: nút bật/tắt ở sidebar, mà màu thì áp ở mọi component.
 *  - Rất ít khi đổi: một lần click, không phải mỗi lần gõ phím.
 *  - Truyền bằng props thì phải xuyên qua hàng chục component chẳng liên quan.
 * Ba điều kiện đó mới là lúc nên dùng Context — xem thêm ghi chú trong
 * AuthProvider.jsx về việc Context KHÔNG phải để thay thế props.
 */
export const ThemeContext = createContext(null)
