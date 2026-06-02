import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { dark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="btn-icon"
      aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
