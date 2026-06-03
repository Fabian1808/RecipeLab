import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ChefHat, LogOut, User, Medal, PlusCircle, Home as HomeIcon, Settings, Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { dark } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      <nav className={`sticky top-0 z-50 ${dark ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'} border-b shadow-sm backdrop-blur-lg hidden md:block`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-orange-500">
            <ChefHat size={28} />
            RecipeLab
          </Link>

          <div className="flex items-center gap-1">
            {user && (
              <>
                <Link to="/" className={`nav-link ${isActive('/') ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' : ''}`}><HomeIcon size={20} /></Link>
                <Link to="/crear" className={`nav-link ${isActive('/crear') ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' : ''}`}><PlusCircle size={20} /></Link>
                <Link to="/ranking" className={`nav-link ${isActive('/ranking') ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' : ''}`}><Medal size={20} /></Link>
                {isAdmin && (
                  <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' : ''}`}><Settings size={20} /></Link>
                )}
              </>
            )}

            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/perfil" className="flex items-center gap-2 hover:opacity-80 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <User size={16} className="text-orange-500" />
                    </div>
                  )}
                  <span className={`text-sm hidden lg:inline ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </Link>
                <button onClick={handleLogout} className="btn-icon text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm px-5 py-2 rounded-xl">Ingresar</Link>
            )}
          </div>
        </div>
      </nav>

      <nav className={`sticky top-0 z-50 ${dark ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'} border-b shadow-sm backdrop-blur-lg md:hidden`}>
        <div className="px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-orange-500">
            <ChefHat size={24} />
            RecipeLab
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <button onClick={() => setMenuOpen(!menuOpen)} className="btn-icon">
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            ) : (
              <Link to="/login" className="btn-primary text-sm px-4 py-2 rounded-xl">Ingresar</Link>
            )}
          </div>
        </div>

        {menuOpen && user && (
          <div className={`absolute top-14 left-0 right-0 ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border-b shadow-xl animate-fade-in`}>
            <div className="px-4 py-3 space-y-2">
              <Link to="/" onClick={() => setMenuOpen(false)} className={`block px-4 py-2 rounded-xl ${isActive('/') ? 'bg-orange-500 text-white' : dark ? 'text-slate-300' : 'text-slate-700'}`}>
                <HomeIcon className="inline mr-2" size={18} /> Inicio
              </Link>
              <Link to="/crear" onClick={() => setMenuOpen(false)} className={`block px-4 py-2 rounded-xl ${isActive('/crear') ? 'bg-orange-500 text-white' : dark ? 'text-slate-300' : 'text-slate-700'}`}>
                <PlusCircle className="inline mr-2" size={18} /> Nueva Receta
              </Link>
              <Link to="/ranking" onClick={() => setMenuOpen(false)} className={`block px-4 py-2 rounded-xl ${isActive('/ranking') ? 'bg-orange-500 text-white' : dark ? 'text-slate-300' : 'text-slate-700'}`}>
                <Medal className="inline mr-2" size={18} /> Ranking
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className={`block px-4 py-2 rounded-xl ${isActive('/admin') ? 'bg-orange-500 text-white' : dark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <Settings className="inline mr-2" size={18} /> Admin
                </Link>
              )}
              <Link to="/perfil" onClick={() => setMenuOpen(false)} className={`block px-4 py-2 rounded-xl ${isActive('/perfil') ? 'bg-orange-500 text-white' : dark ? 'text-slate-300' : 'text-slate-700'}`}>
                <User className="inline mr-2" size={18} /> Perfil
              </Link>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOut className="inline mr-2" size={18} /> Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

