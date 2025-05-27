"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Editor } from "@tinymce/tinymce-react"
import api from "../../services/api"

const TopicFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [topic, setTopic] = useState({
    name: "",
    notes: "",
    order: 0,
  })

  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEditMode) {
      const fetchTopic = async () => {
        try {
          setLoading(true)
          const response = await api.get(`/topics/${id}`)
          setTopic(response.data)
          setError(null)
        } catch (err) {
          console.error("Error fetching topic:", err)
          setError("Failed to load topic. Please try again later.")
        } finally {
          setLoading(false)
        }
      }

      fetchTopic()
    }
  }, [id, isEditMode])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTopic({ ...topic, [name]: value })
  }

  const handleNotesChange = (content) => {
    setTopic({ ...topic, notes: content })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)

      if (isEditMode) {
        await api.put(`/topics/${id}`, topic)
      } else {
        await api.post("/topics", topic)
      }

      navigate("/topics")
    } catch (err) {
      console.error("Error saving topic:", err)
      setError("Failed to save topic. Please check your inputs and try again.")
      window.scrollTo(0, 0)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Topic" : "Create New Topic"}</h1>

      {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Topic Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={topic.name}
            onChange={handleInputChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
            Display Order
          </label>
          <input
            type="number"
            id="order"
            name="order"
            value={topic.order}
            onChange={handleInputChange}
            min="0"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <p className="mt-1 text-sm text-gray-500">Topics with lower order values will be displayed first.</p>
        </div>

        {/* Topic Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Topic Notes</label>
          <Editor
            apiKey="rx8s1n4uhn4vdupvlnm85zk613zhdofco8qowo82unxgepdg"
            initialValue={topic.notes}
            init={{
              height: 400,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help",
            }}
            onEditorChange={handleNotesChange}
          />
          <p className="mt-1 text-sm text-gray-500">
            These notes will be visible to users learning about this topic. Include explanations, tips, and resources.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/topics")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Topic"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TopicFormPage
