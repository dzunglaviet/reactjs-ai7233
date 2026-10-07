import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import AuthProvider from './context/AuthProvider.jsx'
import './index.css'

// AuthProvider bọc ngoài App: mọi component ở bất kỳ độ sâu nào cũng đọc được
// trạng thái đăng nhập bằng useContext(AuthContext), không cần ai truyền props.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
