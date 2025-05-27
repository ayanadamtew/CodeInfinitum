"use client"

import { createContext, useState, useEffect, useContext } from "react"
import api from "../service/api"

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
          setUser(response.data)
        }
      } catch (err) {
        console.error("Authentication error:", err)
        localStorage.removeItem("token")
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

      localStorage.setItem("token", token)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      return false
    }
  }

  const register = async (username, email, password) => {
    try {
      setError(null)
      const response = await api.post("/auth/register", { username, email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
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
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
