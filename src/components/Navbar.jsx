import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ChefHat, LogOut, User, Medal, PlusCircle, Home as HomeIcon, Settings, Menu, X, ClipboardList } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { isAdminUser } from '../services/demoService'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, logout, demo } = useAuth()
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
            {demo && <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-normal">Demo</span>}
          </Link>

          <div className="flex items-center gap-1">
            {user && (
              <>
                <Link to="/" className={`nav-link ${isActive('/') ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' : ''}`}><HomeIcon size={20} /></Link>
                <Link to="/crear" className={`nav-link ${isActive('/crear') ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' : ''}`}><PlusCircle size={20} /></Link>
                <Link to="/ranking" className={`nav-link ${isActive('/ranking') ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' : ''}`}><Medal size={20} /></Link>
                {(demo || isAdminUser(user.email)) && (
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
            {demo && <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-normal">Demo</span>}
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
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <Link to="/perfil" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <User size={20} className="text-orange-500" />
                  </div>
                )}
                <div>
                  <p className={`font-medium text-sm ${dark ? 'text-white' : 'text-slate-800'}`}>{user.displayName || 'Usuario'}</p>
                  <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{user.email}</p>
                </div>
              </Link>
            </div>
            <div className="py-2">
              {[
                { to: '/', icon: HomeIcon, label: 'Inicio' },
                { to: '/crear', icon: PlusCircle, label: 'Nueva Receta' },
                { to: '/ranking', icon: Medal, label: 'Ranking' },
                ...(demo || isAdminUser(user.email) ? [{ to: '/admin', icon: Settings, label: 'Admin' }] : []),
              ].map(item => (
                <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 ${isActive(item.to) ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' : dark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-gray-50'}`}>
                  <item.icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
              <button onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOut size={20} />
                <span className="text-sm font-medium">Cerrar sesión</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {user && (
        <nav className={`fixed bottom-0 left-0 right-0 z-50 ${dark ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'} border-t backdrop-blur-lg md:hidden safe-bottom`}>
          <div className="flex items-center justify-around py-1">
            {[
              { to: '/', icon: HomeIcon, label: 'Inicio' },
              { to: '/crear', icon: PlusCircle, label: 'Crear' },
              { to: '/ranking', icon: Medal, label: 'Ranking' },
              { to: '/perfil', icon: User, label: 'Perfil' },
            ].map(item => (
              <Link key={item.to} to={item.to}
                className={`bottom-nav-link ${isActive(item.to) ? 'active' : ''}`}>
                <item.icon size={22} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  )
}
