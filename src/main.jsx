import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import AuthProvider from './context/AuthProvider.jsx'
import ThemeProvider from './context/ThemeProvider.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* Hai Provider độc lập nhau, thứ tự lồng vào không quan trọng:
          ThemeProvider không đọc gì của auth, AuthProvider không đọc gì của theme.
          Chỉ khi một Provider CẦN dữ liệu của Provider khác thì nó mới phải nằm
          bên trong. */}
      <ThemeProvider>
        {/* AuthProvider bọc ngoài App: mọi component bên trong đều gọi được useAuth() */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
