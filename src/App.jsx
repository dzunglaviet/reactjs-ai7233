import AppLayout from './components/layout/AppLayout.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

/** App chỉ còn ghép bố cục với bảng route — mọi thứ khác đã tách ra file riêng. */
export default function App() {
  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  )
}
