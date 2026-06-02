/**
 * Utilidades para el proyecto RecipeLab
 */

/**
 * Formatea una fecha a formato legible
 * @param {Date|number} fecha - Fecha a formatear
 * @returns {string}
 */
export function formatearFecha(fecha) {
  if (!fecha) return ''
  const date = typeof fecha === 'number' ? new Date(fecha) : fecha
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

/**
 * Calcula el tiempo transcurrido
 * @param {Date|number} fecha - Fecha a comparar
 * @returns {string}
 */
export function tiempoTranscurrido(fecha) {
  if (!fecha) return ''
  const ahora = new Date()
  const tiempo = typeof fecha === 'number' ? new Date(fecha) : fecha
  const diferencia = ahora - tiempo
  
  const segundos = Math.floor(diferencia / 1000)
  const minutos = Math.floor(segundos / 60)
  const horas = Math.floor(minutos / 60)
  const días = Math.floor(horas / 24)

  if (días > 0) return `${días}d`
  if (horas > 0) return `${horas}h`
  if (minutos > 0) return `${minutos}m`
  return 'ahora'
}

/**
 * Trunca texto con elipsis
 * @param {string} texto - Texto a truncar
 * @param {number} longitud - Longitud máxima
 * @returns {string}
 */
export function truncarTexto(texto, longitud = 50) {
  if (!texto || texto.length <= longitud) return texto
  return texto.substring(0, longitud) + '...'
}

/**
 * Agrupa elementos de un array por una propiedad
 * @param {array} array - Array a agrupar
 * @param {string} clave - Clave para agrupar
 * @returns {object}
 */
export function agrupar(array, clave) {
  return array.reduce((acc, item) => {
    const valor = item[clave]
    if (!acc[valor]) acc[valor] = []
    acc[valor].push(item)
    return acc
  }, {})
}

/**
 * Ordena un array de objetos
 * @param {array} array - Array a ordenar
 * @param {string} clave - Clave para ordenar
 * @param {string} orden - 'asc' o 'desc'
 * @returns {array}
 */
export function ordenar(array, clave, orden = 'asc') {
  return [...array].sort((a, b) => {
    const valorA = a[clave]
    const valorB = b[clave]

    if (valorA < valorB) return orden === 'asc' ? -1 : 1
    if (valorA > valorB) return orden === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Genera un ID único
 * @returns {string}
 */
export function generarId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Verifica si un objeto está vacío
 * @param {object} obj - Objeto a verificar
 * @returns {boolean}
 */
export function estaVacio(obj) {
  return Object.keys(obj).length === 0
}

/**
 * Clona profundamente un objeto
 * @param {*} obj - Objeto a clonar
 * @returns {*}
 */
export function clonarProfundo(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Debounce para funciones
 * @param {Function} func - Función a debounce
 * @param {number} espera - Tiempo de espera en ms
 * @returns {Function}
 */
export function debounce(func, espera) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), espera)
  }
}

/**
 * Throttle para funciones
 * @param {Function} func - Función a throttle
 * @param {number} limite - Tiempo limite en ms
 * @returns {Function}
 */
export function throttle(func, limite) {
  let enEspera = false
  return function (...args) {
    if (!enEspera) {
      func(...args)
      enEspera = true
      setTimeout(() => {
        enEspera = false
      }, limite)
    }
  }
}
