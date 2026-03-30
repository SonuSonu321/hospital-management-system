import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      return data
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', payload)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      return data
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  const hasRole = (role) => user?.roles?.includes(role)

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
