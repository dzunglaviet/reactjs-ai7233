import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import './index.css'

// Bản đơn giản: chỉ có BrowserRouter bọc ngoài, không Provider nào.
// Mỗi màn hình tự giữ state của nó bằng useState.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
