import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Medal, Award, BookOpen, Heart, Settings, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { obtenerUsuario, obtenerRecetasUsuario, obtenerRecetas } from '../services/firebaseService'
import RecipeCard from '../components/RecipeCard'

export default function Profile() {
  const { dark } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState(null)
  const [misRecetas, setMisRecetas] = useState([])
  const [favoritas, setFavoritas] = useState([])
  const [tab, setTab] = useState('recetas')

  const load = async () => {
    try {
      const data = await obtenerUsuario(user.uid)
      setPerfil(data || {
        nombre: user.displayName || user.email?.split('@')[0],
        puntos: 0,
        insignia: 'Cocinero Novato'
      })
      
      const todasMisRecetas = await obtenerRecetasUsuario(user.uid)
      setMisRecetas(todasMisRecetas)

      // Favoritas del usuario: buscar en TODAS las recetas, no solo las propias
      const todasLasRecetas = await obtenerRecetas()
      setFavoritas(todasLasRecetas.filter(r => r.favoritos?.includes(user.uid)))
    } catch (error) {
      console.error('Error cargando perfil:', error)
    }
  }

  useEffect(() => { 
    load() 
  }, [user])

  const handleDelete = (id) => {
    setMisRecetas(prev => prev.filter(r => r.id !== id))
    setFavoritas(prev => prev.filter(r => r.id !== id))
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Error cerrando sesión:', error)
    }
  }

  if (!perfil) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className={`min-h-screen pb-20 md:pb-0 ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto px-4 py-4 md:py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={`p-5 md:p-8 rounded-2xl shadow-lg mb-6 ${dark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover border-4 border-orange-500" />
              ) : (
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center border-4 border-orange-500">
                  <User size={32} className="md:hidden text-orange-500" />
                  <User size={48} className="hidden md:block text-orange-500" />
                </div>
              )}
              <div className="text-center md:text-left flex-1">
                <h1 className={`text-xl md:text-2xl font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>{perfil.nombre || user.email?.split('@')[0]}</h1>
                <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{user.email}</p>
                {perfil.role === 'admin' && (
                  <span className="inline-block mt-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-full">
                    Administrador
                  </span>
                )}
              </div>
              <div className="flex gap-4 md:gap-6 text-center">
                <div className="px-4 md:px-6 py-2 md:py-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                  <p className="text-xl md:text-2xl font-bold text-orange-500">{perfil.puntos || 0}</p>
                  <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Puntos</p>
                </div>
                <div className="px-4 md:px-6 py-2 md:py-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                  <p className="text-xs md:text-sm font-bold text-orange-500 flex items-center gap-1">
                    <Award size={16} className="hidden md:inline" />{perfil.insignia}
                  </p>
                  <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Insignia</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center md:hidden mt-4 gap-2">
              <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 dark:border-red-800 text-red-400 text-sm">
                <LogOut size={16} /> Cerrar sesión
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-5 overflow-x-auto -mx-4 px-4 snap-x">
            {[
              { key: 'recetas', icon: BookOpen, label: `Mis Recetas (${misRecetas.length})` },
              { key: 'favoritos', icon: Heart, label: `Favoritos (${favoritas.length})` },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`snap-start flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm transition-all ${tab === t.key ? 'bg-orange-500 text-white shadow-md' : dark ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}>
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {(tab === 'recetas' ? misRecetas : favoritas).map((r, i) => (
              <RecipeCard key={r.id} receta={r} index={i} onDelete={handleDelete} />
            ))}
          </div>

          {(tab === 'recetas' ? misRecetas : favoritas).length === 0 && (
            <div className={`text-center py-12 rounded-2xl ${dark ? 'bg-slate-800' : 'bg-white'}`}>
              <BookOpen size={48} className="mx-auto text-slate-400 mb-3" />
              <p className={`text-base ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                {tab === 'recetas' ? 'Aún no has creado recetas' : 'No tienes favoritos'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
