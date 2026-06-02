import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Medal, Award, Trophy, Star, Crown } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { obtenerRanking } from '../services/firebase'

const PODIO_BG = [
  'from-yellow-400/20 to-yellow-500/5 border-yellow-400',
  'from-gray-400/20 to-gray-500/5 border-gray-400',
  'from-amber-600/20 to-amber-700/5 border-amber-600',
]

export default function Ranking() {
  const { dark } = useTheme()
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const data = await obtenerRanking()
      setRanking(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className={`min-h-screen pb-20 md:pb-8 ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto px-4 py-4 md:py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-6 md:mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
              <Trophy size={40} className="md:hidden mx-auto text-yellow-400 mb-2" />
              <Trophy size={56} className="hidden md:block mx-auto text-yellow-400 mb-3" />
            </motion.div>
            <h1 className={`text-2xl md:text-3xl font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>Ranking de Creadores</h1>
            <p className={`text-sm mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Los mejores chefs de RecipeLab</p>
          </div>

          <div className="space-y-2 md:space-y-3">
            {ranking.map((usr, i) => (
              <motion.div key={usr.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={`relative flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all ${dark ? 'bg-slate-800' : 'bg-white shadow-sm'} ${i < 3 ? `bg-gradient-to-r ${PODIO_BG[i]} border` : ''}`}>
                <div className="flex-shrink-0 w-8 md:w-10 text-center">
                  {i === 0 ? <Crown size={22} className="md:hidden text-yellow-400 mx-auto" />
                    : i === 1 ? <Medal size={20} className="md:hidden text-gray-400 mx-auto" />
                    : i === 2 ? <Medal size={20} className="md:hidden text-amber-600 mx-auto" />
                    : <span className={`text-sm font-bold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{i + 1}</span>}
                  <span className="hidden md:inline">
                    {i === 0 ? <Crown size={24} className="text-yellow-400 mx-auto" />
                      : i === 1 ? <Medal size={24} className="text-gray-400 mx-auto" />
                      : i === 2 ? <Medal size={24} className="text-amber-600 mx-auto" />
                      : <span className={`font-bold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{i + 1}</span>}
                  </span>
                </div>

                <div className="flex-shrink-0">
                  {usr.foto ? (
                    <img src={usr.foto} alt="" className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <Star size={16} className="text-orange-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm md:text-base truncate ${dark ? 'text-white' : 'text-slate-800'}`}>{usr.nombre || 'Usuario'}</p>
                  <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Award size={12} className="inline mr-1 text-orange-400" />
                    {usr.insignia || 'Cocinero Novato'}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-orange-500 text-base md:text-lg">{usr.puntos || 0}</p>
                  <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>pts</p>
                </div>
              </motion.div>
            ))}
            {ranking.length === 0 && (
              <div className={`text-center py-12 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Trophy size={40} className="mx-auto mb-3 opacity-50" />
                <p>Aún no hay participantes</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
