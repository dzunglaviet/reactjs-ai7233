import { useEffect, useRef, useState } from 'react'
import { lineTotal } from '../../utils/format.js'
import CartButton from './CartButton.jsx'
import CartPanel from './CartPanel.jsx'

// ---------------------------------------------------------------------------
// Giỏ hàng kiểu trang thương mại điện tử: nút nằm trên header, bấm vào thì bảng
// giỏ thả xuống ngay bên dưới (mini-cart).
//
// Phân chia trách nhiệm:
//   CartMenu    : sở hữu state đóng/mở, lo bàn phím và click ra ngoài
//   CartButton  : vẽ nút + badge + tổng tiền
//   CartPanel   : nội dung giỏ (dùng lại y nguyên component có sẵn)
//
// `isOpen` để state CỤC BỘ ở đây, không đẩy lên ShopPage: đó là trạng thái giao
// diện thuần tuý, không ai khác trong app cần biết. Quy tắc chung — state đặt ở
// chỗ thấp nhất mà vẫn đủ dùng.
//
// KHÁC với hộp thoại (modal): menu thả xuống KHÔNG khoá cuộn trang và KHÔNG có
// lớp nền mờ. Người dùng vẫn cuộn danh sách sản phẩm phía sau bình thường, giỏ
// hàng chỉ là một lớp phủ nhỏ. Đóng bằng cách bấm ra ngoài hoặc nhấn Esc.
// ---------------------------------------------------------------------------
export default function CartMenu({ items, onChangeQty, onRemove, onClear, persisted }) {
  const [isOpen, setIsOpen] = useState(false)

  const containerRef = useRef(null) // cả cụm nút + menu, để kiểm tra click ra ngoài
  const buttonRef = useRef(null) // để trả con trỏ về nút sau khi đóng
  const panelRef = useRef(null) // để đưa con trỏ vào bảng khi mở

  // Giá trị DẪN XUẤT -> tính lúc render, không cho vào state.
  // Badge đếm TỔNG SỐ LƯỢNG, không phải số dòng: 3 cái áo cùng loại hiện là 3.
  // Muốn đếm số mặt hàng thì đổi thành items.length.
  const totalQuantity = items.reduce((sum, it) => sum + it.qty, 0)
  const totalAfter = items.reduce((sum, it) => sum + lineTotal(it), 0)

  useEffect(() => {
    if (!isOpen) return

    // Chụp lại giá trị ref NGAY LÚC NÀY, không đọc buttonRef.current trong
    // cleanup — lúc cleanup chạy, ref có thể đã trỏ sang chỗ khác hoặc thành null.
    const buttonElement = buttonRef.current

    // Bấm ra ngoài cụm nút+menu thì đóng. Dùng `contains` để phân biệt click
    // bên trong (giữ nguyên) với click bên ngoài (đóng lại).
    // Nghe `mousedown` chứ không phải `click`: đóng ngay khi nhấn, cảm giác
    // nhanh hơn, và tránh trường hợp phần tử bị gỡ mất trước khi `click` bắn ra.
    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false)
    }

    // Bấm Esc để đóng — thói quen của mọi menu thả xuống.
    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    // Đưa con trỏ vào bảng để người dùng bàn phím không bị "lạc".
    panelRef.current?.focus()

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      buttonElement?.focus() // đóng xong thì con trỏ quay về nút giỏ hàng
    }
  }, [isOpen])

  /**
   * Xoá sạch giỏ thì đóng luôn menu.
   *
   * Xử lý ngay tại SỰ KIỆN gây ra thay đổi, chứ không viết useEffect kiểu
   * `if (items.length === 0) setIsOpen(false)`. Gọi setState bên trong effect
   * làm React render thêm một lượt thừa.
   */
  function handleClear() {
    onClear()
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <CartButton
        ref={buttonRef}
        quantity={totalQuantity}
        total={totalAfter}
        isOpen={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      />

      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Giỏ hàng"
          tabIndex={-1}
          // top-full + mt-2: nằm ngay dưới nút. right-0: mép phải thẳng với nút,
          // nhờ vậy menu không tràn ra ngoài màn hình.
          className="absolute top-full right-0 z-50 mt-2 max-h-[70vh] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-xl shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 outline-none"
        >
          <CartPanel
            items={items}
            onChangeQty={onChangeQty}
            onRemove={onRemove}
            onClear={handleClear}
            persisted={persisted}
          />
        </div>
      )}
    </div>
  )
}
