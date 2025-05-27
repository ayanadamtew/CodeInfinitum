"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
