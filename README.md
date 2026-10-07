# Bài giải DummyJSON — BẢN ĐƠN GIẢN

> Đây là nhánh **`simple`**. Nhánh `main` chứa bản đầy đủ — thêm custom hooks,
> chế độ sáng/tối và giỏ hàng dạng menu thả xuống trên header.
>
> ```bash
> git checkout main      # bản đầy đủ
> git checkout simple    # bản này
> ```

Lời giải 10 câu trong `4. Homeworks/DummyJSON-Thuc-hanh.md`, viết lại cho dễ đọc:
**React 19 + Vite 8 + TailwindCSS v4 + React Router 8**.

Vẫn dạy đủ `useReducer`, `useContext`, `localStorage` và Formik + Yup — đó là nội
dung của chương trình, không phải thứ để cắt. Cái được đơn giản hoá là **cách tổ
chức code**: thư mục phẳng, và mọi logic viết thẳng tại chỗ dùng thay vì gói vào
custom hook.

Phần trả lời bằng chữ của cả 10 câu nằm ở **[ANSWERS.md](./ANSWERS.md)** (dùng chung
cho cả hai nhánh).

---

## Chạy dự án

```bash
npm install
npm run dev      # http://localhost:5173
```

Mặc định app gọi thẳng `https://dummyjson.com`. Muốn đổi sang server mirror local
(xem Phụ lục A của đề bài): `cp .env.example .env.local`, sửa `VITE_API_URL`, rồi
khởi động lại — Vite chỉ đọc `.env` lúc start.

```bash
npm run build     # build production
npm run lint      # oxlint
```

---

## Bản này khác bản đầy đủ chỗ nào

| | Bản đầy đủ (`main`) | Bản đơn giản (`simple`) |
|---|---|---|
| Đọc Context | `hooks/useAuth.js` bọc lại | gọi thẳng `useContext(AuthContext)` |
| Giỏ hàng | `hooks/useCart.js` | 4 hàm viết thẳng trong component |
| Lưu localStorage | `hooks/useLocalStorageState.js` | `useState(readStoredCart)` + một `useEffect` tại chỗ |
| Debounce | `hooks/useDebouncedValue.js` | `setTimeout` + `clearTimeout` tại chỗ |
| Chế độ sáng / tối | có (ThemeContext) | không |
| Giỏ hàng ở `/shop` | menu thả xuống trên header | cột bên phải |
| `components/` | chia 5 thư mục con | một thư mục phẳng, 26 component |
| Lọc dữ liệu đọc từ storage | `sanitizeItems` kiểm từng dòng | chỉ kiểm `Array.isArray` |
| | 79 file, 283 module | 51 file, 270 module |

Nói gọn: **bản `simple` không có thư mục `hooks/`**. Mỗi câu đọc độc lập được từ
trên xuống dưới, không phải nhảy qua file khác để hiểu một hàm. Đổi lại, có chỗ
bị lặp — và đó là chủ ý, xem mục cuối.

Vẫn giữ nguyên như bản đầy đủ:

- **`services/`** — nếu không có, đường dẫn API và việc dựng query string sẽ bị
  copy ra 10 chỗ. Một file `productService.js` gọn hơn nhiều so với "đơn giản hoá"
  bằng cách lặp lại.
- **`context/`** — `authReducer.js` (hàm thuần), `authContext.js`, `AuthProvider.jsx`.
- **Formik + Yup** ở `ProductForm`, **`Promise.allSettled`** ở Câu 10,
  **optimistic update + rollback** ở Câu 9, **cổng `RequireAuth`** ở Câu 9.

---

## Cấu trúc thư mục

```
index.html
src/
├── main.jsx                  Điểm vào — <BrowserRouter> + <AuthProvider>
├── App.jsx                   Ghép AppLayout + AppRoutes
├── index.css                 @import "tailwindcss"
│
├── routes/
│   ├── navigation.js         Danh sách 10 bài — sidebar và trang chủ cùng đọc từ đây
│   └── AppRoutes.jsx         Toàn bộ bảng route
│
├── services/                 TẦNG GỌI API — component không tự fetch
│   ├── httpClient.js         apiGet / apiSend, base URL từ env
│   ├── productService.js     buildProductListPath + các endpoint sản phẩm
│   ├── cartService.js        giỏ hàng (bóc lớp bọc { carts: [...] })
│   └── authService.js        login + /auth/me kèm Bearer token
│
├── context/                  STATE TOÀN CỤC
│   ├── authReducer.js        hàm thuần: AUTH_ACTIONS, initialAuthState, reducer
│   ├── authContext.js        createContext
│   └── AuthProvider.jsx      useReducer + login()/logout() gọi API
│
├── utils/format.js           money(), discountedPrice(), lineTotal()
│
├── components/               MỘT thư mục phẳng, 26 component
│   │                         Spinner, ErrorBox, EmptyState, Badge,
│   │                         AppLayout, Sidebar, MobileNav, NavItem, ExerciseLayout,
│   │                         AuthStatus, LoginForm, RequireAuth,
│   │                         ProductCard, ProductGrid, CategoryFilter, SearchBar,
│   │                         SortSelect, Pagination, ProductDetailView,
│   │                         ReviewList, ReviewItem, ProductForm,
│   │                         CartPanel, CartItem
│
├── pages/
│   ├── HomePage.jsx
│   ├── ShopPage.jsx          ứng dụng tổng hợp (gộp câu 3→8)
│   ├── ProductDetailPage.jsx
│   └── NotFoundPage.jsx
│
└── exercises/                LỜI GIẢI TỪNG CÂU, đọc độc lập được
    └── Q01…Q10
```

Quy ước duy nhất cần nhớ: **`services/` gọi API, `context/` giữ state toàn cục,
`components/` nhận props và render, `exercises/` và `pages/` giữ state màn hình.** Ngoại lệ có chủ ý: `CategoryFilter`
và `ProductForm` tự gọi service, vì danh sách danh mục là dữ liệu riêng của
chúng — cha không có và cũng không cần.

---

## Bảng ánh xạ câu hỏi → file

| Câu | Nội dung | File | Điểm chính |
|---|---|---|---|
| 1 | Danh sách sản phẩm | `exercises/Q01ProductList.jsx` | `fetch` thô, 3 trạng thái, response bị bọc `{ products, total }` |
| 2 | Container / presentational | `exercises/Q02CompositeList.jsx` | Cha giữ state, con chỉ hiển thị |
| 3 | Lọc danh mục | `exercises/Q03CategoryFilter.jsx` | Lifting state up, `/products/categories` trả object |
| 4 | Tìm kiếm + debounce | `exercises/Q04Search.jsx` | `setTimeout` + `clearTimeout` trong cleanup |
| 5 | Sắp xếp | `exercises/Q05Sort.jsx` | `sortBy`/`order`, một `useEffect` cho mọi tham số |
| 6 | Phân trang | `exercises/Q06Pagination.jsx` | `limit`/`skip`/`total`, đổi bộ lọc là về trang 1 |
| 7 | Trang chi tiết | `exercises/Q07Detail.jsx` | Router lồng nhau, 404 thật, cờ `ignore` chống race |
| 8 | Giỏ hàng | `exercises/Q08Cart.jsx` | Prop drilling 3 tầng, giá trị dẫn xuất |
| 9 | Thêm / sửa / xoá | `exercises/Q09Crud.jsx` + `ProductForm` | Formik + Yup, `enableReinitialize`, optimistic update + rollback, cổng `RequireAuth` |
| 10 | Đăng nhập + giỏ | `exercises/Q10UserCart.jsx` + `context/` | `useReducer` + Context, Bearer token, `Promise.allSettled`, 7 trạng thái |

---

## Năm chỗ đáng dừng lại khi giảng

**1. Giá trị dẫn xuất — tính lúc render, đừng cho vào state.**
Tổng tiền giỏ hàng (`CartPanel`), `totalPages` (`ShopPage`), `errors` của form
(`ProductForm`), `isLoggedIn` (`Q10UserCart`) đều được tính lại ở mỗi lần render.
Hai ô state cùng mô tả một sự thật thì sớm muộn cũng lệch nhau.

**2. Dạng hàm của `setState`.**
`setItems(prev => ...)` chứ không `setItems([...items, x])`. Cái sau đọc `items`
của lần render này, bấm nhanh hai lần là mất một lần thêm.

**3. Cleanup của `useEffect` làm hai việc khác nhau.**
Ở Câu 4 nó **huỷ timer** (`clearTimeout`) — không có thì gõ 10 ký tự gọi API 10 lần.
Ở Câu 7 và `ShopPage` nó **bật cờ `ignore`** — response cũ về muộn sẽ bị bỏ qua
thay vì ghi đè lên danh sách đang đúng.

**4. `useReducer` khi nhiều ô state luôn đổi cùng nhau; `useContext` khi dữ liệu
dùng ở hai nhánh xa nhau.**
`authReducer.js` là hàm thuần: một lần đăng nhập đổi cả 5 ô (`isLoggedIn`,
`userInfo`, `token`, `loading`, `error`) trong một phép chuyển trạng thái, thay vì
5 lệnh `setState` rải rác mà quên một cái là sinh trạng thái vô lý. Và sau khi
đăng nhập ở Câu 10, **ô trạng thái ở sidebar cùng cổng đăng nhập của Câu 9 đều
đổi theo** — ba chỗ nằm ở ba nhánh khác nhau, không có props nào nối chúng lại.
Đó là lúc Context thật sự kiếm được chỗ của nó. Bản này gọi
`useContext(AuthContext)` trực tiếp để thấy rõ cơ chế; nhánh `main` bọc lại
thành `useAuth()`.

**5. Chỗ lặp lại là chỗ sinh ra custom hook.**
Bốn hàm giỏ hàng (`addToCart`, `changeQty`, `removeFromCart`, `clearCart`) được
viết **hai lần**: một ở `Q08Cart.jsx`, một ở `pages/ShopPage.jsx`. Phần đọc/ghi
localStorage cũng nằm thẳng trong `ShopPage.jsx`. Cố ý như vậy, để mỗi bài đọc
độc lập được.

Đúng lúc sinh viên thấy việc copy này khó chịu là lúc giới thiệu custom hook — và
nhánh `main` chính là kết quả của việc gom lại đó (`useCart`,
`useLocalStorageState`, `useDebouncedValue`, `useAuth`). Hai nhánh đặt cạnh nhau
là một bài giảng hoàn chỉnh về việc *khi nào* nên trừu tượng hoá: không phải từ
đầu, mà đúng lúc thấy đau.

**Thêm: `localStorage` có bốn chỗ phải cẩn thận** (xem `ShopPage.jsx`): đọc bằng
lazy initializer `useState(readStoredCart)` chứ không `useState(readStoredCart())`;
bọc `try/catch` cả đọc lẫn ghi vì localStorage ném lỗi khi bị chặn hoặc hết dung
lượng; bỏ qua lần ghi đầu tiên; và kiểm tra lại hình dạng dữ liệu đọc lên, vì
người dùng sửa được nó bằng DevTools.

---

## Sáu chỗ sinh viên hay vấp với DummyJSON

1. **Response danh sách bị BỌC**: `{ products, total, skip, limit }` — nhưng một
   sản phẩm đơn lẻ thì KHÔNG bọc. Quên `.products` là `products.map is not a function`.
2. **`/products/categories` trả về OBJECT** `{ slug, name, url }`, không phải chuỗi.
   Hiển thị `name`, gửi đi `slug`. Render thẳng object vào JSX sẽ lỗi.
3. **`rating` là MỘT SỐ**, không phải `{ rate, count }` như fakestoreapi cũ.
4. **`price` là giá GỐC** — giá thực phải tự tính từ `discountPercentage`.
5. **Id không tồn tại trả 404 THẬT**, nên `res.ok` là cách kiểm tra đúng ở API này.
6. **Token tên là `accessToken`**, không phải `token`. Dùng nhầm cho ra
   `Bearer undefined` và lỗi 401 rất khó hiểu.

---

## Ghi chú cho giảng viên

- Mọi thao tác ghi (thêm/sửa/xoá) đều là **giả lập**: server trả về object trông
  rất thật nhưng không lưu gì. Vì vậy Câu 9 phải tự cập nhật state cục bộ.
- `PUT /products/{id}` chỉ trả về id kèm các trường vừa gửi, nên `ProductForm`
  phải trộn `{ ...product, ...updated }` để không mất `thumbnail`, `rating`, `stock`.
- Tài khoản demo: **`emilys` / `emilyspass`**. Câu 9 và Câu 10 đều cần đăng nhập;
  đăng nhập ở câu nào thì câu kia và sidebar cũng nhận ra ngay.
- Dự án có thể bàn giao cho sinh viên dưới dạng khung sườn bằng cách xoá thân hàm
  trong `exercises/` và giữ lại `services/`, `context/`, `components/`.
