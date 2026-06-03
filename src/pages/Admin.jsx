import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, BookOpen, MessageCircle, Trash2, BarChart3, Search, UserPlus, Globe, Lock } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { obtenerEstadisticas, obtenerRecetas, eliminarReceta, obtenerTodosUsuarios } from '../services/firebaseService'

export default function Admin() {
  const { dark } = useTheme()
  const { isAdmin } = useAuth()
  const [stats, setStats] = useState(null)
  const [recetas, setRecetas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [newUser, setNewUser] = useState({ nombre: '', email: '', password: '' })
  const [tab, setTab] = useState('stats')
  const [busqueda, setBusqueda] = useState('')
  const [creando, setCreando] = useState(false)

  const load = async () => {
    const e = await obtenerEstadisticas()
    setStats(e)
    const r = await obtenerRecetas()
    setRecetas(r)
    const u = await obtenerTodosUsuarios()
    setUsuarios(u)
  }

  useEffect(() => { load() }, [])

  const handleEliminar = async (id) => {
    if (confirm('¿Eliminar esta receta?')) {
      await eliminarReceta(id)
      load()
    }
  }

  const handleCrearUsuario = async (e) => {
    e.preventDefault()
    if (!newUser.nombre || !newUser.email || !newUser.password) return
    setCreando(true)
    try {
      setNewUser({ nombre: '', email: '', password: '' })
      load()
    } finally {
      setCreando(false)
    }
  }

  const recetasFiltradas = recetas.filter(r =>
    !busqueda || r.titulo?.toLowerCase().includes(busqueda.toLowerCase()) || r.autorNombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (!stats) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full" />
    </div>
  )

  const inputClass = `w-full px-4 py-2.5 rounded-xl border text-sm ${dark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-orange-500`

  return (
    <div className={`min-h-screen pb-20 md:pb-8 ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-2xl md:text-3xl font-bold mb-5 ${dark ? 'text-white' : 'text-slate-800'}`}>Panel de Administración</h1>

          <div className="flex gap-2 mb-5 overflow-x-auto -mx-4 px-4 snap-x">
            {[
              { key: 'stats', icon: BarChart3, label: 'Estadísticas' },
              { key: 'recetas', icon: BookOpen, label: `Recetas (${recetas.length})` },
              { key: 'usuarios', icon: Users, label: `Usuarios (${usuarios.length})` },
              { key: 'crear', icon: UserPlus, label: 'Crear Usuario' },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`snap-start flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm transition-all ${tab === t.key ? 'bg-orange-500 text-white shadow-md' : dark ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}>
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>

          {tab === 'stats' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
              {[
                { icon: Users, label: 'Usuarios', value: stats.usuarios, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                { icon: BookOpen, label: 'Recetas', value: stats.recetas, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                { icon: MessageCircle, label: 'Comentarios', value: stats.comentarios, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className={`p-5 md:p-6 rounded-2xl shadow-sm ${dark ? 'bg-slate-800' : 'bg-white'}`}>
                  <div className={`inline-flex p-3 rounded-xl ${s.bg} mb-3`}>
                    <s.icon size={24} className={`${s.color}`} />
                  </div>
                  <p className={`text-2xl md:text-3xl font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>{s.value}</p>
                  <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{s.label}</p>
                </motion.div>
              ))}
            </div>
          )}

          {tab === 'recetas' && (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Buscar recetas..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className={inputClass} />
              </div>
              <div className={`rounded-2xl shadow-sm overflow-hidden ${dark ? 'bg-slate-800' : 'bg-white'}`}>
                {recetasFiltradas.map(r => (
                  <div key={r.id} className={`flex items-center justify-between p-3 md:p-4 border-b ${dark ? 'border-slate-700' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {r.imagen ? (
                        <img src={r.imagen} alt="" className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-lg md:text-xl flex-shrink-0">🍽️</div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium text-sm md:text-base truncate ${dark ? 'text-white' : 'text-slate-800'}`}>{r.titulo}</p>
                          <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs ${r.isPublic !== false ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-purple-500 bg-purple-50 dark:bg-purple-900/20'}`}>
                            {r.isPublic !== false ? <Globe size={10} /> : <Lock size={10} />}
                          </span>
                        </div>
                        <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>por {r.autorNombre} &middot; {r.likes?.length || 0} likes</p>
                      </div>
                    </div>
                    <button onClick={() => handleEliminar(r.id)}
                      className="p-2.5 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex-shrink-0 ml-2">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {recetasFiltradas.length === 0 && (
                  <p className={`text-center py-8 text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>No se encontraron recetas</p>
                )}
              </div>
            </>
          )}

          {tab === 'usuarios' && (
            <div className={`rounded-2xl shadow-sm overflow-hidden ${dark ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {usuarios.map(u => (
                  <div key={u.uid} className="flex items-center gap-3 p-3 md:p-4">
                    {u.foto ? (
                      <img src={u.foto} alt="" className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                        <Users size={18} className="text-orange-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${dark ? 'text-white' : 'text-slate-800'}`}>{u.nombre || 'Usuario'}</p>
                      <p className={`text-xs truncate ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">

                      <div className="text-right">
                        <p className="font-bold text-orange-500 text-sm">{u.puntos || 0}</p>
                        <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{u.insignia}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {usuarios.length === 0 && (
                  <p className={`text-center py-8 text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>No hay usuarios registrados</p>
                )}
              </div>
            </div>
          )}

          {tab === 'crear' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className={`p-5 md:p-6 rounded-2xl shadow-sm max-w-lg ${dark ? 'bg-slate-800' : 'bg-white'}`}>
              <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-800'}`}>
                <UserPlus size={20} className="text-orange-500" /> Crear Nuevo Usuario
              </h2>
              <form onSubmit={handleCrearUsuario} className="space-y-3">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Nombre</label>
                  <input type="text" value={newUser.nombre} onChange={e => setNewUser(prev => ({ ...prev, nombre: e.target.value }))} placeholder="Nombre completo" required className={inputClass} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Correo electrónico</label>
                  <input type="email" value={newUser.email} onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))} placeholder="correo@ejemplo.com" required className={inputClass} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Contraseña</label>
                  <input type="text" value={newUser.password} onChange={e => setNewUser(prev => ({ ...prev, password: e.target.value }))} placeholder="Contraseña del usuario" required className={inputClass} />
                </div>
                <button type="submit" disabled={creando}
                  className="w-full btn-primary py-2.5 rounded-xl text-sm font-medium disabled:opacity-50">
                  {creando ? 'Creando...' : 'Crear usuario'}
                </button>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
