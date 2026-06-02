import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
} from 'firebase/auth'
import { auth, isFirebaseReady } from '../firebase/config'
import { crearUsuario } from '../services/firebase'
import {
  isDemoMode,
  getDemoUser,
  loginDemoUser,
  registerDemoUser,
  logoutDemoUser,
} from '../services/demoService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [demo, setDemo] = useState(false)

  useEffect(() => {
    const modoDemo = isDemoMode()
    setDemo(modoDemo)

    if (modoDemo) {
      const demoUser = getDemoUser()
      setUser(demoUser)
      setLoading(false)
      return
    }

    if (!isFirebaseReady) {
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsub
  }, [])

  const loginWithGoogle = async () => {
    if (demo) {
      const dummyUser = loginDemoUser('usuario.demo@gmail.com', 'demo123')
      setUser(dummyUser)
      return dummyUser
    }
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    await crearUsuario(result.user.uid, {
      nombre: result.user.displayName,
      email: result.user.email,
      foto: result.user.photoURL,
    })
    return result
  }

  const register = async (email, password, nombre) => {
    if (demo) {
      const dummyUser = registerDemoUser(nombre, email, password)
      setUser(dummyUser)
      return dummyUser
    }
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await crearUsuario(result.user.uid, {
      nombre,
      email,
      foto: '',
    })
    return result
  }

  const login = async (email, password) => {
    if (demo) {
      const demoUser = loginDemoUser(email, password)
      setUser(demoUser)
      return demoUser
    }
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    if (demo) {
      logoutDemoUser()
      setUser(null)
      return
    }
    await signOut(auth)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        register,
        login,
        logout,
        isFirebaseReady: isFirebaseReady || demo,
        demo,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
