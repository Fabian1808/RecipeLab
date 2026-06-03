import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import CreateRecipe from './pages/CreateRecipe'
import RecipeDetail from './pages/RecipeDetail'
import Profile from './pages/Profile'
import Ranking from './pages/Ranking'
import Admin from './pages/Admin'

function Layout({ children }) {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login'

  return (
    <div className={`min-h-screen flex flex-col ${!isAuthPage ? 'pb-16 md:pb-0' : ''}`}>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              {/* Redirigir /register al login — app de uso personal */}
              <Route path="/register" element={<Navigate to="/login" replace />} />
              <Route path="/receta/:id" element={<RecipeDetail />} />
              <Route path="/crear" element={<ProtectedRoute><CreateRecipe /></ProtectedRoute>} />
              <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/ranking" element={<ProtectedRoute><Ranking /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
