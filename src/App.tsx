import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './components/feedback/ToastProvider'
import { AuthProvider } from './features/auth/context/AuthContext'
import AppRoutes from './routes'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
