import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, ChefHat, TrendingUp, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { obtenerRecetas } from '../services/firebase'
import RecipeCard from '../components/RecipeCard'

const CATEGORIAS = ['Postres', 'Bebidas', 'Comida rápida', 'Comida saludable', 'Cocina internacional']

export default function Home() {
  const { dark } = useTheme()
  const { user } = useAuth()
  const [recetas, setRecetas] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [loading, setLoading] = useState(true)
  const carruselRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      const data = await obtenerRecetas()
      setRecetas(data)
      setLoading(false)
    }
    load()
  }, [])

  const filtradas = recetas.filter(r => {
    const matchBusqueda = !busqueda || r.titulo?.toLowerCase().includes(busqueda.toLowerCase()) || r.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
    const matchCategoria = !categoria || r.categoria === categoria
    const matchVisibilidad = r.isPublic !== false || (user && r.autorId === user.uid)
    return matchBusqueda && matchCategoria && matchVisibilidad
  })

  const scrollCat = (dir) => {
    if (carruselRef.current) {
      carruselRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <section className={`relative overflow-hidden ${dark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900' : 'bg-gradient-to-br from-orange-50 via-amber-50 to-white'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(249,115,22,0.08),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-4 md:mb-6"
            >
              <div className={`p-3 md:p-4 rounded-full ${dark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                <ChefHat size={36} className="md:hidden text-orange-500" />
                <ChefHat size={48} className="hidden md:block text-orange-500" />
              </div>
            </motion.div>
            <h1 className={`text-3xl sm:text-4xl md:text-6xl font-bold mb-3 md:mb-4 leading-tight ${dark ? 'text-white' : 'text-slate-800'}`}>
              Tus Recetas, <br className="sm:hidden" /><span className="text-orange-500">Tu Estilo</span>
            </h1>
            <p className={`text-base md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto px-2 ${dark ? 'text-slate-300' : 'text-slate-500'}`}>
              Crea, comparte y descubre recetas increíbles. Tu libro de cocina digital.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-xl mx-auto px-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar recetas..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 md:py-3 rounded-xl border text-sm md:text-base ${
                    dark ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
              </div>
              {!user && (
                <a href="/login" className="btn-primary text-center py-2.5 md:py-3 px-6 rounded-xl text-sm md:text-base">
                  Comenzar ahora
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className={`py-4 md:py-6 ${dark ? 'bg-slate-800/50' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="hidden md:flex flex-wrap gap-2 justify-center">
            <button onClick={() => setCategoria('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!categoria ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : dark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              Todas
            </button>
            {CATEGORIAS.map(cat => (
              <button key={cat} onClick={() => setCategoria(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${categoria === cat ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : dark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="md:hidden relative">
            <button onClick={() => scrollCat(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 shadow flex items-center justify-center backdrop-blur-sm">
              <ChevronLeft size={16} />
            </button>
            <div ref={carruselRef} className="flex gap-2 overflow-x-auto snap-x py-2 px-6">
              <button onClick={() => setCategoria('')}
                className={`snap-start flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${!categoria ? 'bg-orange-500 text-white shadow-md' : dark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                Todas
              </button>
              {CATEGORIAS.map(cat => (
                <button key={cat} onClick={() => setCategoria(cat)}
                  className={`snap-start flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${categoria === cat ? 'bg-orange-500 text-white shadow-md' : dark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <button onClick={() => scrollCat(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 shadow flex items-center justify-center backdrop-blur-sm">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className={`py-6 md:py-12 ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 md:gap-3 mb-4 md:mb-8">
            <TrendingUp className="text-orange-500" size={20} />
            <h2 className={`text-lg md:text-2xl font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>
              {busqueda || categoria ? 'Resultados' : 'Recetas Destacadas'}
            </h2>
            <Sparkles className="text-yellow-400" size={16} />
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-10 h-10 md:w-12 md:h-12 border-2 border-orange-500 border-t-transparent rounded-full" />
            </div>
          ) : filtradas.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-center py-12 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
              <ChefHat size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No se encontraron recetas</p>
              <p className="text-sm mt-2">¡Sé el primero en crear una!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filtradas.map((r, i) => (
                <RecipeCard key={r.id} receta={r} index={i} onDelete={(id) => setRecetas(prev => prev.filter(p => p.id !== id))} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
