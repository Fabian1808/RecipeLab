import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Bookmark, Share2, Clock, ChefHat, MessageCircle, Send, ArrowLeft, AlertCircle, Trash2, Globe, Lock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { obtenerReceta, darLike, toggleFavorito, agregarComentario, obtenerComentarios, eliminarReceta } from '../services/firebase'

export default function RecipeDetail() {
  const { id } = useParams()
  const { dark } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [receta, setReceta] = useState(null)
  const [comentarios, setComentarios] = useState([])
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const data = await obtenerReceta(id)
    setReceta(data)
    const coms = await obtenerComentarios(id)
    setComentarios(coms)
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const handleLike = async () => {
    if (!user) return
    await darLike(id, user.uid)
    load()
  }

  const handleFav = async () => {
    if (!user) return
    await toggleFavorito(id, user.uid)
    load()
  }

  const handleComentario = async (e) => {
    e.preventDefault()
    if (!user || !nuevoComentario.trim()) return
    await agregarComentario({
      recetaId: id,
      usuarioId: user.uid,
      usuarioNombre: user.displayName || user.email?.split('@')[0],
      comentario: nuevoComentario.trim(),
    })
    setNuevoComentario('')
    load()
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: receta.titulo, url: window.location.href })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('Enlace copiado al portapapeles')
      }
    } catch {}
  }

  const handleDelete = async () => {
    if (confirm('¿Eliminar esta receta definitivamente?')) {
      await eliminarReceta(id)
      navigate('/')
    }
  }

  const esAutor = user && receta?.autorId === user.uid

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full" />
    </div>
  )
  if (!receta) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
      <AlertCircle size={48} className="mb-4" />
      <p className="text-lg">Receta no encontrada</p>
    </div>
  )

  const leGusta = user && receta.likes?.includes(user.uid)
  const esFavorito = user && receta.favoritos?.includes(user.uid)

  return (
    <div className={`min-h-screen pb-20 md:pb-0 ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-0 md:px-4 py-0 md:py-8">
        <div className="hidden md:block px-4 mb-4">
          <Link to="/" className={`inline-flex items-center gap-1 text-sm hover:text-orange-500 ${dark ? 'text-slate-300' : 'text-slate-500'}`}>
            <ArrowLeft size={16} /> Volver
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={`md:rounded-2xl overflow-hidden md:shadow-lg ${dark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="relative">
              {receta.imagen ? (
                <img src={receta.imagen} alt={receta.titulo} className="w-full h-56 sm:h-72 md:h-96 object-cover" />
              ) : (
                <div className={`w-full h-40 sm:h-56 md:h-96 flex items-center justify-center text-6xl md:text-8xl ${dark ? 'bg-slate-700' : 'bg-orange-50'}`}>
                  🍽️
                </div>
              )}
              <Link to="/" className={`absolute top-4 left-4 md:hidden w-9 h-9 rounded-full ${dark ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-sm flex items-center justify-center shadow-lg`}>
                <ArrowLeft size={20} className={dark ? 'text-white' : 'text-slate-800'} />
              </Link>
            </div>

            <div className="p-4 md:p-8">
              <div className="mb-4">
                <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${dark ? 'text-white' : 'text-slate-800'}`}>{receta.titulo}</h1>
                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-slate-400">
                  <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-full">{receta.categoria}</span>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${receta.isPublic !== false ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
                    {receta.isPublic !== false ? <Globe size={12} /> : <Lock size={12} />}
                    {receta.isPublic !== false ? 'Pública' : 'Privada'}
                  </span>
                  <span className="flex items-center gap-1"><Clock size={13} />{receta.tiempoPreparacion}</span>
                  <span className="flex items-center gap-1"><ChefHat size={13} />{receta.dificultad}</span>
                  <span>Por {receta.autorNombre}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-4 mb-5">
                <button onClick={handleLike}
                  className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl border transition-all text-sm ${leGusta ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500' : dark ? 'border-slate-600 text-slate-300 hover:border-red-300' : 'border-slate-200 text-slate-500 hover:border-red-300'}`}>
                  <Heart size={18} className={leGusta ? 'fill-red-500' : ''} /> <span className="hidden sm:inline">{receta.likes?.length || 0}</span>
                </button>
                <button onClick={handleFav}
                  className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl border transition-all text-sm ${esFavorito ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-500' : dark ? 'border-slate-600 text-slate-300 hover:border-yellow-300' : 'border-slate-200 text-slate-500 hover:border-yellow-300'}`}>
                  <Bookmark size={18} className={esFavorito ? 'fill-yellow-500' : ''} />
                </button>
                <button onClick={handleShare}
                  className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl border transition-all text-sm ${dark ? 'border-slate-600 text-slate-300 hover:border-blue-300' : 'border-slate-200 text-slate-500 hover:border-blue-300'}`}>
                  <Share2 size={18} />
                </button>
                {esAutor && (
                  <button onClick={handleDelete}
                    className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl border border-red-200 dark:border-red-800 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <p className={`mb-6 text-sm md:text-base leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{receta.descripcion}</p>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                <div>
                  <h2 className={`text-lg md:text-xl font-semibold mb-3 md:mb-4 ${dark ? 'text-white' : 'text-slate-800'}`}>Ingredientes</h2>
                  <ul className={`space-y-2 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {receta.ingredientes?.map((ing, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm md:text-base">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></span>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className={`text-lg md:text-xl font-semibold mb-3 md:mb-4 ${dark ? 'text-white' : 'text-slate-800'}`}>Procedimiento</h2>
                  <ol className={`space-y-3 md:space-y-4 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {(receta.procedure || receta.pasos)?.map((paso, i) => (
                      <li key={i} className="flex gap-3 text-sm md:text-base">
                        <span className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs md:text-sm font-medium">{i + 1}</span>
                        <span className="pt-0.5 md:pt-1">{paso}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className={`border-t pt-5 md:pt-6 ${dark ? 'border-slate-700' : 'border-slate-200'}`}>
                <h2 className={`text-lg md:text-xl font-semibold mb-4 flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-800'}`}>
                  <MessageCircle size={20} /> Comentarios ({comentarios.length})
                </h2>

                {user ? (
                  <form onSubmit={handleComentario} className="flex gap-2 mb-5">
                    <input type="text" value={nuevoComentario} onChange={e => setNuevoComentario(e.target.value)} placeholder="Escribe un comentario..."
                      className={`flex-1 px-4 py-2.5 rounded-xl border text-sm ${dark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-orange-500`} />
                    <button type="submit" className="btn-primary px-4 rounded-xl"><Send size={18} /></button>
                  </form>
                ) : (
                  <p className={`text-sm mb-5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Link to="/login" className="text-orange-500 hover:underline font-medium">Inicia sesión</Link> para comentar
                  </p>
                )}

                <div className="space-y-3 md:space-y-4">
                  {comentarios.map(c => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`p-3 md:p-4 rounded-xl ${dark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium text-sm ${dark ? 'text-white' : 'text-slate-800'}`}>{c.usuarioNombre}</span>
                        <span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {c.fecha ? (typeof c.fecha === 'number' ? new Date(c.fecha).toLocaleDateString() : c.fecha?.toDate?.()?.toLocaleDateString() || '') : ''}
                        </span>
                      </div>
                      <p className={`text-sm ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{c.comentario}</p>
                    </motion.div>
                  ))}
                  {comentarios.length === 0 && (
                    <p className={`text-sm text-center py-6 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>No hay comentarios aún. ¡Sé el primero!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
