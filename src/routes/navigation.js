// ---------------------------------------------------------------------------
// Khai báo điều hướng ở MỘT chỗ: sidebar, menu mobile và trang Giới thiệu đều
// đọc từ đây, nên thêm bài mới chỉ phải sửa một file.
// ---------------------------------------------------------------------------
export const EXERCISE_ROUTES = [
  { number: 1, path: '/bai/1', navTitle: 'Fetch + useEffect', focus: 'Gọi API, 3 trạng thái, response bị bọc' },
  { number: 2, path: '/bai/2', navTitle: 'Container / presentational', focus: 'Tách cha giữ state — con chỉ hiển thị' },
  { number: 3, path: '/bai/3', navTitle: 'Lọc danh mục', focus: 'Đẩy dữ liệu từ con lên cha (lifting state up)' },
  { number: 4, path: '/bai/4', navTitle: 'Tìm kiếm + debounce', focus: 'Hai component anh em, cleanup huỷ timer' },
  { number: 5, path: '/bai/5', navTitle: 'Sắp xếp', focus: 'Một useEffect, dependency array đủ và đúng' },
  { number: 6, path: '/bai/6', navTitle: 'Phân trang', focus: 'limit/skip/total, reset trang khi đổi bộ lọc' },
  { number: 7, path: '/bai/7', navTitle: 'Trang chi tiết', focus: 'Router, 404, cleanup chống race condition' },
  { number: 8, path: '/bai/8', navTitle: 'Giỏ hàng', focus: 'Prop drilling 3 tầng, giá trị dẫn xuất' },
  { number: 9, path: '/bai/9', navTitle: 'Thêm / xoá', focus: 'CRUD giả lập, optimistic update + rollback' },
  { number: 10, path: '/bai/10', navTitle: 'Đăng nhập', focus: 'Bearer token, Promise.all, 7 trạng thái' },
]
