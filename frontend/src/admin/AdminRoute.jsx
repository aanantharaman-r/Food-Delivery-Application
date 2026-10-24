
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute() {
  const { isLoggedIn, user, token } = useAuth()
  const location = useLocation()

  // Redirect to login if the user is not authenticated
  if (!isLoggedIn || !token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    )
  }

  // Redirect to home if the user is not an admin
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  // Allow access only to admin users
  return <Outlet />
}
