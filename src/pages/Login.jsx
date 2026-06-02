import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChefHat, Mail, Lock, LogIn, FlaskConical, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

export default function Login() {
  const { dark } = useTheme()
  const { login, loginWithGoogle, demo } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGoogle = async () => {
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`w-full max-w-md p-6 md:p-8 rounded-2xl shadow-lg ${dark ? 'bg-slate-800' : 'bg-white'}`}>
        {demo && (
          <div className="flex items-center justify-center gap-2 mb-4 py-2.5 px-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-600 dark:text-amber-400 text-sm">
            <FlaskConical size={16} />
            Modo demo - ingresa con cualquier correo
          </div>
        )}

        <div className="text-center mb-6 md:mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <ChefHat size={40} className="mx-auto text-orange-500 mb-2" />
          </motion.div>
          <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>Iniciar Sesión</h1>
          <p className={`text-sm mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Bienvenido de vuelta a RecipeLab</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-red-500 text-sm mb-4 text-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            {error}
          </motion.div>
        )}

        <button onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border rounded-xl mb-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-[0.98]">
          <LogIn size={20} />
          <span className={`text-sm font-medium ${dark ? 'text-white' : 'text-slate-700'}`}>
            {demo ? 'Ingresar como invitado' : 'Continuar con Google'}
          </span>
        </button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center"><div className={`w-full border-t ${dark ? 'border-slate-600' : 'border-slate-200'}`}></div></div>
          <div className="relative flex justify-center"><span className={`px-3 text-xs ${dark ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-400'}`}>o</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm ${dark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-orange-500`} />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type={showPw ? 'text' : 'password'} placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
              className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm ${dark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-orange-500`} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button type="submit" className="w-full btn-primary py-3 rounded-xl font-medium text-sm active:scale-[0.98]">
            Ingresar
          </button>
        </form>

        <p className={`text-center text-sm mt-5 md:mt-6 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          ¿No tienes cuenta? <Link to="/register" className="text-orange-500 hover:underline font-medium">Regístrate</Link>
        </p>
      </motion.div>
    </div>
  )
}
