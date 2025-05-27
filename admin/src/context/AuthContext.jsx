"use client"

import { createContext, useState, useEffect, useContext } from "react"
import api from "../services/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`
          const response = await api.get("/auth/me")

          // Only set the user if they have admin role
          if (response.data.role === "admin") {
            setUser(response.data)
          } else {
            // Clear token if user is not an admin
            localStorage.removeItem("token")
            delete api.defaults.headers.common["Authorization"]
          }
        }
      } catch (err) {
        console.error("Authentication error:", err)
        localStorage.removeItem("token")
        delete api.defaults.headers.common["Authorization"]
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await api.post("/auth/login", { email, password })
      const { token, user } = response.data

      // Only allow admin users to login
      if (user.role !== "admin") {
        setError("Access denied. Admin privileges required.")
        return false
      }

      localStorage.setItem("token", token)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAdmin: user?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
