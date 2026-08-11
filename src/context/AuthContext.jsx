import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(
    () => JSON.parse(sessionStorage.getItem('tf_usuario') || 'null')
  )

  const login = (datos) => {
    sessionStorage.setItem('tf_usuario', JSON.stringify(datos))
    setUsuario(datos)
  }

  const logout = () => {
    sessionStorage.removeItem('tf_usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}