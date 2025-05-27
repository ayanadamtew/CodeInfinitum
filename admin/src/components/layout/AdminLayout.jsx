"use client"

import { useState } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const isActive = (path) => {
    return location.pathname.startsWith(path)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white ${isSidebarOpen ? "w-64" : "w-20"} transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold">LeetCoder Admin</h1>
          ) : (
            <h1 className="text-xl font-bold">LC</h1>
          )}
          <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-700 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              )}
            </svg>
          </button>
        </div>

        <nav className="mt-6">
          <ul className="space-y-2 px-2">
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center p-3 rounded-md ${
                  isActive("/dashboard") ? "bg-blue-700" : "hover:bg-gray-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {isSidebarOpen && <span className="ml-3">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/problems"
                className={`flex items-center p-3 rounded-md ${
                  isActive("/problems") ? "bg-blue-700" : "hover:bg-gray-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                {isSidebarOpen && <span className="ml-3">Problems</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/topics"
                className={`flex items-center p-3 rounded-md ${
                  isActive("/topics") ? "bg-blue-700" : "hover:bg-gray-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                {isSidebarOpen && <span className="ml-3">Topics</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/users"
                className={`flex items-center p-3 rounded-md ${
                  isActive("/users") ? "bg-blue-700" : "hover:bg-gray-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                {isSidebarOpen && <span className="ml-3">Users</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/contact-requests"
                className={`flex items-center p-3 rounded-md ${
                  isActive("/contact-requests") ? "bg-blue-700" : "hover:bg-gray-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {isSidebarOpen && <span className="ml-3">Contact Requests</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`flex items-center p-3 rounded-md ${
                  isActive("/settings") ? "bg-blue-700" : "hover:bg-gray-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {isSidebarOpen && <span className="ml-3">Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {location.pathname === "/dashboard" && "Dashboard"}
              {location.pathname === "/problems" && "Problem Management"}
              {location.pathname.startsWith("/problems/new") && "Create Problem"}
              {location.pathname.match(/^\/problems\/[^/]+$/) && "Edit Problem"}
              {location.pathname === "/topics" && "Topic Management"}
              {location.pathname.startsWith("/topics/new") && "Create Topic"}
              {location.pathname.match(/^\/topics\/[^/]+$/) && "Edit Topic"}
              {location.pathname === "/users" && "User Management"}
              {location.pathname.match(/^\/users\/[^/]+$/) && "User Details"}
              {location.pathname === "/contact-requests" && "Contact Requests"}
              {location.pathname === "/settings" && "Settings"}
            </h1>
            <div className="flex items-center">
              <span className="mr-4 text-gray-700">{user?.username || "Admin"}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
