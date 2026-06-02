/**
 * Validación de datos para RecipeLab
 * Proporciona funciones de validación reutilizables y seguras
 */

export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  nombre: /^[a-záéíóúñ\s\-]{2,50}$/i,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
export function validarEmail(email) {
  if (!email || typeof email !== 'string') return false
  return VALIDATION_RULES.email.test(email.toLowerCase())
}

/**
 * Valida una contraseña
 * @param {string} password - Contraseña a validar
 * @returns {object} { valida: boolean, errores: string[] }
 */
export function validarPassword(password) {
  const errores = []
  if (!password || password.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres')
  }
  if (!/[a-z]/.test(password)) {
    errores.push('La contraseña debe contener minúsculas')
  }
  if (!/[A-Z]/.test(password)) {
    errores.push('La contraseña debe contener mayúsculas')
  }
  if (!/\d/.test(password)) {
    errores.push('La contraseña debe contener números')
  }
  return { valida: errores.length === 0, errores }
}

/**
 * Valida un nombre de usuario
 * @param {string} nombre - Nombre a validar
 * @returns {boolean}
 */
export function validarNombre(nombre) {
  if (!nombre || typeof nombre !== 'string') return false
  return nombre.trim().length >= 2 && nombre.trim().length <= 50
}

/**
 * Valida datos de receta
 * @param {object} receta - Datos de la receta
 * @returns {object} { valida: boolean, errores: string[] }
 */
export function validarReceta(receta) {
  const errores = []

  if (!receta.titulo || receta.titulo.trim().length < 3) {
    errores.push('El título debe tener al menos 3 caracteres')
  }
  if (receta.titulo && receta.titulo.length > 200) {
    errores.push('El título no puede exceder 200 caracteres')
  }

  if (!receta.descripcion || receta.descripcion.trim().length < 10) {
    errores.push('La descripción debe tener al menos 10 caracteres')
  }
  if (receta.descripcion && receta.descripcion.length > 1000) {
    errores.push('La descripción no puede exceder 1000 caracteres')
  }

  if (!receta.categoria || receta.categoria.trim().length === 0) {
    errores.push('Debes seleccionar una categoría')
  }

  if (!Array.isArray(receta.ingredientes) || receta.ingredientes.length === 0) {
    errores.push('Debes agregar al menos un ingrediente')
  } else {
    const ingredientesValidos = receta.ingredientes.every(
      i => i && typeof i === 'string' && i.trim().length > 0 && i.length <= 150
    )
    if (!ingredientesValidos) {
      errores.push('Los ingredientes deben ser textos válidos y no exceder 150 caracteres')
    }
  }

  if (!Array.isArray(receta.pasos) || receta.pasos.length === 0) {
    errores.push('Debes agregar al menos un paso')
  } else {
    const pasosValidos = receta.pasos.every(
      p => p && typeof p === 'string' && p.trim().length > 0 && p.length <= 500
    )
    if (!pasosValidos) {
      errores.push('Los pasos deben ser textos válidos y no exceder 500 caracteres')
    }
  }

  if (!receta.tiempoPreparacion || receta.tiempoPreparacion.trim().length === 0) {
    errores.push('Debes especificar el tiempo de preparación')
  }

  if (!receta.dificultad || receta.dificultad.trim().length === 0) {
    errores.push('Debes seleccionar una dificultad')
  }

  return { valida: errores.length === 0, errores }
}

/**
 * Valida datos de comentario
 * @param {object} comentario - Datos del comentario
 * @returns {object} { valida: boolean, errores: string[] }
 */
export function validarComentario(comentario) {
  const errores = []

  if (!comentario.comentario || comentario.comentario.trim().length < 2) {
    errores.push('El comentario debe tener al menos 2 caracteres')
  }
  if (comentario.comentario && comentario.comentario.length > 500) {
    errores.push('El comentario no puede exceder 500 caracteres')
  }

  if (!comentario.recetaId || comentario.recetaId.trim().length === 0) {
    errores.push('ID de receta inválido')
  }

  if (!comentario.usuarioId || comentario.usuarioId.trim().length === 0) {
    errores.push('ID de usuario inválido')
  }

  return { valida: errores.length === 0, errores }
}

/**
 * Sanitiza texto para evitar XSS
 * @param {string} texto - Texto a sanitizar
 * @returns {string}
 */
export function sanitizarTexto(texto) {
  if (typeof texto !== 'string') return ''
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

/**
 * Valida el formato de una imagen
 * @param {File} archivo - Archivo a validar
 * @returns {object} { valida: boolean, error: string }
 */
export function validarImagen(archivo) {
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp']

  if (!archivo) {
    return { valida: false, error: 'No se seleccionó archivo' }
  }

  if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
    return { valida: false, error: 'Solo se permiten imágenes JPEG, PNG o WebP' }
  }

  if (archivo.size > MAX_SIZE) {
    return { valida: false, error: 'La imagen no puede exceder 5MB' }
  }

  return { valida: true, error: null }
}
