import {
  collection, addDoc, getDocs, getDoc, doc, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp, arrayUnion, arrayRemove, increment
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage, isFirebaseReady } from '../firebase/config'
import {
  isDemoMode, getDemoRecetas, getDemoReceta, createDemoReceta, deleteDemoReceta,
  toggleDemoLike, toggleDemoFav, getDemoComentarios, addDemoComentario,
  getDemoRanking, getDemoAllUsers, getDemoStats, calcularInsignia,
} from './demoService'

export { calcularInsignia } from './demoService'

function usarDemo() {
  return isDemoMode() || !isFirebaseReady
}

export async function crearUsuario(uid, data) {
  if (usarDemo()) return
  await setDoc(doc(db, 'users', uid), {
    uid,
    ...data,
    puntos: 0,
    insignia: 'Cocinero Novato',
    fechaRegistro: serverTimestamp(),
  })
}

export async function obtenerUsuario(uid) {
  if (usarDemo()) return null
  const docSnap = await getDoc(doc(db, 'users', uid))
  return docSnap.exists() ? docSnap.data() : null
}

export async function actualizarPuntos(uid, puntos) {
  if (usarDemo()) return
  const ref = doc(db, 'users', uid)
  await updateDoc(ref, { puntos: increment(puntos) })
  const usr = await obtenerUsuario(uid)
  const nuevaInsignia = calcularInsignia(usr.puntos)
  await updateDoc(ref, { insignia: nuevaInsignia })
}

export async function subirImagen(file, path) {
  if (usarDemo()) return ''
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function crearReceta(data) {
  if (usarDemo()) return createDemoReceta(data)
  const docRef = await addDoc(collection(db, 'recipes'), {
    ...data,
    likes: [],
    favoritos: [],
    fechaCreacion: serverTimestamp(),
  })
  return docRef.id
}

export async function obtenerRecetas() {
  if (usarDemo()) return getDemoRecetas()
  const snap = await getDocs(query(collection(db, 'recipes'), orderBy('fechaCreacion', 'desc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function obtenerReceta(id) {
  if (usarDemo()) return getDemoReceta(id)
  const docSnap = await getDoc(doc(db, 'recipes', id))
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
}

export async function darLike(recetaId, usuarioId) {
  if (usarDemo()) return toggleDemoLike(recetaId, usuarioId)
  const ref = doc(db, 'recipes', recetaId)
  const receta = await obtenerReceta(recetaId)
  if (receta.likes.includes(usuarioId)) {
    await updateDoc(ref, { likes: arrayRemove(usuarioId) })
  } else {
    await updateDoc(ref, { likes: arrayUnion(usuarioId) })
    await actualizarPuntos(receta.autorId, 2)
  }
}

export async function toggleFavorito(recetaId, usuarioId) {
  if (usarDemo()) return toggleDemoFav(recetaId, usuarioId)
  const ref = doc(db, 'recipes', recetaId)
  const receta = await obtenerReceta(recetaId)
  if (receta.favoritos.includes(usuarioId)) {
    await updateDoc(ref, { favoritos: arrayRemove(usuarioId) })
  } else {
    await updateDoc(ref, { favoritos: arrayUnion(usuarioId) })
  }
}

export async function agregarComentario(data) {
  if (usarDemo()) return addDemoComentario(data)
  const docRef = await addDoc(collection(db, 'comments'), {
    ...data,
    fecha: serverTimestamp(),
  })
  await actualizarPuntos(data.usuarioId, 1)
  return docRef.id
}

export async function obtenerComentarios(recetaId) {
  if (usarDemo()) return getDemoComentarios(recetaId)
  const snap = await getDocs(
    query(collection(db, 'comments'), where('recetaId', '==', recetaId), orderBy('fecha', 'asc'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function eliminarReceta(id) {
  if (usarDemo()) return deleteDemoReceta(id)
  await deleteDoc(doc(db, 'recipes', id))
}

export async function obtenerRanking() {
  if (usarDemo()) return getDemoRanking()
  const snap = await getDocs(query(collection(db, 'users'), orderBy('puntos', 'desc'), limit(50)))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function obtenerTodosUsuarios() {
  if (usarDemo()) return getDemoAllUsers()
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function obtenerEstadisticas() {
  if (usarDemo()) return getDemoStats()
  const usersSnap = await getDocs(collection(db, 'users'))
  const recipesSnap = await getDocs(collection(db, 'recipes'))
  const commentsSnap = await getDocs(collection(db, 'comments'))
  return {
    usuarios: usersSnap.size,
    recetas: recipesSnap.size,
    comentarios: commentsSnap.size,
  }
}
