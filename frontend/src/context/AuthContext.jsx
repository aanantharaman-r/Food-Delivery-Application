
import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

const DEFAULT_USER = {
  avatar: '',
  memberSince: '',
  loyaltyPoints: 0,
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('foodie_user')) || null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(
    () => localStorage.getItem('foodie_token') || ''
  )

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem('foodie_token'))
  )

  const saveSession = (userData, authToken) => {
    const updatedUser = { ...DEFAULT_USER, ...userData }

    localStorage.setItem('foodie_user', JSON.stringify(updatedUser))
    localStorage.setItem('foodie_token', authToken)

    setUser(updatedUser)
    setToken(authToken)
    setIsLoggedIn(true)
  }

  const login = async ({ email, password }) => {
    const response = await fetch(
      'http://localhost:5000/api/auth/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }
    )

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Login failed')
    }

    saveSession(data.user, data.token)
    return data.user
  }

  const register = async (userData) => {
    const response = await fetch(
      'http://localhost:5000/api/auth/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Registration failed')
    }

    return data
  }

  const logout = () => {
    localStorage.removeItem('foodie_user')
    localStorage.removeItem('foodie_token')

    setUser(null)
    setToken('')
    setIsLoggedIn(false)
  }

  const updateUser = (updates) => {
    setUser((previous) => {
      if (!previous) return null

      const updated = { ...previous, ...updates }
      localStorage.setItem('foodie_user', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
