import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

const DEFAULT_USER = {
  name: 'Sarah Connor',
  email: 'sarah.connor@example.com',
  phone: '+1 (555) 234-5678',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  memberSince: 'March 2024',
  loyaltyPoints: 340
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('foodie_user')
    return saved ? JSON.parse(saved) : DEFAULT_USER
  })
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('foodie_logged_in')
    return saved !== null ? JSON.parse(saved) : true
  })

  useEffect(() => {
    localStorage.setItem('foodie_user', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem('foodie_logged_in', JSON.stringify(isLoggedIn))
  }, [isLoggedIn])

  const login = (userData) => {
    const updated = { ...DEFAULT_USER, ...userData }
    setUser(updated)
    setIsLoggedIn(true)
  }

  const register = (userData) => {
    const updated = {
      ...DEFAULT_USER,
      ...userData,
      memberSince: 'Just now',
      loyaltyPoints: 100 // welcome bonus
    }
    setUser(updated)
    setIsLoggedIn(true)
  }

  const logout = () => {
    setIsLoggedIn(false)
  }

  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }))
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
