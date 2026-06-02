import { Link } from 'react-router-dom'
import { Clock, Heart, ChefHat, Globe, Lock, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { eliminarReceta } from '../services/firebase'

const CATEGORIAS = {
  postres: '🍰', bebidas: '🥤', 'comida rápida': '🍔',
  'comida saludable': '🥗', 'cocina internacional': '🌍',
}

export default function RecipeCard({ receta, index = 0, onDelete }) {
  const { dark } = useTheme()
  const { user } = useAuth()
  const emoji = CATEGORIAS[receta.categoria?.toLowerCase()] || '🍽️'
  const esAutor = user && receta.autorId === user.uid

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('¿Eliminar esta receta?')) {
      await eliminarReceta(receta.id)
      if (onDelete) onDelete(receta.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/receta/${receta.id}`} className="block relative">
        <div className={`card group ${dark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:shadow-xl'}`}>
          <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden rounded-t-xl">
            {receta.imagen ? (
              <img src={receta.imagen} alt={receta.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className={`w-full h-full flex items-center justify-center text-5xl sm:text-6xl ${dark ? 'bg-slate-700' : 'bg-orange-50'}`}>
                {emoji}
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-1.5">
              <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shadow-sm ${receta.isPublic !== false ? 'bg-white/90 dark:bg-slate-800/90 text-green-600' : 'bg-white/90 dark:bg-slate-800/90 text-purple-600'}`}>
                {receta.isPublic !== false ? <Globe size={11} /> : <Lock size={11} />}
              </span>
              <span className="bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                {receta.categoria}
              </span>
            </div>
          </div>
          <div className="p-3 sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-semibold text-base sm:text-lg group-hover:text-orange-500 transition-colors flex-1 min-w-0 ${dark ? 'text-white' : 'text-slate-800'}`}>
                {receta.titulo}
              </h3>
              {esAutor && (
                <button onClick={handleDelete}
                  className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0 -mt-0.5">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
            <p className={`text-xs sm:text-sm mb-2.5 line-clamp-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
              {receta.descripcion}
            </p>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-1 text-slate-400">
                <Clock size={13} />
                <span>{receta.tiempoPreparacion}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Heart size={13} className={receta.likes?.length ? 'text-red-500' : ''} />
                <span>{receta.likes?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <ChefHat size={13} />
                <span>{receta.dificultad}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
