import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Trash2, Upload, Clock, AlertCircle, ArrowLeft, Globe, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { crearReceta, subirImagen, actualizarPuntos } from '../services/firebase'

const CATEGORIAS = ['Postres', 'Bebidas', 'Comida rápida', 'Comida saludable', 'Cocina internacional']
const DIFICULTADES = ['Fácil', 'Media', 'Difícil']

export default function CreateRecipe() {
  const { dark } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState(CATEGORIAS[0])
  const [descripcion, setDescripcion] = useState('')
  const [tiempoPreparacion, setTiempoPreparacion] = useState('')
  const [dificultad, setDificultad] = useState(DIFICULTADES[0])
  const [ingredientes, setIngredientes] = useState([''])
  const [pasos, setPasos] = useState([''])
  const [imagen, setImagen] = useState(null)
  const [imagenPreview, setImagenPreview] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  const handleImagen = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagen(file)
      setImagenPreview(URL.createObjectURL(file))
    }
  }

  const agregarIngrediente = () => setIngredientes([...ingredientes, ''])
  const eliminarIngrediente = (i) => setIngredientes(ingredientes.filter((_, idx) => idx !== i))
  const cambiarIngrediente = (i, val) => {
    const nuevo = [...ingredientes]
    nuevo[i] = val
    setIngredientes(nuevo)
  }

  const agregarPaso = () => setPasos([...pasos, ''])
  const eliminarPaso = (i) => setPasos(pasos.filter((_, idx) => idx !== i))
  const cambiarPaso = (i, val) => {
    const nuevo = [...pasos]
    nuevo[i] = val
    setPasos(nuevo)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!titulo || !descripcion || !tiempoPreparacion) {
      setError('Completa los campos obligatorios')
      return
    }
    if (ingredientes.filter(i => i.trim()).length === 0) {
      setError('Agrega al menos un ingrediente')
      return
    }
    if (pasos.filter(p => p.trim()).length === 0) {
      setError('Agrega al menos un paso')
      return
    }

    setLoading(true)
    try {
      let imagenURL = ''
      if (imagen) {
        imagenURL = await subirImagen(imagen, `recetas/${user.uid}_${Date.now()}`)
      }

      await crearReceta({
        titulo,
        categoria,
        descripcion,
        ingredientes: ingredientes.filter(i => i.trim()),
        pasos: pasos.filter(p => p.trim()),
        tiempoPreparacion,
        dificultad,
        imagen: imagenURL,
        autorId: user.uid,
        autorNombre: user.displayName || user.email?.split('@')[0],
        isPublic,
      })

      await actualizarPuntos(user.uid, 10)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm md:text-base ${dark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all`

  return (
    <div className={`min-h-screen pb-20 md:pb-8 ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto px-4 py-4 md:py-8">
        <Link to="/" className={`inline-flex items-center gap-1 mb-4 text-sm hover:text-orange-500 md:hidden ${dark ? 'text-slate-300' : 'text-slate-500'}`}>
          <ArrowLeft size={16} /> Volver
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${dark ? 'text-white' : 'text-slate-800'}`}>Nueva Receta</h1>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 md:p-4 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className={`space-y-5 p-4 md:p-6 rounded-2xl shadow-sm ${dark ? 'bg-slate-800' : 'bg-white'}`}>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Título *</label>
              <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ej: Tortilla de patatas" required className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Categoría</label>
                <select value={categoria} onChange={e => setCategoria(e.target.value)} className={inputClass}>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Dificultad</label>
                <select value={dificultad} onChange={e => setDificultad(e.target.value)} className={inputClass}>
                  {DIFICULTADES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Descripción *</label>
              <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={3} placeholder="Describe tu receta..." required
                className={`${inputClass} resize-none`} />
            </div>

            <div className="flex items-center gap-2">
              <Clock size={18} className="text-slate-400 flex-shrink-0" />
              <input type="text" value={tiempoPreparacion} onChange={e => setTiempoPreparacion(e.target.value)} placeholder="Tiempo (ej: 30 min)" required className={inputClass} />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Visibilidad</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsPublic(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${isPublic ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : dark ? 'border-slate-600 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <Globe size={18} /> Pública
                </button>
                <button type="button" onClick={() => setIsPublic(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${!isPublic ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : dark ? 'border-slate-600 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <Lock size={18} /> Privada
                </button>
              </div>
              <p className={`text-xs mt-1.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                {isPublic ? 'Visible para todos los usuarios en la página principal' : 'Solo tú puedes ver esta receta'}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`text-sm font-medium ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Ingredientes</label>
                <button type="button" onClick={agregarIngrediente} className="text-orange-500 hover:text-orange-600 text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                  <Plus size={16} /> Agregar
                </button>
              </div>
              {ingredientes.map((ing, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input type="text" value={ing} onChange={e => cambiarIngrediente(i, e.target.value)} placeholder={`Ingrediente ${i + 1}`} className={inputClass} />
                  {ingredientes.length > 1 && (
                    <button type="button" onClick={() => eliminarIngrediente(i)} className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex-shrink-0">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`text-sm font-medium ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Procedimiento</label>
                <button type="button" onClick={agregarPaso} className="text-orange-500 hover:text-orange-600 text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                  <Plus size={16} /> Agregar paso
                </button>
              </div>
              {pasos.map((paso, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">{i + 1}</span>
                    <input type="text" value={paso} onChange={e => cambiarPaso(i, e.target.value)} placeholder={`Paso ${i + 1}`} className={`${inputClass} pl-10`} />
                  </div>
                  {pasos.length > 1 && (
                    <button type="button" onClick={() => eliminarPaso(i)} className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex-shrink-0">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Foto del resultado</label>
              <label className={`flex flex-col items-center justify-center h-32 md:h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${dark ? 'border-slate-600 hover:border-orange-500 bg-slate-700 hover:bg-slate-600' : 'border-slate-300 hover:border-orange-500 bg-gray-50 hover:bg-orange-50'}`}>
                {imagenPreview ? (
                  <img src={imagenPreview} alt="Preview" className="h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Upload size={28} />
                    <span className="text-xs md:text-sm">Toca para subir una imagen</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImagen} className="hidden" />
              </label>
            </div>

            <div className="md:hidden sticky-form-btn">
              <button type="submit" disabled={loading}
                className="w-full btn-primary py-3.5 rounded-xl font-medium disabled:opacity-50 shadow-lg shadow-orange-500/20">
                {loading ? 'Publicando...' : 'Publicar receta'}
              </button>
            </div>

            <button type="submit" disabled={loading} className="hidden md:block w-full btn-primary py-3 rounded-xl font-medium disabled:opacity-50">
              {loading ? 'Publicando...' : 'Publicar receta'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
