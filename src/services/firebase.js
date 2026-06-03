import {
  collection, addDoc, getDocs, getDoc, doc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, arrayUnion, arrayRemove, increment
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage, isFirebaseReady } from '../firebase/config'
import {
  isDemoMode, getDemoRecetas, getDemoReceta, createDemoReceta, deleteDemoReceta,
  toggleDemoLike, toggleDemoFav, getDemoComentarios, addDemoComentario,
  getDemoRanking, calcularInsignia,
} from './demoService'
import { manejarError } from '../utils/errorHandler'
import { validarReceta, validarComentario, validarImagen } from '../utils/validation'

export { calcularInsignia } from './demoService'

const CONTEXTO = 'FirebaseService'

function usarDemo() {
  return isDemoMode() || !isFirebaseReady
}

/**
 * Crear nuevo usuario en Firestore
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
 * Obtener datos de usuario
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
 * Actualizar puntos de usuario
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
 * Crear nueva receta
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
      comentarios: 0,
      fechaCreacion: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    manejarError(error, `${CONTEXTO}/crearReceta`)
    throw error
  }
}

/**
 * Obtener todas las recetas
 */
export async function obtenerRecetas() {
  if (usarDemo()) return getDemoRecetas()
  try {
    const snap = await getDocs(
      query(collection(db, 'recipes'), orderBy('fechaCreacion', 'desc'))
    )
    return snap.docs.map(d => ({ id: d.id, ...d.data(), imagen: d.data().imagen || d.data().imageUrl || '' }))
  } catch (error) {
    manejarError(error, `${CONTEXTO}/obtenerRecetas`)
    return []
  }
}

/**
 * Obtener una receta por ID
 */
export async function obtenerReceta(id) {
  if (usarDemo()) return getDemoReceta(id)
  try {
    if (!id) throw new Error('ID de receta inválido')

    const docSnap = await getDoc(doc(db, 'recipes', id))
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data(), imagen: docSnap.data().imagen || docSnap.data().imageUrl || '' } : null
  } catch (error) {
    manejarError(error, `${CONTEXTO}/obtenerReceta`)
    return null
  }
}

/**
 * Dar like a una receta
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
 * Toggle favorito de receta
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
 * Agregar comentario a receta
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
 * Obtener comentarios de una receta
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
 * Eliminar receta
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
 * Obtener ranking de usuarios
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
 * Obtener todos los usuarios
 */
export async function obtenerTodosUsuarios() {
  if (usarDemo()) return []
  try {
    const snap = await getDocs(collection(db, 'users'))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (error) {
    manejarError(error, `${CONTEXTO}/obtenerTodosUsuarios`)
    return []
  }
}

/**
 * Obtener estadísticas del sitio
 */
export async function obtenerEstadisticas() {
  if (usarDemo()) return {
    usuarios: 0,
    recetas: 0,
    comentarios: 0
  }
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
 * Subir imagen a Storage
 */
export async function subirImagen(file, path) {
  if (usarDemo()) return {
    url: `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=`
  }
  try {
    const validacion = validarImagen(file)
    if (!validacion.valida) {
      throw new Error(validacion.error)
    }

    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const url = await getDownloadURL(snapshot.ref)
    return { url, path: snapshot.ref.fullPath }
  } catch (error) {
    manejarError(error, `${CONTEXTO}/subirImagen`)
    throw error
  }
}
