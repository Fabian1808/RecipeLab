import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const hasConfig = firebaseConfig.apiKey && firebaseConfig.projectId

let app = null
let auth = null
let db = null
let storage = null

if (hasConfig && getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    console.log('✓ Firebase inicializado correctamente')
  } catch (e) {
    console.error('✗ Error al inicializar Firebase:', e)
  }
} else if (getApps().length > 0) {
  app = getApps()[0]
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
} else {
  console.warn('⚠ Firebase no configurado. Verifica las variables de entorno.')
}

export { app, auth, db, storage }
export const isFirebaseReady = hasConfig && auth !== null
