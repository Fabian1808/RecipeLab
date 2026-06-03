/**
 * Servicio Firebase completo para RecipeLab
 * CRUD de usuarios, recetas, comentarios, likes, etc.
 */

import {
  collection, addDoc, getDocs, getDoc, doc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, arrayUnion, arrayRemove, increment,
  runTransaction
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage, isFirebaseReady } from '../firebase/config'

// ==================== USUARIOS ====================

/**
 * Crear nuevo usuario en Firestore (llamado después de auth.createUserWithEmailAndPassword)
 */
export async function crearUsuarioFirestore(uid, email, nombre, foto = '') {
  if (!isFirebaseReady) throw new Error('Firebase no está configurado')
  
  try {
    await setDoc(doc(db, 'users', uid), {
      uid,
      email,
      nombre: nombre || email.split('@')[0],
      foto: foto || '',
      role: 'user', // Por defecto, role de usuario
      puntos: 0,
      insignia: 'Cocinero Novato',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    console.log('✓ Usuario creado en Firestore:', uid)
  } catch (error) {
    console.error('✗ Error creando usuario:', error)
    throw error
  }
}

/**
 * Obtener datos de un usuario por UID
 */
export async function obtenerUsuario(uid) {
  if (!isFirebaseReady) return null
  
  try {
    const docSnap = await getDoc(doc(db, 'users', uid))
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
  } catch (error) {
    console.error('✗ Error obteniendo usuario:', error)
    return null
  }
}

/**
 * Obtener todos los usuarios (SOLO PARA ADMIN)
 */
export async function obtenerTodosUsuarios() {
  if (!isFirebaseReady) return []
  
  try {
    const snap = await getDocs(
      query(collection(db, 'users'), orderBy('createdAt', 'desc'))
    )
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (error) {
    console.error('✗ Error obteniendo usuarios:', error)
    return []
  }
}

/**
 * Actualizar perfil de usuario
 */
export async function actualizarPerfilUsuario(uid, datos) {
  if (!isFirebaseReady) throw new Error('Firebase no está configurado')
  
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...datos,
      updatedAt: serverTimestamp(),
    })
    console.log('✓ Perfil actualizado:', uid)
  } catch (error) {
    console.error('✗ Error actualizando perfil:', error)
    throw error
  }
}

/**
 * Actualizar rol de usuario (SOLO PARA ADMIN)
 */
export async function actualizarRolUsuario(uid, role) {
  if (!isFirebaseReady) throw new Error('Firebase no está configurado')
  
  try {
    await updateDoc(doc(db, 'users', uid), {
      role,
      updatedAt: serverTimestamp(),
    })
    console.log('✓ Rol actualizado:', uid, role)
  } catch (error) {
    console.error('✗ Error actualizando rol:', error)
    throw error
  }
}

/**
 * Actualizar puntos de usuario
 */
export async function actualizarPuntos(uid, puntos) {
  if (!isFirebaseReady) throw new Error('Firebase no está configurado')
  
  try {
    const userRef = doc(db, 'users', uid)
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef)
      if (!userDoc.exists()) throw new Error('Usuario no encontrado')
      
      const nuevosPuntos = (userDoc.data().puntos || 0) + puntos
      const newBadge = calcularInsignia(nuevosPuntos)
      
      transaction.update(userRef, {
        puntos: nuevosPuntos,
        insignia: newBadge,
      })
    })
    console.log('✓ Puntos actualizados:', uid, puntos)
  } catch (error) {
    console.error('✗ Error actualizando puntos:', error)
    throw error
  }
}

// ==================== RECETAS ====================

/**
 * Crear nueva receta
 */
export async function crearReceta(datos) {
  if (!isFirebaseReady) throw new Error('Firebase no está configurado')
  
  try {
    const recetaRef = await addDoc(collection(db, 'recipes'), {
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      ingredientes: datos.ingredientes || [],
      procedure: datos.pasos || [],
      tiempoPreparacion: datos.tiempoPreparacion || '',
      dificultad: datos.dificultad || 'Media',
      categoria: datos.categoria || '',
      imageUrl: datos.imagen || '',
      createdBy: datos.autorId,
      autorId: datos.autorId,
      autorNombre: datos.autorNombre,
      autorEmail: datos.autorEmail || '',
      isPublic: datos.isPublic !== false,
      likes: [],
      favoritos: [],
      comentarios: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    console.log('✓ Receta creada:', recetaRef.id)
    return recetaRef.id
  } catch (error) {
    console.error('✗ Error creando receta:', error)
    throw error
  }
}

/**
 * Obtener receta por ID
 */
export async function obtenerReceta(id) {
  if (!isFirebaseReady) return null
  
  try {
    const docSnap = await getDoc(doc(db, 'recipes', id))
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data(), imagen: docSnap.data().imagen || docSnap.data().imageUrl || '' } : null
  } catch (error) {
    console.error('✗ Error obteniendo receta:', error)
    return null
  }
}

/**
 * Obtener todas las recetas
 */
export async function obtenerRecetas() {
  if (!isFirebaseReady) return []
  
  try {
    const snap = await getDocs(
      query(collection(db, 'recipes'), orderBy('createdAt', 'desc'))
    )
    return snap.docs.map(d => ({ id: d.id, ...d.data(), imagen: d.data().imagen || d.data().imageUrl || '' }))
  } catch (error) {
    console.error('✗ Error obteniendo recetas:', error)
    return []
  }
}

/**
 * Obtener recetas del usuario
 */
export async function obtenerRecetasUsuario(uid) {
  if (!isFirebaseReady) return []
  
  try {
    const snap = await getDocs(
      query(
        collection(db, 'recipes'),
        where('createdBy', '==', uid),
        orderBy('createdAt', 'desc')
      )
    )
    return snap.docs.map(d => ({ id: d.id, ...d.data(), imagen: d.data().imagen || d.data().imageUrl || '' }))
  } catch (error) {
    console.error('✗ Error obteniendo recetas del usuario:', error)
    return []
  }
}

/**
 * Actualizar receta
 */
export async function actualizarReceta(id, datos) {
  if (!isFirebaseReady) throw new Error('Firebase no está configurado')
  
  try {
    await updateDoc(doc(db, 'recipes', id), {
      titulo: datos.titulo || undefined,
      descripcion: datos.descripcion || undefined,
      ingredientes: datos.ingredientes || undefined,
      procedure: datos.pasos || undefined,
      tiempoPreparacion: datos.tiempoPreparacion || undefined,
      dificultad: datos.dificultad || undefined,
      categoria: datos.categoria || undefined,
      imageUrl: datos.imagen || undefined,
      isPublic: datos.isPublic !== undefined ? datos.isPublic : undefined,
      updatedAt: serverTimestamp(),
    })
    console.log('✓ Receta actualizada:', id)
  } catch (error) {
    console.error('✗ Error actualizando receta:', error)
    throw error
  }
}

/**
 * Eliminar receta
 */
export async function eliminarReceta(id) {
  if (!isFirebaseReady) throw new Error('Firebase no está configurado')
  
  try {
    const receta = await obtenerReceta(id)
    if (receta && receta.imageUrl) {
      try {
        await deleteObject(ref(storage, receta.imageUrl))
      } catch (e) {
        console.warn('⚠ No se pudo eliminar imagen:', e)
      }
    }
    
    await deleteDoc(doc(db, 'recipes', id))
    console.log('✓ Receta eliminada:', id)
  } catch (error) {
    console.error('✗ Error eliminando receta:', error)
    throw error
  }
}

// ==================== LIKES Y FAVORITOS ====================

/**
 * Agregar/remover like a una receta
 */
export async function toggleLike(recetaId, uid) {
  if (!isFirebaseReady) throw new Error('Firebase no está configurado')
  
  try {
    const receta = await obtenerReceta(recetaId)
    if (!receta) throw new Error('Receta no encontrada')
    
    const likes = receta.likes || []
    const tienelike = likes.includes(uid)
    
    await updateDoc(doc(db, 'recipes', recetaId), {
      likes: tienelike ? arrayRemove(uid) : arrayUnion(uid),
    })
    
    console.log(`✓ Like ${tienelike ? 'removido' : 'agregado'}:`, recetaId)
    return !tienelike
  } catch (error) {
    console.error('✗ Error actualizando like:', error)
    throw error
  }
}

/**
 * Agregar/remover favorito
 */
export async function toggleFavorito(recetaId, uid) {
  if (!isFirebaseReady) throw new Error('Firebase no está configurado')
  
  try {
    const receta = await obtenerReceta(recetaId)
    if (!receta) throw new Error('Receta no encontrada')
    
    const favoritos = receta.favoritos || []
    const esFavorito = favoritos.includes(uid)
    
    await updateDoc(doc(db, 'recipes', recetaId), {
      favoritos: esFavorito ? arrayRemove(uid) : arrayUnion(uid),
    })
    
    console.log(`✓ Favorito ${esFavorito ? 'removido' : 'agregado'}:`, recetaId)
    return !esFavorito
  } catch (error) {
    console.error('✗ Error actualizando favorito:', error)
    throw error
  }
}

// ==================== ALMACENAMIENTO (STORAGE) ====================

/**
 * Subir imagen a Firebase Storage
 */
export async function subirImagen(file, path) {
  if (!isFirebaseReady) throw new Error('Firebase no está configurado')
  
  try {
    // Validaciones
    const maxSize = 5 * 1024 * 1024 // 5 MB
    if (file.size > maxSize) {
      throw new Error('La imagen no debe exceder 5 MB')
    }
    
    const tiposValidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!tiposValidos.includes(file.type)) {
      throw new Error('Formato de imagen no válido. Usa JPG, PNG, WebP o GIF')
    }
    
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const url = await getDownloadURL(snapshot.ref)
    console.log('✓ Imagen subida:', path)
    return url
  } catch (error) {
    console.error('✗ Error subiendo imagen:', error)
    throw error
  }
}

/**
 * Eliminar imagen de Storage
 */
export async function eliminarImagen(url) {
  if (!isFirebaseReady) return
  
  try {
    if (url) {
      const imageRef = ref(storage, url)
      await deleteObject(imageRef)
      console.log('✓ Imagen eliminada')
    }
  } catch (error) {
    console.warn('⚠ Error eliminando imagen:', error)
  }
}

// ==================== COMENTARIOS ====================

/**
 * Agregar comentario a una receta
 */
export async function agregarComentario(recetaId, uid, nombre, texto) {
  if (!isFirebaseReady) throw new Error('Firebase no está configurado')
  
  try {
    await addDoc(collection(db, 'recipes', recetaId, 'comments'), {
      uid,
      nombre,
      texto,
      createdAt: serverTimestamp(),
    })
    
    await updateDoc(doc(db, 'recipes', recetaId), {
      comentarios: increment(1),
    })
    
    console.log('✓ Comentario agregado:', recetaId)
  } catch (error) {
    console.error('✗ Error agregando comentario:', error)
    throw error
  }
}

/**
 * Obtener comentarios de una receta
 */
export async function obtenerComentarios(recetaId) {
  if (!isFirebaseReady) return []
  
  try {
    const snap = await getDocs(
      query(
        collection(db, 'recipes', recetaId, 'comments'),
        orderBy('createdAt', 'desc')
      )
    )
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (error) {
    console.error('✗ Error obteniendo comentarios:', error)
    return []
  }
}

/**
 * Eliminar comentario
 */
export async function eliminarComentario(recetaId, comentarioId) {
  if (!isFirebaseReady) throw new Error('Firebase no está configurado')
  
  try {
    await deleteDoc(doc(db, 'recipes', recetaId, 'comments', comentarioId))
    await updateDoc(doc(db, 'recipes', recetaId), {
      comentarios: increment(-1),
    })
    console.log('✓ Comentario eliminado:', comentarioId)
  } catch (error) {
    console.error('✗ Error eliminando comentario:', error)
    throw error
  }
}

// ==================== ESTADÍSTICAS Y RANKINGS ====================

/**
 * Obtener top 10 recetas por likes
 */
export async function obtenerRecetasPopulares(limite = 10) {
  if (!isFirebaseReady) return []
  
  try {
    const snap = await getDocs(
      query(
        collection(db, 'recipes'),
        orderBy('createdAt', 'desc'),
        limit(limite)
      )
    )
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
  } catch (error) {
    console.error('✗ Error obteniendo recetas populares:', error)
    return []
  }
}

/**
 * Obtener ranking de usuarios por puntos
 */
export async function obtenerRanking(limite = 50) {
  if (!isFirebaseReady) return []
  
  try {
    const snap = await getDocs(
      query(
        collection(db, 'users'),
        orderBy('puntos', 'desc'),
        limit(limite)
      )
    )
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (error) {
    console.error('✗ Error obteniendo ranking:', error)
    return []
  }
}

/**
 * Obtener estadísticas generales
 */
export async function obtenerEstadisticas() {
  if (!isFirebaseReady) return { usuarios: 0, recetas: 0, comentarios: 0 }
  
  try {
    const usuarios = await getDocs(collection(db, 'users'))
    const recetas = await getDocs(collection(db, 'recipes'))
    
    let comentarios = 0
    for (const receta of recetas.docs) {
      const comentariosSnap = await getDocs(
        collection(db, 'recipes', receta.id, 'comments')
      )
      comentarios += comentariosSnap.size
    }
    
    return {
      usuarios: usuarios.size,
      recetas: recetas.size,
      comentarios,
    }
  } catch (error) {
    console.error('✗ Error obteniendo estadísticas:', error)
    return { usuarios: 0, recetas: 0, comentarios: 0 }
  }
}

// ==================== UTILITIES ====================

/**
 * Calcular insignia según puntos
 */
export function calcularInsignia(puntos) {
  const insignias = [
    { nombre: 'Cocinero Novato', minPuntos: 0 },
    { nombre: 'Cocinero Intermedio', minPuntos: 30 },
    { nombre: 'Chef Experto', minPuntos: 80 },
    { nombre: 'Master Chef', minPuntos: 150 },
  ]
  
  let insigniaActual = insignias[0].nombre
  for (const insignia of insignias) {
    if (puntos >= insignia.minPuntos) {
      insigniaActual = insignia.nombre
    }
  }
  return insigniaActual
}

/**
 * Verificar si un usuario es admin
 */
export async function esAdmin(uid) {
  try {
    const usuario = await obtenerUsuario(uid)
    return usuario?.role === 'admin'
  } catch (error) {
    console.error('✗ Error verificando admin:', error)
    return false
  }
}
