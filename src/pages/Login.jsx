import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChefHat, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

export default function Login() {
  const { dark } = useTheme()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = `w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 ${
    dark
      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
      : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
  }`

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${dark ? 'bg-slate-900' : 'bg-gradient-to-br from-orange-50 via-amber-50 to-white'}`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`w-full max-w-md p-8 rounded-2xl shadow-xl ${dark ? 'bg-slate-800' : 'bg-white'}`}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className={`inline-flex p-4 rounded-2xl mb-4 ${dark ? 'bg-orange-500/20' : 'bg-orange-100'}`}
          >
            <ChefHat size={40} className="text-orange-500" />
          </motion.div>
          <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>
            RecipeLab
          </h1>
          <p className={`text-sm mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Ingresa con tu cuenta
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mb-5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
          >
            <span className="font-medium">⚠</span> {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              id="email"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              id="password"
              type={showPw ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              tabIndex={-1}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            id="btn-login"
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 rounded-xl font-semibold text-sm active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Ingresando...
              </span>
            ) : 'Ingresar'}
          </button>
        </form>

        <p className={`text-center text-xs mt-6 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
          Acceso privado · Solo para uso personal
        </p>
      </motion.div>
    </div>
  )
}
