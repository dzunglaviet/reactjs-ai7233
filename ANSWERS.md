# Phần trả lời bằng chữ — Practice Set: DummyJSON API

Mỗi câu trong đề đều có một phần "answer in writing". Đây là đáp án mẫu, dùng kèm phần Answer Key / Instructor Notes trong `DummyJSON-Thuc-hanh.md`.

---

## Câu 1 — Vì sao callback của `useEffect` không được khai báo `async`?

Vì một hàm `async` **luôn** trả về một Promise, trong khi `useEffect` chỉ chấp nhận callback trả về `undefined` hoặc một **hàm cleanup**. Khi callback trả về Promise, React nhận được một object không phải hàm và không thể dùng nó để dọn dẹp — hợp đồng của effect bị phá vỡ, và mọi cơ chế huỷ (như `clearTimeout`, `abort`) không còn chỗ để đặt.

Cách đúng là khai báo hàm `async` **bên trong** effect rồi gọi nó:

```jsx
useEffect(() => {
  async function load() { /* ... */ }
  load()
  return () => { /* cleanup vẫn đặt được ở đây */ }
}, [])
```

---

## Câu 2 — Vì sao `ProductCard` không được tự gọi `fetch`?

Vì dữ liệu nó cần **đã nằm sẵn trong tay cha**. Nếu mỗi thẻ tự gọi `/products/{id}`, hiển thị 8 thẻ là 8 request thừa cho đúng thứ vừa tải về trong 1 request — chậm hơn, tốn băng thông hơn, và mỗi thẻ lại phải tự lo loading/error riêng.

Đây là ranh giới **container / presentational**: cha (`ProductList`) biết dữ liệu đến từ đâu, con (`ProductCard`) chỉ biết hiển thị thứ nó được đưa. Nhờ vậy `ProductCard` dùng lại được ở bất kỳ đâu — kể cả với dữ liệu giả khi viết test.

---

## Câu 3 — `CategoryFilter` hiển thị trạng thái đang chọn nhưng không sở hữu nó. Vì sao đúng?

Vì **người phải hành động khi giá trị đổi mới là người giữ giá trị**. Đổi danh mục kéo theo việc fetch lại danh sách sản phẩm, mà danh sách đó thuộc về cha — nên `selectedCategory` phải nằm ở cha. Con không có cách nào sửa state của cha, nó chỉ gọi callback để **báo** rằng người dùng vừa chọn gì.

Con nhận lại giá trị đó qua prop thuần tuý để tô đậm nút đang chọn. Giữ đúng **một nguồn sự thật**: nếu con cũng giữ một bản copy, hai bên sẽ lệch nhau ngay khi cha thay đổi giá trị từ nơi khác (ví dụ nút "Xoá bộ lọc").

---

## Câu 4 — Cleanup huỷ cái gì, và không debounce thì Network tab trông ra sao?

Cleanup gọi `clearTimeout(timer)` để huỷ **cái hẹn 400ms của lần gõ trước**. Mỗi ký tự mới làm `keyword` đổi, React chạy cleanup của lần chạy effect trước rồi mới chạy effect mới — nên chỉ cái hẹn cuối cùng sống sót đủ 400ms để thật sự gọi API.

Không debounce, gõ "phone" cho ra **5 request** liên tiếp: `q=p`, `q=ph`, `q=pho`, `q=phon`, `q=phone`. Tệ hơn số lượng là thứ tự: 5 response không đảm bảo về đúng thứ tự gửi đi, nên kết quả của `q=pho` hoàn toàn có thể về sau cùng và **ghi đè** lên kết quả của `q=phone` — người dùng gõ xong "phone" nhưng màn hình hiện kết quả của "pho".

---

## Câu 5 — Thiếu `sortBy` trong dependency array thì sao? Cho `products` vào thì sao?

**Thiếu `sortBy`:** effect không chạy lại khi người dùng đổi kiểu sắp xếp. Giao diện vẫn hiện lựa chọn mới nhưng danh sách y nguyên, cho tới khi một dependency khác tình cờ đổi (đổi danh mục chẳng hạn) thì thứ tự mới đột ngột đúng. Loại lỗi này rất khó bắt vì không có thông báo nào cả — chỉ là dữ liệu cũ nằm im.

**Cho `products` vào:** vòng lặp vô hạn. Effect gọi `setProducts(...)` → mảng mới có **tham chiếu mới** → React thấy dependency đổi → chạy lại effect → `setProducts` → … Trình duyệt bắn request liên tục cho tới khi treo. Quy tắc: dependency chỉ chứa thứ effect **đọc vào**, không bao giờ chứa thứ effect **ghi ra**.

---

## Câu 6 — Vì sao `totalPages` phải tính ở `ShopPage` chứ không phải trong `Pagination`?

Vì `totalPages = Math.ceil(total / PAGE_SIZE)`, mà `total` chỉ về cùng response của lần fetch — và chỉ cha mới gọi fetch. Muốn `Pagination` tự tính, nó phải hoặc tự gọi API (sai, nó là component hiển thị), hoặc vẫn nhận `total` qua prop — mà đã nhận `total` thì truyền thẳng `totalPages` còn gọn hơn.

Nguyên tắc chung: **giá trị dẫn xuất được tính ở nơi sở hữu dữ liệu gốc**. `Pagination` chỉ cần biết đang ở trang nào, có bao nhiêu trang, và báo lên khi người dùng bấm.

---

## Câu 7 — Cleanup trong effect ngăn vấn đề gì?

Hai vấn đề khác nhau:

1. **setState sau khi unmount.** Người dùng mở trang chi tiết rồi bấm Back ngay. Request vẫn đang bay; khi response về, `setProduct` được gọi trên một component không còn tồn tại — lãng phí, và ở các bản React cũ còn sinh cảnh báo memory leak.

2. **Race condition (quan trọng hơn).** Bấm nhanh từ sản phẩm 5 sang sản phẩm 9. Hai request cùng bay, nhưng không có gì đảm bảo response của 5 về trước. Nếu nó về sau, nó sẽ ghi đè dữ liệu của 9 — URL hiển thị `/products/9` nhưng nội dung là của sản phẩm 5. Cờ `ignore` vô hiệu hoá lần chạy cũ, nên response đến muộn bị bỏ qua.

---

## Câu 8 — Vì sao tổng tiền sau giảm không nằm trong state?

Vì nó là **giá trị dẫn xuất**: biết `items` là tính ra được, không có thông tin nào mới. Đưa vào `useState` tạo ra **nguồn sự thật thứ hai** cho cùng một dữ liệu, và hai nguồn sớm muộn cũng lệch nhau — chỉ cần một đường cập nhật giỏ hàng quên cập nhật tổng là con số sai, lặng lẽ.

Nếu đồng bộ bằng `useEffect`, còn thêm một lỗi nữa: effect chạy **sau** khi render xong, nên có đúng một khung hình giỏ hàng đã đổi mà tổng tiền vẫn là số cũ. Người dùng thấy giá nhảy trễ một nhịp.

Cách đúng là tính ngay lúc render:

```jsx
const totalAfter = items.reduce((sum, it) => sum + lineTotal(it), 0)
```

Cùng bài học với Buổi 9 câu 8: tính được từ props/state thì **không cần** `useEffect`.

---

## Câu 9 — Vì sao thay đổi biến mất sau khi tải lại trang, và vì sao vẫn phải cập nhật state?

DummyJSON **giả lập** thao tác ghi. `POST /products/add` trả về object có id mới, `DELETE` trả về object kèm `isDeleted: true` — nhìn y như thật, nhưng không có gì được lưu trên server. Tải lại trang là `/products` trả về đúng 194 sản phẩm ban đầu.

Vì vậy không thể "gọi lại `/products` cho chắc" sau mỗi thao tác: làm thế là tự tay xoá luôn thay đổi vừa tạo. Nguồn sự thật duy nhất của giao diện lúc này là **state cục bộ**, nên phải tự chèn/xoá phần tử trong mảng.

Cần nói rõ với sinh viên: điều này **không** đúng với API thật. Với backend thật, refetch sau khi ghi thường là lựa chọn đúng vì server mới là nguồn sự thật. Quy tắc không phải "đừng bao giờ refetch" mà là **"phải biết backend của mình thực sự làm gì"**.

---

## Câu 10 — `Promise.all` so với vòng `for` có `await`, khác nhau thế nào?

Với giỏ 5 dòng, mỗi request khoảng 200ms:

- **`Promise.all` / `allSettled`**: cả 5 request được bắn đi gần như cùng lúc rồi cùng chờ. Tổng thời gian ≈ **request chậm nhất** ≈ 0,2 giây.
- **Vòng `for` có `await` bên trong**: request thứ hai chỉ bắt đầu khi thứ nhất đã xong. Tổng thời gian ≈ **tổng của tất cả** ≈ 1 giây.

Khoảng cách giãn ra **tuyến tính** theo số dòng, vì cách tuần tự cộng dồn còn cách song song thì không: 20 dòng vẫn ≈ 0,2 giây khi chạy song song, nhưng thành ≈ 4 giây khi chạy tuần tự. Giỏ càng to, chênh lệch càng lớn.

Trong bài dùng `Promise.allSettled` thay vì `Promise.all` vì `all` **thất bại ngay khi một request hỏng** — một sản phẩm lỗi là mất trắng cả giỏ. `allSettled` chờ tất cả rồi trả về trạng thái từng cái, nên dòng hỏng chỉ hiện "Không tải được tồn kho" còn phần còn lại vẫn hiển thị bình thường.

---

## Phụ lục — Những lỗi hay gặp khi chấm

| Lỗi | Dấu hiệu nhận ra |
|---|---|
| `data.map is not a function` | Quên lớp bọc, dùng `data` thay vì `data.products` |
| Nút trong danh mục hiện `[object Object]` | Render thẳng `cat` thay vì `cat.name` |
| Callback chạy ngay khi render | `onClick={onSelect(x)}` thiếu arrow bọc ngoài |
| Request bắn liên tục không ngừng | Cho `products` vào dependency array |
| Đổi sắp xếp không có tác dụng | Thiếu `sortBy` trong dependency array |
| Trang trắng sau khi đổi danh mục | Quên reset `page` về 1 |
| Giỏ hàng mất khi quay lại từ trang chi tiết | State giỏ đặt dưới `<Routes>` thay vì trên |
| Lỗi 401 khó hiểu ở câu 10 | Dùng `token` thay vì `accessToken` → `Bearer undefined` |
| Giỏ hàng trống dù đăng nhập được | Quên bóc lớp `{ carts: [...] }` |
| Một sản phẩm lỗi làm trắng cả giỏ | Dùng `Promise.all` thay vì `allSettled` |
