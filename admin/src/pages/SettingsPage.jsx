"use client"

import { useState, useEffect } from "react"
import api from "../services/api"

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    siteTitle: "",
    siteDescription: "",
    contactEmail: "",
    maxSubmissionsPerDay: 100,
    enableRegistration: true,
    maintenanceMode: false,
    maintenanceMessage: "The site is currently undergoing maintenance. Please check back later.",
    aiHelpEnabled: true,
    aiHelpCredits: 5,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const response = await api.get("/admin/settings")
        setSettings(response.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching settings:", err)
        setError("Failed to load settings. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleNumberChange = (e) => {
    const { name, value } = e.target
    setSettings({
      ...settings,
      [name]: Number.parseInt(value, 10),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      await api.put("/admin/settings", settings)
      setSuccessMessage("Settings saved successfully!")
      setError(null)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err) {
      console.error("Error saving settings:", err)
      setError("Failed to save settings. Please try again.")
      setSuccessMessage(null)
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Platform Settings</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-8">
        {/* General Settings */}
        <div>
          <h2 className="text-lg font-medium border-b pb-2 mb-4">General Settings</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Site Title
              </label>
              <input
                type="text"
                id="siteTitle"
                name="siteTitle"
                value={settings.siteTitle}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Site Description
            </label>
            <textarea
              id="siteDescription"
              name="siteDescription"
              rows={3}
              value={settings.siteDescription}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            ></textarea>
          </div>
        </div>

        {/* User Settings */}
        <div>
          <h2 className="text-lg font-medium border-b pb-2 mb-4">User Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="enableRegistration"
                name="enableRegistration"
                type="checkbox"
                checked={settings.enableRegistration}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enableRegistration" className="ml-2 block text-sm text-gray-900">
                Enable User Registration
              </label>
            </div>
            <div>
              <label htmlFor="maxSubmissionsPerDay" className="block text-sm font-medium text-gray-700 mb-1">
                Max Submissions Per Day
              </label>
              <input
                type="number"
                id="maxSubmissionsPerDay"
                name="maxSubmissionsPerDay"
                min="1"
                value={settings.maxSubmissionsPerDay}
                onChange={handleNumberChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <p className="mt-1 text-sm text-gray-500">Maximum number of code submissions a user can make per day.</p>
            </div>
          </div>
        </div>

        {/* AI Help Settings */}
        <div>
          <h2 className="text-lg font-medium border-b pb-2 mb-4">AI Help Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="aiHelpEnabled"
                name="aiHelpEnabled"
                type="checkbox"
                checked={settings.aiHelpEnabled}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="aiHelpEnabled" className="ml-2 block text-sm text-gray-900">
                Enable AI Help Feature
              </label>
            </div>
            <div>
              <label htmlFor="aiHelpCredits" className="block text-sm font-medium text-gray-700 mb-1">
                Default AI Help Credits
              </label>
              <input
                type="number"
                id="aiHelpCredits"
                name="aiHelpCredits"
                min="0"
                value={settings.aiHelpCredits}
                onChange={handleNumberChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <p className="mt-1 text-sm text-gray-500">Number of AI help credits given to new users.</p>
            </div>
          </div>
        </div>

        {/* Maintenance Settings */}
        <div>
          <h2 className="text-lg font-medium border-b pb-2 mb-4">Maintenance Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="maintenanceMode"
                name="maintenanceMode"
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                Enable Maintenance Mode
              </label>
            </div>
            <div>
              <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700 mb-1">
                Maintenance Message
              </label>
              <textarea
                id="maintenanceMessage"
                name="maintenanceMessage"
                rows={3}
                value={settings.maintenanceMessage}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              ></textarea>
              <p className="mt-1 text-sm text-gray-500">Message displayed to users when maintenance mode is enabled.</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
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
              "Save Settings"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SettingsPage
