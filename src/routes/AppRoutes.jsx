import { Route, Routes } from 'react-router'
import Q01ProductList from '../exercises/Q01ProductList.jsx'
import Q02CompositeList from '../exercises/Q02CompositeList.jsx'
import Q03CategoryFilter from '../exercises/Q03CategoryFilter.jsx'
import Q04Search from '../exercises/Q04Search.jsx'
import Q05Sort from '../exercises/Q05Sort.jsx'
import Q06Pagination from '../exercises/Q06Pagination.jsx'
import Q07Detail from '../exercises/Q07Detail.jsx'
import Q08Cart from '../exercises/Q08Cart.jsx'
import Q09Crud from '../exercises/Q09Crud.jsx'
import Q10UserCart from '../exercises/Q10UserCart.jsx'
import HomePage from '../pages/HomePage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import ShopPage from '../pages/ShopPage.jsx'

/** Toàn bộ bảng route của ứng dụng, gom về một file. */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Ứng dụng tổng hợp — có route con cho trang chi tiết */}
      <Route path="/shop/*" element={<ShopPage />} />

      <Route path="/bai/1" element={<Q01ProductList />} />
      <Route path="/bai/2" element={<Q02CompositeList />} />
      <Route path="/bai/3" element={<Q03CategoryFilter />} />
      <Route path="/bai/4" element={<Q04Search />} />
      <Route path="/bai/5" element={<Q05Sort />} />
      <Route path="/bai/6" element={<Q06Pagination />} />
      {/* Câu 7 cần route con /bai/7/:id */}
      <Route path="/bai/7/*" element={<Q07Detail />} />
      <Route path="/bai/8" element={<Q08Cart />} />
      <Route path="/bai/9" element={<Q09Crud />} />
      <Route path="/bai/10" element={<Q10UserCart />} />

      {/* Catch-all: bắt mọi URL không khớp (Buổi 8) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
