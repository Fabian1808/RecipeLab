/**
 * Manejo centralizado de errores para RecipeLab
 * Mapea errores de Firebase a mensajes amigables
 */

const ERROR_MESSAGES = {
  // Errores de autenticación
  'auth/invalid-email': 'El correo electrónico no es válido.',
  'auth/user-disabled': 'Este usuario ha sido deshabilitado.',
  'auth/user-not-found': 'No existe usuario con este correo.',
  'auth/wrong-password': 'Contraseña incorrecta.',
  'auth/email-already-in-use': 'Este correo ya está registrado.',
  'auth/weak-password': 'La contraseña es muy débil. Debe tener al menos 8 caracteres.',
  'auth/operation-not-allowed': 'Operación no permitida. Contacta al administrador.',
  'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta de nuevo más tarde.',

  // Errores de Firestore
  'permission-denied': 'No tienes permiso para realizar esta acción.',
  'not-found': 'El documento no fue encontrado.',
  'already-exists': 'Este recurso ya existe.',
  'resource-exhausted': 'Se alcanzó el límite de la base de datos.',
  'failed-precondition': 'No se cumplen las condiciones previas.',
  'unavailable': 'El servicio no está disponible. Intenta de nuevo más tarde.',

  // Errores de Storage
  'storage/object-not-found': 'El archivo no fue encontrado.',
  'storage/bucket-not-found': 'El servicio de almacenamiento no está disponible.',
  'storage/unauthenticated': 'Debes estar autenticado para subir archivos.',
  'storage/unauthorized': 'No tienes permiso para subir archivos.',
  'storage/retry-limit-exceeded': 'Se alcanzó el límite de reintentos. Intenta de nuevo.',

  // Errores de red
  'network-error': 'Error de conexión. Verifica tu conexión a Internet.',
  'timeout': 'La solicitud tardó demasiado. Intenta de nuevo.',
}

/**
 * Obtiene un mensaje de error amigable
 * @param {Error|string} error - Error a procesar
 * @returns {string}
 */
export function obtenerMensajeError(error) {
  if (!error) return 'Ocurrió un error desconocido.'

  // Si es un objeto de error de Firebase
  if (error.code) {
    return ERROR_MESSAGES[error.code] || error.message || 'Ocurrió un error. Intenta de nuevo.'
  }

  // Si es un string
  if (typeof error === 'string') {
    return ERROR_MESSAGES[error] || error
  }

  // Si es un objeto con mensaje
  if (error.message) {
    return ERROR_MESSAGES[error.message] || error.message
  }

  return 'Ocurrió un error desconocido. Intenta de nuevo más tarde.'
}

/**
 * Registra un error en consola (solo en desarrollo)
 * @param {string} contexto - Contexto donde ocurrió el error
 * @param {Error} error - Error a registrar
 */
export function registrarError(contexto, error) {
  if (import.meta.env.MODE === 'development') {
    console.error(`[${contexto}]`, error)
  }
  // En producción, se podría enviar a un servicio de logging
  logearEnServicio(contexto, error)
}

/**
 * Envía el error a un servicio de logging externo
 * @param {string} contexto - Contexto del error
 * @param {Error} error - Error a registrar
 */
function logearEnServicio(contexto, error) {
  // TODO: Integrar con servicio de logging (ej: Sentry, LogRocket, etc.)
  // Ejemplo:
  // if (window.Sentry) {
  //   window.Sentry.captureException(error, { tags: { contexto } })
  // }
}

/**
 * Clase personalizada para errores de la aplicación
 */
export class AppError extends Error {
  constructor(mensaje, codigo = 'unknown', contexto = '') {
    super(mensaje)
    this.nombre = 'AppError'
    this.codigo = codigo
    this.contexto = contexto
    this.timestamp = new Date()
  }

  toString() {
    return `${this.nombre} [${this.codigo}]: ${this.message}`
  }
}

/**
 * Maneja errores comunes de forma consistente
 * @param {Error} error - Error a manejar
 * @param {string} contexto - Contexto de donde vino el error
 * @returns {object} { mensaje: string, error: Error }
 */
export function manejarError(error, contexto = 'Operación') {
  registrarError(contexto, error)

  const mensaje = obtenerMensajeError(error)
  console.warn(`${contexto}: ${mensaje}`)

  return {
    mensaje,
    error,
    contexto,
  }
}
