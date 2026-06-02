import { ChefHat } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

export default function Footer() {
  const { dark } = useTheme()
  const { user } = useAuth()
  return (
    <footer className={`mt-auto py-6 hidden md:block ${dark ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-gray-50 border-slate-200 text-slate-500'} border-t`}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ChefHat size={20} className="text-orange-500" />
          <span className={`font-semibold ${dark ? 'text-white' : 'text-slate-800'}`}>RecipeLab</span>
        </div>
        <p className="text-sm">Libro Digital de Recetas &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
