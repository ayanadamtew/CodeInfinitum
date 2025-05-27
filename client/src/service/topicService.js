import api from "./api"

export const getTopics = async () => {
  try {
    const response = await api.get("/topics")
    return response.data
  } catch (error) {
    console.error("Error fetching topics:", error)
    throw error
  }
}

export const getTopic = async (id) => {
  try {
    const response = await api.get(`/topics/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching topic ${id}:`, error)
    throw error
  }
}

export const getTopicProblems = async (id) => {
  try {
    const response = await api.get(`/topics/${id}/problems`)
    return response.data
  } catch (error) {
    console.error(`Error fetching problems for topic ${id}:`, error)
    throw error
  }
}

export const getTopicNotes = async (id) => {
  try {
    const response = await api.get(`/topics/${id}/notes`)
    return response.data
  } catch (error) {
    console.error(`Error fetching notes for topic ${id}:`, error)
    throw error
  }
}
