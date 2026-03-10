import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

const AuthContext = createContext(null)

function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const applyToken = useCallback((t) => {
    if (t) {
      API.defaults.headers.common['Authorization'] = `Bearer ${t}`
    } else {
      delete API.defaults.headers.common['Authorization']
    }
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('pizzaToken')
    if (stored) {
      const decoded = decodeToken(stored)
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setToken(stored)
        setUser({ id: decoded.id, role: decoded.role })
        applyToken(stored)
      } else {
        localStorage.removeItem('pizzaToken')
      }
    }
    setLoading(false)
  }, [applyToken])

  async function login(email, password) {
    const res = await API.post('/auth/login', { email, password })
    const { token: newToken } = res.data
    localStorage.setItem('pizzaToken', newToken)
    const decoded = decodeToken(newToken)
    setToken(newToken)
    setUser({ id: decoded.id, role: decoded.role })
    applyToken(newToken)
    return decoded
  }

  async function register(name, email, password, role) {
    const res = await API.post('/auth/register', { name, email, password, role })
    return res.data
  }

  function logout() {
    localStorage.removeItem('pizzaToken')
    setToken(null)
    setUser(null)
    applyToken(null)
    navigate('/login')
  }

  const isAdmin = () => user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
