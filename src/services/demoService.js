const DEMO_USER_KEY = 'recipelab_demo_user'
const DEMO_RECIPES_KEY = 'recipelab_demo_recipes'
const DEMO_COMMENTS_KEY = 'recipelab_demo_comments'
const DEMO_USERS_KEY = 'recipelab_demo_users'
const DEMO_PASSWORDS_KEY = 'recipelab_demo_passwords'

const INSIGNIAS = [
  { nombre: 'Cocinero Novato', puntos: 0 },
  { nombre: 'Cocinero Intermedio', puntos: 30 },
  { nombre: 'Chef Experto', puntos: 80 },
  { nombre: 'Master Chef', puntos: 150 },
]

export function calcularInsignia(puntos) {
  let insignia = INSIGNIAS[0].nombre
  for (const i of INSIGNIAS) {
    if (puntos >= i.puntos) insignia = i.nombre
  }
  return insignia
}

const ADMIN_EMAIL = 'admin@recipelab.com'
const ADMIN_PASSWORD = 'admin123'

const DEMO_RECETAS = [
  {
    id: 'demo-1',
    titulo: 'Tortilla de Patatas',
    categoria: 'Comida rápida',
    descripcion: 'La clásica tortilla española, jugosa y dorada.',
    ingredientes: ['4 huevos', '3 patatas medianas', '1 cebolla', 'Aceite de oliva', 'Sal'],
    pasos: ['Pelar y cortar las patatas en rodajas finas', 'Freír las patatas y la cebolla en aceite abundante', 'Batir los huevos y mezclar con las patatas escurridas', 'Cuajar la tortilla en la sartén por ambos lados'],
    tiempoPreparacion: '30 min',
    dificultad: 'Media',
    imagen: '',
    autorId: 'demo-user',
    autorNombre: 'Carlos García',
    likes: ['demo-user-2'],
    favoritos: ['demo-user-2'],
    fechaCreacion: Date.now() - 86400000,
    isPublic: true,
  },
  {
    id: 'demo-2',
    titulo: 'Batido de Fresa',
    categoria: 'Bebidas',
    descripcion: 'Refrescante batido natural de fresas.',
    ingredientes: ['10 fresas', '1 plátano', '200ml leche', '2 cucharadas de azúcar', 'Hielo'],
    pasos: ['Lavar y cortar las fresas', 'Pelar el plátano', 'Licuar todos los ingredientes', 'Servir bien frío'],
    tiempoPreparacion: '10 min',
    dificultad: 'Fácil',
    imagen: '',
    autorId: 'demo-user-2',
    autorNombre: 'María López',
    likes: ['demo-user'],
    favoritos: [],
    fechaCreacion: Date.now() - 172800000,
    isPublic: true,
  },
  {
    id: 'demo-3',
    titulo: 'Ensalada César',
    categoria: 'Comida saludable',
    descripcion: 'Ensalada fresca con pollo y aderezo césar.',
    ingredientes: ['Lechuga romana', 'Pechuga de pollo', 'Crutones', 'Queso parmesano', 'Aderezo césar'],
    pasos: ['Lavar y cortar la lechuga', 'Cocinar y desmenuzar el pollo', 'Mezclar todos los ingredientes', 'Agregar el aderezo al servir'],
    tiempoPreparacion: '20 min',
    dificultad: 'Fácil',
    imagen: '',
    autorId: 'demo-user',
    autorNombre: 'Carlos García',
    likes: [],
    favoritos: [],
    fechaCreacion: Date.now() - 259200000,
    isPublic: false,
  },
]

const DEMO_COMENTARIOS = [
  { id: 'com-1', recetaId: 'demo-1', usuarioId: 'demo-user-2', usuarioNombre: 'María López', comentario: '¡Me quedó perfecta! Gracias por la receta.', fecha: Date.now() - 43200000 },
  { id: 'com-2', recetaId: 'demo-1', usuarioId: 'demo-user', usuarioNombre: 'Carlos García', comentario: 'Me alegra que te haya gustado 😊', fecha: Date.now() - 21600000 },
]

function getStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function setStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.warn('localStorage error:', e)
  }
}

export function isDemoMode() {
  return !import.meta.env.VITE_FIREBASE_API_KEY || !import.meta.env.VITE_FIREBASE_PROJECT_ID
}

export function isAdminUser(email) {
  return email === ADMIN_EMAIL
}

export function getDemoUser() {
  return getStorage(DEMO_USER_KEY, null)
}

export function loginDemoUser(email, password) {
  const usuarios = getStorage(DEMO_USERS_KEY, {})
  const passwords = getStorage(DEMO_PASSWORDS_KEY, {})
  let user = Object.values(usuarios).find(u => u.email === email)
  if (!user) {
    const uid = 'demo-user-' + Date.now()
    user = {
      uid,
      nombre: email.split('@')[0],
      email,
      foto: '',
      puntos: 0,
      insignia: 'Cocinero Novato',
      fechaRegistro: Date.now(),
    }
    usuarios[uid] = user
    passwords[uid] = password || 'sin contraseña'
    setStorage(DEMO_USERS_KEY, usuarios)
    setStorage(DEMO_PASSWORDS_KEY, passwords)
  }
  setStorage(DEMO_USER_KEY, user)
  return user
}

export function registerDemoUser(nombre, email, password) {
  const usuarios = getStorage(DEMO_USERS_KEY, {})
  const passwords = getStorage(DEMO_PASSWORDS_KEY, {})
  const uid = 'demo-user-' + Date.now()
  const user = {
    uid,
    nombre,
    email,
    foto: '',
    puntos: 0,
    insignia: 'Cocinero Novato',
    fechaRegistro: Date.now(),
  }
  usuarios[uid] = user
  passwords[uid] = password || 'sin contraseña'
  setStorage(DEMO_USERS_KEY, usuarios)
  setStorage(DEMO_PASSWORDS_KEY, passwords)
  setStorage(DEMO_USER_KEY, user)
  return user
}

export function logoutDemoUser() {
  setStorage(DEMO_USER_KEY, null)
}

export function initDemoData() {
  const existing = getStorage(DEMO_RECIPES_KEY, null)
  if (!existing) {
    setStorage(DEMO_RECIPES_KEY, DEMO_RECETAS)
    setStorage(DEMO_COMMENTS_KEY, DEMO_COMENTARIOS)
  }
}

export function getDemoRecetas() {
  initDemoData()
  return getStorage(DEMO_RECIPES_KEY, [])
}

export function getDemoReceta(id) {
  const recetas = getDemoRecetas()
  return recetas.find(r => r.id === id) || null
}

export function createDemoReceta(data) {
  const recetas = getDemoRecetas()
  const id = 'receta-' + Date.now()
  const nueva = {
    id,
    ...data,
    isPublic: data.isPublic !== undefined ? data.isPublic : true,
    likes: [],
    favoritos: [],
    fechaCreacion: Date.now(),
  }
  recetas.unshift(nueva)
  setStorage(DEMO_RECIPES_KEY, recetas)
  addDemoPoints(data.autorId, 10)
  return id
}

export function deleteDemoReceta(id) {
  const recetas = getDemoRecetas()
  setStorage(DEMO_RECIPES_KEY, recetas.filter(r => r.id !== id))
}

export function updateDemoReceta(id, changes) {
  const recetas = getDemoRecetas()
  const idx = recetas.findIndex(r => r.id === id)
  if (idx === -1) return
  recetas[idx] = { ...recetas[idx], ...changes }
  setStorage(DEMO_RECIPES_KEY, recetas)
}

export function toggleDemoLike(recetaId, usuarioId) {
  const recetas = getDemoRecetas()
  const idx = recetas.findIndex(r => r.id === recetaId)
  if (idx === -1) return
  const receta = recetas[idx]
  if (receta.likes.includes(usuarioId)) {
    receta.likes = receta.likes.filter(id => id !== usuarioId)
  } else {
    receta.likes.push(usuarioId)
    addDemoPoints(receta.autorId, 2)
  }
  recetas[idx] = receta
  setStorage(DEMO_RECIPES_KEY, recetas)
}

export function toggleDemoFav(recetaId, usuarioId) {
  const recetas = getDemoRecetas()
  const idx = recetas.findIndex(r => r.id === recetaId)
  if (idx === -1) return
  const receta = recetas[idx]
  if (receta.favoritos.includes(usuarioId)) {
    receta.favoritos = receta.favoritos.filter(id => id !== usuarioId)
  } else {
    receta.favoritos.push(usuarioId)
  }
  recetas[idx] = receta
  setStorage(DEMO_RECIPES_KEY, recetas)
}

export function getDemoComentarios(recetaId) {
  const comentarios = getStorage(DEMO_COMMENTS_KEY, [])
  return comentarios.filter(c => c.recetaId === recetaId)
}

export function addDemoComentario(data) {
  const comentarios = getStorage(DEMO_COMMENTS_KEY, [])
  const id = 'com-' + Date.now()
  const nuevo = { id, ...data, fecha: Date.now() }
  comentarios.push(nuevo)
  setStorage(DEMO_COMMENTS_KEY, comentarios)
  addDemoPoints(data.usuarioId, 1)
  return id
}

function addDemoPoints(uid, puntos) {
  const usuarios = getStorage(DEMO_USERS_KEY, {})
  if (usuarios[uid]) {
    usuarios[uid].puntos = (usuarios[uid].puntos || 0) + puntos
    usuarios[uid].insignia = calcularInsignia(usuarios[uid].puntos)
    setStorage(DEMO_USERS_KEY, usuarios)

    const currentUser = getStorage(DEMO_USER_KEY, null)
    if (currentUser && currentUser.uid === uid) {
      currentUser.puntos = usuarios[uid].puntos
      currentUser.insignia = usuarios[uid].insignia
      setStorage(DEMO_USER_KEY, currentUser)
    }
  }
}

export function getDemoRanking() {
  const usuarios = getStorage(DEMO_USERS_KEY, {})
  return Object.values(usuarios).sort((a, b) => (b.puntos || 0) - (a.puntos || 0))
}

export function getDemoAllUsers() {
  const usuarios = getStorage(DEMO_USERS_KEY, {})
  initDemoUsers(usuarios)
  return Object.values(usuarios)
}

export function getDemoPasswords() {
  return getStorage(DEMO_PASSWORDS_KEY, {})
}

export function createDemoUserByAdmin(nombre, email, password) {
  const usuarios = getStorage(DEMO_USERS_KEY, {})
  const passwords = getStorage(DEMO_PASSWORDS_KEY, {})
  const uid = 'demo-user-' + Date.now()
  const user = {
    uid,
    nombre,
    email,
    foto: '',
    puntos: 0,
    insignia: 'Cocinero Novato',
    fechaRegistro: Date.now(),
  }
  usuarios[uid] = user
  passwords[uid] = password || 'sin contraseña'
  setStorage(DEMO_USERS_KEY, usuarios)
  setStorage(DEMO_PASSWORDS_KEY, passwords)
  return user
}

function initDemoUsers(usuarios) {
  const passwords = getStorage(DEMO_PASSWORDS_KEY, {})
  if (!usuarios['demo-user']) {
    usuarios['demo-user'] = {
      uid: 'demo-user',
      nombre: 'Carlos García',
      email: 'carlos@example.com',
      foto: '',
      puntos: 20,
      insignia: 'Cocinero Novato',
      fechaRegistro: Date.now() - 604800000,
    }
    passwords['demo-user'] = 'carlos123'
  }
  if (!usuarios['demo-user-2']) {
    usuarios['demo-user-2'] = {
      uid: 'demo-user-2',
      nombre: 'María López',
      email: 'maria@example.com',
      foto: '',
      puntos: 5,
      insignia: 'Cocinero Novato',
      fechaRegistro: Date.now() - 432000000,
    }
    passwords['demo-user-2'] = 'maria123'
  }
  if (!usuarios['admin']) {
    usuarios['admin'] = {
      uid: 'admin',
      nombre: 'Administrador',
      email: ADMIN_EMAIL,
      foto: '',
      puntos: 999,
      insignia: 'Master Chef',
      fechaRegistro: Date.now() - 999999999,
    }
    passwords['admin'] = ADMIN_PASSWORD
  }
  setStorage(DEMO_USERS_KEY, usuarios)
  setStorage(DEMO_PASSWORDS_KEY, passwords)
}

export function getDemoStats() {
  const recetas = getDemoRecetas()
  const comentarios = getStorage(DEMO_COMMENTS_KEY, [])
  const usuarios = getStorage(DEMO_USERS_KEY, {})
  return {
    usuarios: Object.keys(usuarios).length || 2,
    recetas: recetas.length,
    comentarios: comentarios.length,
  }
}
