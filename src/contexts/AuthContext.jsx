import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { auth, isFirebaseReady } from '../firebase/config'
import {
  crearUsuarioFirestore,
  obtenerUsuario,
} from '../services/firebaseService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseReady) {
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        try {
          let userData = await obtenerUsuario(firebaseUser.uid)
          if (!userData) {
            await crearUsuarioFirestore(firebaseUser.uid, firebaseUser.email, firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario', '')
            userData = await obtenerUsuario(firebaseUser.uid)
          }
          setUserRole(userData?.role || 'user')
        } catch (error) {
          console.error('Error obteniendo rol:', error)
          setUserRole('user')
        }
      } else {
        setUser(null)
        setUserRole(null)
      }
      setLoading(false)
    })

    return unsub
  }, [])

  // Registrar con email y contraseña
  const register = async (email, password, nombre) => {
    if (!isFirebaseReady) throw new Error('Firebase no está configurado')

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)

      // Actualizar displayName en Firebase Auth
      await updateProfile(result.user, { displayName: nombre })

      // Crear usuario en Firestore
      await crearUsuarioFirestore(result.user.uid, email, nombre, '')
      setUserRole('user')

      return result.user
    } catch (error) {
      const errorMap = {
        'auth/email-already-in-use': 'Este correo ya está registrado',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
        'auth/invalid-email': 'El correo electrónico no es válido',
        'auth/operation-not-allowed': 'El registro no está habilitado',
      }
      throw new Error(errorMap[error.code] || error.message)
    }
  }

  // Login con email y contraseña
  const login = async (email, password) => {
    if (!isFirebaseReady) throw new Error('Firebase no está configurado')

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)

      let userData = await obtenerUsuario(result.user.uid)
      if (!userData) {
        await crearUsuarioFirestore(result.user.uid, email, result.user.displayName || email.split('@')[0], '')
        userData = await obtenerUsuario(result.user.uid)
      }
      setUserRole(userData?.role || 'user')

      return result.user
    } catch (error) {
      const errorMap = {
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/invalid-credential': 'Correo o contraseña incorrectos',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
        'auth/invalid-email': 'El correo electrónico no es válido',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      }
      throw new Error(errorMap[error.code] || 'Correo o contraseña incorrectos')
    }
  }

  // Logout
  const logout = async () => {
    if (!isFirebaseReady) throw new Error('Firebase no está configurado')

    try {
      await signOut(auth)
      setUserRole(null)
    } catch (error) {
      throw new Error('Error al cerrar sesión')
    }
  }

  const isAdmin = userRole === 'admin'

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        isAdmin,
        loading,
        register,
        login,
        logout,
        isFirebaseReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
