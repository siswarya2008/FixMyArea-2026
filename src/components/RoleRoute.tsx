import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import LoadingScreen from './LoadingScreen'

export default function RoleRoute({ role, children }: { role: 'authority' | 'citizen'; children: ReactNode }) {
  const { session, role: currentRole, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingScreen />
  if (!session) return <Navigate to="/signin" state={{ from: location.pathname }} replace />

  const isAuthority = currentRole === 'authority'
  if ((role === 'authority' && !isAuthority) || (role === 'citizen' && isAuthority)) {
    return <Navigate to={isAuthority ? '/authority' : '/dashboard'} replace />
  }

  return <>{children}</>
}