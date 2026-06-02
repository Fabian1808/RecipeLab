import {
  collection, addDoc, getDocs, getDoc, doc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, arrayUnion, arrayRemove, increment
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage, isFirebaseReady } from '../firebase/config'
import {
  isDemoMode, getDemoRecetas, getDemoReceta, createDemoReceta, deleteDemoReceta, updateDemoReceta,
  toggleDemoLike, toggleDemoFav, getDemoComentarios, addDemoComentario,
  getDemoRanking, getDemoAllUsers, getDemoStats, calcularInsignia,
} from './demoService'
import { manejarError } from '../utils/errorHandler'
import { validarReceta, validarComentario, validarImagen } from '../utils/validation'

export { calcularInsignia } from './demoService'

const CONTEXTO = 'FirebaseService'

function usarDemo() {
  return isDemoMode() || !isFirebaseReady
}

/**
 * Crea un usuario en la base de datos
 * @param {string} uid - UID del usuario
 * @param {object} data - Datos del usuario
 */
export async function crearUsuario(uid, data) {
  if (usarDemo()) return
  try {
    await setDoc(doc(db, 'users', uid), {
      uid,
      ...data,
      puntos: 0,
      insignia: 'Cocinero Novato',
      fechaRegistro: serverTimestamp(),
    })
  } catch (error) {
    manejarError(error, `${CONTEXTO}/crearUsuario`)
    throw error
  }
}

/**
 * Obtiene datos de un usuario
 * @param {string} uid - UID del usuario
 * @returns {object|null}
 */
export async function obtenerUsuario(uid) {
  if (usarDemo()) return null
  try {
    const docSnap = await getDoc(doc(db, 'users', uid))
    return docSnap.exists() ? docSnap.data() : null
  } catch (error) {
    manejarError(error, `${CONTEXTO}/obtenerUsuario`)
    return null
  }
}

/**
 * Actualiza los puntos de un usuario
 * @param {string} uid - UID del usuario
 * @param {number} puntos - Puntos a agregar
 */
export async function actualizarPuntos(uid, puntos) {
  if (usarDemo()) return
  try {
    if (!uid || typeof puntos !== 'number') {
      throw new Error('UID o puntos inválidos')
    }

    const ref = doc(db, 'users', uid)
    await updateDoc(ref, { puntos: increment(puntos) })

    const usr = await obtenerUsuario(uid)
    if (usr) {
      const nuevaInsignia = calcularInsignia(usr.puntos)
      await updateDoc(ref, { insignia: nuevaInsignia })
    }
  } catch (error) {
    manejarError(error, `${CONTEXTO}/actualizarPuntos`)
  }
}

/**
 * Sube una imagen a Firebase Storage
 * @param {File} file - Archivo a subir
 * @param {string} path - Ruta de destino
 * @returns {string} URL de la imagen
 */
export async function subirImagen(file, path) {
  if (usarDemo()) return ''
  try {
    const validacion = validarImagen(file)
    if (!validacion.valida) {
      throw new Error(validacion.error)
    }

    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  } catch (error) {
    manejarError(error, `${CONTEXTO}/subirImagen`)
    throw error
  }
}

/**
 * Crea una receta
 * @param {object} data - Datos de la receta
 * @returns {string} ID de la receta creada
 */
export async function crearReceta(data) {
  if (usarDemo()) return createDemoReceta(data)
  try {
    const validacion = validarReceta(data)
    if (!validacion.valida) {
      throw new Error(validacion.errores.join(', '))
    }

    const docRef = await addDoc(collection(db, 'recipes'), {
      ...data,
      likes: [],
      favoritos: [],
      fechaCreacion: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    manejarError(error, `${CONTEXTO}/crearReceta`)
    throw error
  }
}

/**
 * Obtiene todas las recetas
 * @returns {array}
 */
export async function obtenerRecetas() {
  if (usarDemo()) return getDemoRecetas()
  try {
    const snap = await getDocs(
      query(collection(db, 'recipes'), orderBy('fechaCreacion', 'desc'))
    )
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (error) {
    manejarError(error, `${CONTEXTO}/obtenerRecetas`)
    return []
  }
}

/**
 * Obtiene una receta por ID
 * @param {string} id - ID de la receta
 * @returns {object|null}
 */
export async function obtenerReceta(id) {
  if (usarDemo()) return getDemoReceta(id)
  try {
    if (!id) throw new Error('ID de receta inválido')

    const docSnap = await getDoc(doc(db, 'recipes', id))
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
  } catch (error) {
    manejarError(error, `${CONTEXTO}/obtenerReceta`)
    return null
  }
}

/**
 * Da o quita un like a una receta
 * @param {string} recetaId - ID de la receta
 * @param {string} usuarioId - ID del usuario
 */
export async function darLike(recetaId, usuarioId) {
  if (usarDemo()) return toggleDemoLike(recetaId, usuarioId)
  try {
    if (!recetaId || !usuarioId) {
      throw new Error('IDs inválidos')
    }

    const ref = doc(db, 'recipes', recetaId)
    const receta = await obtenerReceta(recetaId)
    if (!receta) throw new Error('Receta no encontrada')

    if (receta.likes.includes(usuarioId)) {
      await updateDoc(ref, { likes: arrayRemove(usuarioId) })
    } else {
      await updateDoc(ref, { likes: arrayUnion(usuarioId) })
      await actualizarPuntos(receta.autorId, 2)
    }
  } catch (error) {
    manejarError(error, `${CONTEXTO}/darLike`)
  }
}

/**
 * Agrega o quita una receta de favoritos
 * @param {string} recetaId - ID de la receta
 * @param {string} usuarioId - ID del usuario
 */
export async function toggleFavorito(recetaId, usuarioId) {
  if (usarDemo()) return toggleDemoFav(recetaId, usuarioId)
  try {
    if (!recetaId || !usuarioId) {
      throw new Error('IDs inválidos')
    }

    const ref = doc(db, 'recipes', recetaId)
    const receta = await obtenerReceta(recetaId)
    if (!receta) throw new Error('Receta no encontrada')

    if (receta.favoritos.includes(usuarioId)) {
      await updateDoc(ref, { favoritos: arrayRemove(usuarioId) })
    } else {
      await updateDoc(ref, { favoritos: arrayUnion(usuarioId) })
    }
  } catch (error) {
    manejarError(error, `${CONTEXTO}/toggleFavorito`)
  }
}

/**
 * Agrega un comentario a una receta
 * @param {object} data - Datos del comentario
 * @returns {string} ID del comentario
 */
export async function agregarComentario(data) {
  if (usarDemo()) return addDemoComentario(data)
  try {
    const validacion = validarComentario(data)
    if (!validacion.valida) {
      throw new Error(validacion.errores.join(', '))
    }

    const docRef = await addDoc(collection(db, 'comments'), {
      ...data,
      fecha: serverTimestamp(),
    })
    await actualizarPuntos(data.usuarioId, 1)
    return docRef.id
  } catch (error) {
    manejarError(error, `${CONTEXTO}/agregarComentario`)
    throw error
  }
}

/**
 * Obtiene comentarios de una receta
 * @param {string} recetaId - ID de la receta
 * @returns {array}
 */
export async function obtenerComentarios(recetaId) {
  if (usarDemo()) return getDemoComentarios(recetaId)
  try {
    if (!recetaId) throw new Error('ID de receta inválido')

    const snap = await getDocs(
      query(
        collection(db, 'comments'),
        where('recetaId', '==', recetaId),
        orderBy('fecha', 'asc')
      )
    )
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (error) {
    manejarError(error, `${CONTEXTO}/obtenerComentarios`)
    return []
  }
}

/**
 * Elimina una receta
 * @param {string} id - ID de la receta
 */
export async function eliminarReceta(id) {
  if (usarDemo()) return deleteDemoReceta(id)
  try {
    if (!id) throw new Error('ID de receta inválido')
    await deleteDoc(doc(db, 'recipes', id))
  } catch (error) {
    manejarError(error, `${CONTEXTO}/eliminarReceta`)
    throw error
  }
}

/**
 * Obtiene el ranking de usuarios
 * @returns {array}
 */
export async function obtenerRanking() {
  if (usarDemo()) return getDemoRanking()
  try {
    const snap = await getDocs(
      query(collection(db, 'users'), orderBy('puntos', 'desc'), limit(50))
    )
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (error) {
    manejarError(error, `${CONTEXTO}/obtenerRanking`)
    return []
  }
}

/**
 * Obtiene todos los usuarios
 * @returns {array}
 */
export async function obtenerTodosUsuarios() {
  if (usarDemo()) return getDemoAllUsers()
  try {
    const snap = await getDocs(collection(db, 'users'))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (error) {
    manejarError(error, `${CONTEXTO}/obtenerTodosUsuarios`)
    return []
  }
}

/**
 * Obtiene estadísticas de la aplicación
 * @returns {object}
 */
export async function obtenerEstadisticas() {
  if (usarDemo()) return getDemoStats()
  try {
    const usersSnap = await getDocs(collection(db, 'users'))
    const recipesSnap = await getDocs(collection(db, 'recipes'))
    const commentsSnap = await getDocs(collection(db, 'comments'))
    return {
      usuarios: usersSnap.size,
      recetas: recipesSnap.size,
      comentarios: commentsSnap.size,
    }
  } catch (error) {
    manejarError(error, `${CONTEXTO}/obtenerEstadisticas`)
    return { usuarios: 0, recetas: 0, comentarios: 0 }
  }
}

/**
 * Actualiza una receta
 * @param {string} id - ID de la receta
 * @param {object} cambios - Cambios a realizar
 */
export async function actualizarReceta(id, cambios) {
  if (usarDemo()) return updateDemoReceta(id, cambios)
  try {
    if (!id || !cambios) throw new Error('Parámetros inválidos')

    const ref = doc(db, 'recipes', id)
    await updateDoc(ref, cambios)
  } catch (error) {
    manejarError(error, `${CONTEXTO}/actualizarReceta`)
    throw error
  }
}
