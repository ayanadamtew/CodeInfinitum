"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import api from "../../services/api"

const UserDetailPage = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [solvedProblems, setSolvedProblems] = useState([])
  const [recentSubmissions, setRecentSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)

        // Fetch user details
        const userResponse = await api.get(`/users/${id}`)
        setUser(userResponse.data)

        // Fetch solved problems
        const solvedResponse = await api.get(`/users/${id}/solved-problems`)
        setSolvedProblems(solvedResponse.data)

        // Fetch recent submissions
        const submissionsResponse = await api.get(`/users/${id}/submissions?limit=10`)
        setRecentSubmissions(submissionsResponse.data)

        setError(null)
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("Failed to load user data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [id])

  const handleRoleChange = async (newRole) => {
    try {
      setIsUpdating(true)
      await api.put(`/users/${id}/role`, { role: newRole })
      setUser({ ...user, role: newRole })
    } catch (err) {
      console.error("Error updating user role:", err)
      alert("Failed to update user role. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">User not found.</div>
    )
  }

  return (
    <div className="space-y-6">
      {/* User Profile */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-indigo-600 text-2xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-6 text-white">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-indigo-100">{user.email}</p>
              <div className="mt-2 flex items-center">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {user.role}
                </span>
                <span className="ml-4 text-indigo-100">
                  Member since {new Date(user.registrationDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Account Details</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Username:</span>
                  <p className="font-medium">{user.username}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Email:</span>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Registration Date:</span>
                  <p className="font-medium">{new Date(user.registrationDate).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Last Active:</span>
                  <p className="font-medium">{new Date(user.lastActive).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Current Streak:</span>
                  <p className="font-medium">{user.streak} days</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Role Management</h3>
              <p className="text-sm text-gray-500 mb-4">
                Change the user's role to grant or revoke administrative privileges.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRoleChange("user")}
                  disabled={user.role === "user" || isUpdating}
                  className={`px-3 py-1 text-sm rounded-md ${
                    user.role === "user"
                      ? "bg-green-100 text-green-800 cursor-default"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  } disabled:opacity-50`}
                >
                  Regular User
                </button>
                <button
                  onClick={() => handleRoleChange("admin")}
                  disabled={user.role === "admin" || isUpdating}
                  className={`px-3 py-1 text-sm rounded-md ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800 cursor-default"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  } disabled:opacity-50`}
                >
                  Administrator
                </button>
              </div>
              {isUpdating && <p className="text-sm text-blue-600 mt-2">Updating role...</p>}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Statistics</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Problems Solved:</span>
                  <p className="font-medium">{solvedProblems.length}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Total Submissions:</span>
                  <p className="font-medium">{user.totalSubmissions || 0}</p>
                </div>
                <div className="pt-2">
                  <h4 className="text-sm font-medium text-gray-700">Difficulty Breakdown:</h4>
                  <div className="mt-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Easy</span>
                      <span>{user.easySolved || 0} solved</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${user.easyTotal ? (user.easySolved / user.easyTotal) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Medium</span>
                      <span>{user.mediumSolved || 0} solved</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${user.mediumTotal ? (user.mediumSolved / user.mediumTotal) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Hard</span>
                      <span>{user.hardSolved || 0} solved</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{
                          width: `${user.hardTotal ? (user.hardSolved / user.hardTotal) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solved Problems */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Solved Problems</h2>
        </div>
        <div className="p-6">
          {solvedProblems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Problem
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Difficulty
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Solved On
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Language
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {solvedProblems.map((problem) => (
                    <tr key={problem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/problems/${problem.id}`} className="text-blue-600 hover:text-blue-900">
                          {problem.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            problem.difficulty === "Easy"
                              ? "bg-green-100 text-green-800"
                              : problem.difficulty === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(problem.solvedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{problem.language}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">This user hasn't solved any problems yet.</p>
          )}
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Recent Submissions</h2>
        </div>
        <div className="p-6">
          {recentSubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Problem
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Language
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Runtime
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Memory
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/problems/${submission.problemId}`} className="text-blue-600 hover:text-blue-900">
                          {submission.problemTitle}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            submission.status === "Accepted"
                              ? "bg-green-100 text-green-800"
                              : submission.status === "Wrong Answer"
                                ? "bg-red-100 text-red-800"
                                : submission.status === "Time Limit Exceeded"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : submission.status === "Memory Limit Exceeded"
                                    ? "bg-orange-100 text-orange-800"
                                    : submission.status === "Runtime Error"
                                      ? "bg-purple-100 text-purple-800"
                                      : submission.status === "Compile Error"
                                        ? "bg-gray-100 text-gray-800"
                                        : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.language}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.executionTime} ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.memoryUsage} KB</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.submissionTime).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">This user hasn't made any submissions yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDetailPage
