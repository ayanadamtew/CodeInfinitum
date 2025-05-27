"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"

const TopicListPage = () => {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const fetchTopics = async () => {
    try {
      setLoading(true)
      const response = await api.get("/topics")
      setTopics(response.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching topics:", err)
      setError("Failed to load topics. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTopics()
  }, [])

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true)
      setDeleteId(id)
      await api.delete(`/topics/${id}`)
      setTopics(topics.filter((topic) => topic._id !== id))
    } catch (err) {
      console.error("Error deleting topic:", err)
      alert("Failed to delete topic. Please try again.")
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this topic? This action cannot be undone.")) {
      handleDelete(id)
    }
  }

  const handleOrderChange = async (id, newOrder) => {
    try {
      await api.put(`/topics/${id}/order`, { order: newOrder })
      fetchTopics() 
    } catch (err) {
      console.error("Error updating topic order:", err)
      alert("Failed to update topic order. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Topic Management</h1>
        <Link
          to="/topics/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add New Topic
        </Link>
      </div>

      {/* Topics Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">Loading topics...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : topics.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No topics found. Click "Add New Topic" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Has Notes
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topics.map((topic) => (
                  <tr key={topic._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/topics/${topic._id}`} className="text-blue-600 hover:text-blue-900">
                        {topic.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">{topic.order}</span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleOrderChange(topic._id, topic.order - 1)}
                            disabled={topic.order <= 0}
                            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleOrderChange(topic._id, topic.order + 1)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {topic.notes && topic.notes.trim() ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link to={`/topics/${topic._id}`} className="text-blue-600 hover:text-blue-900">
                          Edit
                        </Link>
                        <button
                          onClick={() => confirmDelete(topic._id)}
                          disabled={isDeleting && deleteId === topic._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {isDeleting && deleteId === topic._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopicListPage
