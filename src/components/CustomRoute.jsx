import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getLocalData } from '../helpers'

export function PrivateRoute({ children }) {
  const { currentUser } = useAuth()
  const localCurrentUser = getLocalData('current-user')

  if (!currentUser && localCurrentUser == null) {
    return <Navigate to='/' />
  }

  return children;
}

export function PublicRoute({ children }) {
  const { currentUser } = useAuth()

  if (currentUser) {
    return <Navigate to='/home' />
  }

  return children;
}