import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Trash2, Upload, Clock, AlertCircle, ArrowLeft, Globe, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { crearReceta, actualizarPuntos } from '../services/firebaseService'

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

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 800
          const MAX_HEIGHT = 800
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.7))
        }
      }
    })
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
        imagenURL = await compressImage(imagen)
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
        autorEmail: user.email,
        isPublic,
      })

      await actualizarPuntos(user.uid, 10)
      navigate('/')
    } catch (err) {
      setError(err.message)
      console.error(err)
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
              <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Ingredientes *</label>
              <div className="space-y-2">
                {ingredientes.map((ing, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={ing} onChange={e => cambiarIngrediente(i, e.target.value)} placeholder="Ej: 2 huevos" className={inputClass} />
                    {ingredientes.length > 1 && (
                      <button type="button" onClick={() => eliminarIngrediente(i)} className="btn-icon text-red-400">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={agregarIngrediente} className="flex items-center gap-1 text-orange-500 text-sm">
                  <Plus size={16} /> Agregar ingrediente
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Pasos *</label>
              <div className="space-y-2">
                {pasos.map((paso, i) => (
                  <div key={i} className="flex gap-2">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${dark ? 'bg-slate-700' : 'bg-orange-50'} ${dark ? 'text-slate-300' : 'text-orange-500'}`}>
                      {i + 1}
                    </span>
                    <textarea value={paso} onChange={e => cambiarPaso(i, e.target.value)} placeholder="Describe este paso..." rows={2} className={`${inputClass} resize-none flex-1`} />
                    {pasos.length > 1 && (
                      <button type="button" onClick={() => eliminarPaso(i)} className="btn-icon text-red-400 flex-shrink-0">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={agregarPaso} className="flex items-center gap-1 text-orange-500 text-sm">
                  <Plus size={16} /> Agregar paso
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Imagen</label>
              <label className={`flex flex-col items-center justify-center px-6 py-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${dark ? 'border-slate-600 hover:border-orange-500 hover:bg-slate-700/50' : 'border-slate-300 hover:border-orange-500 hover:bg-orange-50'}`}>
                <Upload size={24} className="text-slate-400 mb-2" />
                <span className="text-sm text-slate-400">Selecciona una imagen o arrastra aquí</span>
                <input type="file" onChange={handleImagen} accept="image/*" className="hidden" />
              </label>
              {imagenPreview && <img src={imagenPreview} alt="" className="mt-3 max-h-48 rounded-xl object-cover" />}
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-xl ${dark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <button type="button" onClick={() => setIsPublic(!isPublic)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPublic ? 'bg-orange-500' : dark ? 'bg-slate-600' : 'bg-slate-300'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <div className="flex items-center gap-1 flex-1">
                {isPublic ? <Globe size={16} className="text-orange-500" /> : <Lock size={16} className="text-slate-400" />}
                <span className={`text-sm ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {isPublic ? 'Receta pública' : 'Receta privada'}
                </span>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3 rounded-xl font-medium active:scale-[0.98] disabled:opacity-50">
              {loading ? 'Creando...' : 'Crear Receta'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

