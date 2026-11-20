
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute() {
  const { isLoggedIn, user, token } = useAuth()
  const location = useLocation()

  // Safely check token from context or fallback to localStorage
  const activeToken = token || localStorage.getItem('foodie_token')
  let activeUser = user
  if (!activeUser) {
    try {
      activeUser = JSON.parse(localStorage.getItem('foodie_user'))
    } catch {
      activeUser = null
    }
  }

  // Redirect to login if user is not authenticated
  if (!activeToken) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    )
  }

  // Redirect to home if user is not an admin
  if (activeUser?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  // Allow access to admin users
  return <Outlet />
}
