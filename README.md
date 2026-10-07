# Bài giải — Practice Set: DummyJSON API

Lời giải đầy đủ cho 10 câu trong `4. Homeworks/DummyJSON-Thuc-hanh.md`, dựng thành một dự án chạy được bằng **React 19 + Vite 8 + TailwindCSS v4 + React Router 8**.

> **Về tên package:** dự án dùng `react-router`, **không** dùng `react-router-dom`. Từ React Router v7 trở đi, mọi thứ cho web (`BrowserRouter`, `Routes`, `Route`, `Link`, `NavLink`, `useParams`, `useNavigate`…) đã gộp hết vào `react-router`; `react-router-dom` chỉ còn là lớp bọc re-export giữ cho code cũ chạy được. Tài liệu cũ trên mạng vẫn viết `react-router-dom` — nếu sinh viên copy về thì vẫn chạy, nhưng là thừa một package.

Phần trả lời bằng chữ của cả 10 câu nằm ở **[ANSWERS.md](./ANSWERS.md)**.

---

## Chạy dự án

```bash
npm install
npm run dev      # http://localhost:5173
```

Mặc định app gọi thẳng `https://dummyjson.com`, không cần cấu hình gì thêm.

Muốn đổi sang server mirror chạy local (xem Phụ lục A của đề bài):

```bash
cp .env.example .env.local      # sửa VITE_API_URL trong đó
npm run dev                     # phải khởi động lại, Vite chỉ đọc .env lúc start
```

Lệnh khác:

```bash
npm run build     # build production
npm run lint      # oxlint
npm run preview   # xem thử bản build
```

---

## Cấu trúc thư mục

```
index.html                    Có script chống "nháy trắng" khi mở trang ở chế độ tối

src/
├── main.jsx                  Điểm vào, bọc <BrowserRouter> + 2 Provider
├── App.jsx                   Ghép AppLayout + AppRoutes (chỉ 10 dòng)
├── index.css                 @import "tailwindcss" + @custom-variant dark
│
├── routes/
│   ├── navigation.js         Danh sách 10 bài — sidebar, menu mobile, trang chủ cùng đọc từ đây
│   └── AppRoutes.jsx         Toàn bộ bảng route
│
├── services/                 TẦNG GỌI API — component không tự fetch
│   ├── httpClient.js         apiGet / apiSend, base URL từ env, xử lý lỗi tập trung
│   ├── productService.js     buildProductListPath + các endpoint sản phẩm
│   ├── cartService.js        giỏ hàng (bóc lớp bọc { carts: [...] })
│   └── authService.js        login + /auth/me kèm Bearer token
│
├── context/                  STATE TOÀN CỤC (Context)
│   ├── authReducer.js        hàm thuần: AUTH_ACTIONS, initialAuthState, reducer
│   ├── authContext.js        createContext (để riêng cho Fast Refresh)
│   ├── AuthProvider.jsx      useReducer + login()/logout() gọi API
│   ├── themeContext.js       createContext cho giao diện sáng/tối
│   └── ThemeProvider.jsx     useState + localStorage + đặt data-theme lên <html>
│
├── hooks/                    LOGIC TÁI SỬ DỤNG
│   ├── useAuth.js            useContext(AuthContext) + báo lỗi nếu dùng sai chỗ
│   ├── useTheme.js           useContext(ThemeContext) — cùng khuôn với useAuth
│   ├── useCart.js            nghiệp vụ giỏ hàng + lọc dữ liệu đọc từ storage
│   ├── useLocalStorageState.js  useState nhưng tự lưu/đọc localStorage
│   └── useDebouncedValue.js  hoãn giá trị 400ms cho ô tìm kiếm
│
├── utils/
│   └── format.js             money(), discountedPrice(), lineTotal() — hàm thuần
│
├── components/               CHIA THEO DOMAIN
│   ├── ui/                   Spinner, ErrorBox, EmptyState, Badge (+ index.js barrel)
│   ├── layout/               AppLayout, Sidebar, MobileNav, NavItem,
│   │                         ExerciseLayout, AuthStatus, ThemeToggle
│   ├── product/              ProductCard, ProductGrid, CategoryFilter, SearchBar,
│   │                         SortSelect, Pagination, ProductDetailView,
│   │                         ReviewList, ReviewItem, ProductForm
│   ├── cart/                 CartMenu, CartButton, CartPanel, CartItem,
│   │                         CartLineList, CartLine
│   └── auth/                 LoginForm, RequireAuth (cổng đăng nhập)
│
├── pages/                    MÀN HÌNH HOÀN CHỈNH
│   ├── HomePage.jsx
│   ├── ShopPage.jsx          ứng dụng tổng hợp (gộp câu 3→8)
│   ├── ProductDetailPage.jsx
│   └── NotFoundPage.jsx
│
└── exercises/                LỜI GIẢI TỪNG CÂU, đọc độc lập được
    └── Q01…Q10
```

**Quy ước phân tầng:**

| Tầng | Được phép | Không được phép |
|---|---|---|
| `services/` | gọi `fetch`, biết URL và hình dạng response | import React |
| `hooks/` | giữ state, gọi service | render JSX |
| `components/ui`, `product`, `cart`, `auth` | nhận props, render, gọi callback | gọi API cho dữ liệu mà cha đã có |
| `pages/` | sở hữu state màn hình, điều phối | chứa markup chi tiết |

Ngoại lệ có chủ ý: `CategoryFilter` và `ProductForm` tự gọi service, vì danh sách danh mục là dữ liệu riêng của chúng — cha không có và cũng không cần.

---

## Bảng ánh xạ câu hỏi → file

| Câu | Nội dung | File chính | Kiến thức trọng tâm |
|---|---|---|---|
| 1 | Fetch + useEffect | `exercises/Q01ProductList.jsx` | 3 trạng thái, `data.products`, async trong effect |
| 2 | Container / presentational | `exercises/Q02CompositeList.jsx` | cha giữ state, con chỉ hiển thị |
| 3 | Lọc danh mục | `exercises/Q03CategoryFilter.jsx` | lifting state up, categories là object |
| 4 | Tìm kiếm + debounce | `exercises/Q04Search.jsx` | 2 component anh em, cleanup huỷ timer |
| 5 | Sắp xếp | `exercises/Q05Sort.jsx` | một effect, dependency array đủ |
| 6 | Phân trang | `exercises/Q06Pagination.jsx` | limit/skip/total, reset trang |
| 7 | Trang chi tiết | `exercises/Q07Detail.jsx` | useParams, 404, cleanup chống race |
| 8 | Giỏ hàng | `exercises/Q08Cart.jsx` + `hooks/useCart.js` | prop drilling 3 tầng, giá trị dẫn xuất |
| 9 | Thêm / sửa / xoá | `exercises/Q09Crud.jsx` + `ProductForm` | CRUD giả lập, optimistic + rollback, `RequireAuth`, `enableReinitialize` |
| 10 | Đăng nhập + giỏ | `exercises/Q10UserCart.jsx` + `context/` | `useReducer` + Context, Bearer, `Promise.allSettled` |
| — | **Tổng hợp** | `pages/ShopPage.jsx` | gộp câu 3→8 thành app hoàn chỉnh |

---

## Các hook nâng cao dùng ở đâu, và vì sao ở đó

| Hook | Chỗ dùng | Lý do chọn chỗ đó |
|---|---|---|
| `useReducer` | `context/authReducer.js` | State đăng nhập có 5 mảnh **luôn đổi cùng nhau** theo từng sự kiện. Viết bằng 5 `useState` là 5 lệnh set rải rác, quên một cái là sinh trạng thái vô lý (`isLoggedIn: true` mà `userInfo: null`). Reducer gom mỗi sự kiện thành một phép chuyển trạng thái. |
| `useContext` | `AuthProvider` → `Q10UserCart` **và** `layout/AuthStatus` | Hai nơi tiêu thụ nằm ở **hai nhánh rất xa nhau**. Truyền props sẽ phải đi xuyên `App → AppLayout → Sidebar`, toàn component chẳng liên quan gì tới đăng nhập. |
| `useContext` | `ThemeProvider` → `layout/ThemeToggle` (và màu thì áp ở **mọi** component) | Ca dùng Context điển hình nhất: ai cũng cần biết, rất ít khi đổi, và truyền bằng props thì phải xuyên qua hàng chục component chẳng liên quan. |
| `useRef` | `ProductForm` | Đưa con trỏ về ô "Tên sản phẩm" sau khi gửi xong; khi bấm Sửa thì cuộn tới form và focus sẵn. |
| `useRef` | `ShopPage` (2 chỗ) | Focus ô tìm kiếm khi mở trang; cuộn về đầu danh sách khi sang trang khác (có cờ bỏ qua lần render đầu). |
| `useRef` | `CartMenu` (3 chỗ) | Phát hiện click ra ngoài bằng `containerRef.contains(e.target)`; đưa con trỏ vào bảng giỏ khi mở và trả về nút khi đóng. |
| `useRef` | `useLocalStorageState` | Giữ cờ `isFirstRender` — giá trị cần nhớ qua các lần render **nhưng không được gây re-render**. |
| Formik + Yup | `ProductForm` | Luật kiểm tra dữ liệu khai báo tách rời trong schema, thay vì rải `if/else` trong hàm submit. Một form dùng cho cả thêm lẫn sửa nhờ `enableReinitialize`. |

### Giao diện sáng / tối (`ThemeContext`)

Nút chuyển ở cuối sidebar (trên điện thoại thì nằm trong menu ngang, chỉ hiện icon). Lựa chọn được **lưu vào localStorage**, nên giữ nguyên sau khi F5. Người dùng mới chưa từng bấm thì app nghe theo cài đặt hệ điều hành (`prefers-color-scheme`); đã bấm một lần rồi thì lựa chọn của họ luôn thắng.

**Cơ chế:** Tailwind v4 mặc định cho `dark:` nghe theo hệ điều hành, nghĩa là người dùng *không tự bật tắt được*. Phải khai báo lại biến thể trong `index.css`:

```css
@custom-variant dark (&:where([data-theme='dark'], [data-theme='dark'] *));
```

Từ đó `dark:bg-slate-800` chỉ có hiệu lực khi thẻ `<html>` có `data-theme="dark"`. `:where(...)` giữ cho biến thể **không làm tăng độ ưu tiên** của selector — thiếu nó thì mọi lớp `dark:` sẽ đè lên các lớp khác kể cả khi ta không muốn.

Năm điểm đáng dạy:

- **`useState` chứ không `useReducer`.** Giá trị chỉ là một chuỗi `'light' | 'dark'`. Reducer đáng dùng khi nhiều mảnh state phải đổi cùng nhau theo luật — như `authReducer` (một lần đăng nhập đổi cả 5 mảnh). Ở đây chỉ có một mảnh, thêm reducer là thêm việc vô ích. Đặt cạnh `AuthProvider` thành một cặp đối chiếu rất rõ: **cùng là Context, nhưng cách giữ state khác nhau vì hình dạng state khác nhau.**
- **Sửa `<html>` phải làm trong `useEffect`.** Thẻ `<html>` nằm **ngoài** cây React, React không quản lý nó, nên không thể đổi bằng cách trả về JSX — đây là một *side effect*. Viết `document.documentElement.setAttribute(...)` ngay trong thân component là sai nguyên tắc "thân component phải thuần", và `StrictMode` của React 19 gọi component hai lần đúng để lộ loại lỗi này ra.
- **`isDark` là giá trị dẫn xuất**, tính lúc render từ `theme`, không cho vào state thứ hai. Hai ô state cùng mô tả một sự thật thì sớm muộn cũng lệch nhau.
- **`color-scheme` trong CSS.** Thanh cuộn, ô `<select>`, con trỏ nhập liệu là do trình duyệt vẽ, Tailwind không với tới. Thiếu `color-scheme: dark` thì nền tối mà thanh cuộn vẫn trắng toát.
- **Chống "nháy trắng" (FOUC) bằng script trong `index.html`.** `useEffect` chỉ chạy *sau* khi React dựng xong cây — trong vài chục ms trước đó trang vẫn sáng, nên người chọn giao diện tối sẽ thấy màn hình loé trắng một cái. Không sửa được từ bên trong React. Cách duy nhất là đặt `data-theme` **trước** khi React chạy, bằng một script đồng bộ trong `<head>`. Script đó phải đọc **đúng key và đúng định dạng** mà `useLocalStorageState` ghi — tức `JSON.parse`, vì giá trị trong storage là `"dark"` có dấu nháy.

`ThemeToggle` **không nhận props nào về dữ liệu**, nó lấy thẳng từ `useTheme()`. Đặt cạnh `CartButton` để so sánh: nút giỏ hàng nhận `quantity`/`total` qua props vì giỏ hàng chỉ thuộc về trang `/shop`, còn giao diện sáng/tối là chuyện toàn app. **Cùng là một cái nút, phạm vi dữ liệu khác nhau thì cách lấy dữ liệu cũng phải khác nhau.**

### Giỏ hàng trên header (`CartMenu`)

Ở `/shop`, bố cục theo đúng kiểu trang thương mại điện tử: thanh header dính trên cùng gồm **tên cửa hàng — ô tìm kiếm — giỏ hàng ở góc phải**. Nút giỏ có badge đếm **tổng số lượng** (3 cái áo cùng loại hiện `3`; muốn đếm số mặt hàng thì đổi thành `items.length`) kèm tổng tiền. Bấm vào thì bảng giỏ thả xuống ngay dưới nút để sửa/xoá tại chỗ.

Bốn điểm đáng dạy trong component này:

- **`isOpen` để state cục bộ**, không đẩy lên `ShopPage`. Đó là trạng thái giao diện thuần tuý, không ai khác cần biết — state đặt ở chỗ thấp nhất mà vẫn đủ dùng.
- **Click ra ngoài thì đóng**, cài bằng `containerRef.current.contains(event.target)` — mẫu chuẩn của mọi menu thả xuống. Nghe `mousedown` chứ không phải `click` để đóng ngay khi nhấn.
- **Menu thả xuống ≠ hộp thoại**: không khoá cuộn trang, không có lớp nền mờ. Người dùng vẫn cuộn danh sách phía sau bình thường. Đây là chỗ tốt để hỏi sinh viên "khi nào dùng dropdown, khi nào dùng modal?".
- **Dọn dẹp đầy đủ trong `useEffect`**: gỡ cả hai listener và trả con trỏ về nút giỏ. Giá trị ref được **chụp vào biến cục bộ** đầu effect (`const buttonElement = buttonRef.current`) rồi mới dùng trong cleanup — đọc thẳng `buttonRef.current` trong cleanup là lỗi mà `react-hooks/exhaustive-deps` bắt được.

Việc đóng menu khi bấm "Xoá tất cả" cũng được xử lý **tại sự kiện**, không phải bằng `useEffect` kiểu `if (items.length === 0) setIsOpen(false)` — gọi `setState` trong effect làm React render thừa một lượt và bị oxlint cảnh báo. Ví dụ rất tốt để chỉ ra *khi nào không nên dùng effect*.

Câu 8 vẫn giữ `CartPanel` ở cột bên phải cho dễ giảng; bản header chỉ dùng ở ứng dụng tổng hợp. `CartPanel` được dùng lại nguyên vẹn ở cả hai nơi nhờ bỏ `sticky` ra khỏi nó và để nơi gọi tự lo định vị.

### Cổng đăng nhập ở Câu 9 (`RequireAuth`)

Toàn bộ khu vực thêm/sửa/xoá nằm sau `<RequireAuth>`. Viết thành component bọc thay vì rải `if (!isLoggedIn) return ...` trong từng màn hình: luật kiểm tra nằm một chỗ, và `CrudShop` bên trong coi như luôn có người dùng hợp lệ.

Form đăng nhập hiện ngay tại Câu 9 gọi thẳng `login` lấy từ `AuthContext`, nên đăng nhập ở đây thì **sidebar và Câu 10 cũng nhận ra ngay** — một minh hoạ nữa cho việc state toàn cục nằm ở Context. Đăng xuất ở sidebar là khu vực Câu 9 khoá lại tức thì.

**Hai chỗ cố tình KHÔNG dùng, để giữ bài học:**

- **Giỏ hàng vẫn truyền bằng props qua ba tầng** (Câu 8), không chuyển sang Context. Context chính là lời giải cho prop drilling — nhưng sinh viên phải *thấy vấn đề* trước thì mới hiểu Context sinh ra để làm gì. Chuyển sớm là mất bài.
- **`LoginForm` vẫn viết tay bằng `useState`**, chỉ `ProductForm` dùng Formik. Có đủ cả hai để đối chiếu trực tiếp — đúng mạch Buổi 10 (câu 5 viết tay, câu 6 viết lại bằng Formik).

---

## Sáu chỗ sinh viên hay vấp

1. **Response danh sách bị bọc**: `{ products, total, skip, limit }` — phải đọc `data.products`, không phải `data`.
2. **`/products/categories` trả mảng object** `{ slug, name, url }` — hiển thị `name`, gửi đi `slug`. Render thẳng ra `[object Object]`.
3. **Id sai trả 404 thật** (khác fakestoreapi trả `200` + `null`) — nên `res.ok` ở API này là cách kiểm tra đúng.
4. **Thêm/sửa/xoá chỉ giả lập** — phải tự cập nhật state; fetch lại là mất sạch thay đổi.
5. **`rating` là một số**, không phải object `{ rate, count }`.
6. **`price` là giá gốc** — tiền thực trả phải tính từ `discountPercentage`, và tính lúc render chứ không cho vào `useState`.

---

## Ghi chú cho giảng viên

- Mỗi file trong `exercises/` đọc được một mạch từ trên xuống, cố ý **không** trừu tượng hoá quá mức để sinh viên đối chiếu với bài mình làm. Chỗ nào thực tế nên tách ra service/hook đều có comment chỉ rõ.
- Câu 1 cố tình dùng `fetch` thô thay vì `apiGet()` để thấy đủ các bước `res.ok` → `res.json()` → `data.products`.
- Câu 4 viết debounce thẳng trong component cho thấy cơ chế; `hooks/useDebouncedValue.js` là bản đóng gói lại mà ứng dụng tổng hợp dùng.
- Giỏ hàng trong `pages/ShopPage.jsx` đặt **bên trên** `<Routes>` — nếu đặt trong component con thì mở trang chi tiết rồi quay lại là giỏ hàng mất sạch. Đây là ví dụ tốt để hỏi sinh viên "tại sao state phải nằm ở đây?".
- Giỏ hàng ở `/shop` được **lưu xuống localStorage** (`useCart({ storageKey })`), còn giỏ ở Câu 8 thì không — cố ý, để hai nơi không dùng chung dữ liệu khi demo. Bốn điểm đáng dạy nằm trong `hooks/useLocalStorageState.js`: lazy initializer, `try/catch` cho cả đọc lẫn ghi, bỏ qua lần ghi đầu tiên, và **lọc lại dữ liệu đọc lên** (`sanitizeItems` trong `useCart.js`) vì đó là dữ liệu ngoài tầm kiểm soát.
- Dự án có thể bàn giao cho sinh viên dưới dạng khung sườn bằng cách xoá thân hàm trong `exercises/` và giữ lại toàn bộ `services/`, `components/ui/`, `components/layout/`.
