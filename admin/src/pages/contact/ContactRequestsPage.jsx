"use client"

import { useState, useEffect, useCallback } from "react" 
import api from "../../services/api" 

const ContactRequestsPage = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null) 
  const [selectedRequestId, setSelectedRequestId] = useState(null); 

  const [filter, setFilter] = useState("all") 
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);


  // Fetch the list of requests (summary)
  const fetchRequests = useCallback(async () => { 
    try {
      setLoading(true)
      // Backend endpoint for fetching submissions list
      let url = "/contact/submissions" 
      const params = new URLSearchParams()

      if (filter !== "all") params.append("status", filter)
      params.append("page", currentPage.toString())
      params.append("limit", "10") // You can make limit configurable

      console.log(`Fetching: ${url}?${params.toString()}`);

      // The backend GET /submissions route doesn't take /submit
      // It's GET /api/contact/submissions
      const response = await api.get(`${url}?${params.toString()}`)

      console.log("API Response Data:", response.data);

      setRequests(response.data.requests) 
      setTotalPages(response.data.totalPages)
      setError(null)
    } catch (err) {
      console.error("Error fetching contact requests:", err)
      setError(err.response?.data?.message || "Failed to load contact requests. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [currentPage, filter]) 

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests]) 

  // Fetch full details for a selected request
  const fetchRequestDetails = async (requestId) => {
    if (!requestId) {
        setSelectedRequest(null);
        return;
    }
    setIsLoadingDetails(true);
    try {
        // Corrected endpoint for fetching a single submission's details
        const response = await api.get(`/contact/submissions/${requestId}`);
        setSelectedRequest(response.data); // Assuming backend returns the full submission object
    } catch (err) {
        console.error(`Error fetching details for request ${requestId}:`, err);
        setError("Failed to load request details."); // Or show a toast
        setSelectedRequest(null); // Clear if fetch fails
    } finally {
        setIsLoadingDetails(false);
    }
  };

  // Effect to fetch details when selectedRequestId changes
  useEffect(() => {
    if (selectedRequestId) {
        fetchRequestDetails(selectedRequestId);
    } else {
        setSelectedRequest(null); // Clear details if no ID selected
    }
  }, [selectedRequestId]);


  const handleUpdateRequest = async (id, newStatus, newNotes) => {
    // This function will handle both status change and notes update
    try {
      setIsUpdating(true);
      const payload = {};
      if (newStatus !== undefined) payload.status = newStatus;
      if (newNotes !== undefined) payload.notes = newNotes;

      // Corrected endpoint for updating a submission
      const response = await api.put(`/contact/submissions/${id}`, payload);
      const updatedRequestData = response.data; // Backend returns the updated submission

      // Update the request in the list (summary view)
      setRequests(prevRequests =>
        prevRequests.map((req) =>
          req.id === id ? { ...req, status: updatedRequestData.status, notes: updatedRequestData.notes } : req
        )
      );

      // Update the selected request (detail view)
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(updatedRequestData);
      }
      // Optionally, refetch the list if you want to ensure sorting or other properties are up-to-date
      // fetchRequests();
    } catch (err) {
      console.error("Error updating contact request:", err);
      alert(err.response?.data?.message || "Failed to update contact request. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString)
    return date.toLocaleString() 
  }

  const handleSelectRequest = (requestSummary) => {
    // When a request is clicked in the list, set its ID to trigger detail fetching
    // The list item `request` might not have full details like `message` or `notes`
    setSelectedRequestId(requestSummary.id);
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-500">Loading requests...</p>
      </div>
    );
  }


  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Contact Requests</h1>
        <div className="flex space-x-2">
          {/* Filter Buttons */}
          {["all", "new", "resolved"].map(statusFilter => (
            <button
              key={statusFilter}
              onClick={() => {
                setFilter(statusFilter);
                setCurrentPage(1); // Reset to first page on filter change
              }}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors duration-150 ease-in-out
                ${filter === statusFilter
                  ? (statusFilter === "all" ? "bg-blue-600 text-white" :
                    statusFilter === "new" ? "bg-yellow-500 text-white" :
                    "bg-green-600 text-white")
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && !loading && ( // Display error prominently if initial load failed
          <div className="p-8 text-center text-red-600 bg-white rounded-lg shadow">
            <p className="font-semibold">Error!</p>
            {error}
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Requests List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-700">Inbox ({filter === 'all' ? 'All' : filter})</h2>
          </div>

          {loading && requests.length > 0 ? ( // Show loading overlay for list if loading more pages
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : !error && requests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No contact requests found for this filter.</div>
          ) : !error && ( // Only render list if no error and requests exist
            <div className="overflow-y-auto max-h-[calc(100vh-250px)]"> {/* Adjusted max-h */}
              <ul className="divide-y divide-gray-200">
                {requests.map((request) => ( // request here is summary data
                  <li
                    key={request.id}
                    className={`hover:bg-gray-100 cursor-pointer transition-colors duration-150 ease-in-out ${
                      selectedRequestId === request.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                    }`}
                    onClick={() => handleSelectRequest(request)}
                  >
                    <div className="px-4 sm:px-6 py-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-800 truncate w-3/5" title={request.name}>{request.name}</p>
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            request.status === "new" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {request.status === "new" ? "New" : "Resolved"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 truncate" title={request.email}>{request.email}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(request.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && requests.length > 0 && totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || loading}
                className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs sm:text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || loading}
                className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Contact Request Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          {isLoadingDetails ? (
             <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-500">Loading details...</p>
            </div>
          ) : selectedRequest ? (
            <div>
              <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h2 className="text-lg font-medium text-gray-800 mb-2 sm:mb-0">Request Details</h2>
                <div className="flex space-x-2">
                  {selectedRequest.status === "new" ? (
                    <button
                      onClick={() => handleUpdateRequest(selectedRequest.id, "resolved", selectedRequest.notes)}
                      disabled={isUpdating}
                      className="px-3 py-1.5 text-xs sm:text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {isUpdating ? "Updating..." : "Mark as Resolved"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateRequest(selectedRequest.id, "new", selectedRequest.notes)}
                      disabled={isUpdating}
                      className="px-3 py-1.5 text-xs sm:text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                    >
                      {isUpdating ? "Updating..." : "Mark as New"}
                    </button>
                  )}
                </div>
              </div>
              <div className="p-6 max-h-[calc(100vh-220px)] overflow-y-auto"> {/* Added max-h and overflow */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase">From</h3>
                    <p className="mt-1 text-sm md:text-base text-gray-800">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase">Email</h3>
                    <p className="mt-1 text-sm md:text-base text-gray-800">
                      <a href={`mailto:${selectedRequest.email}`} className="text-blue-600 hover:text-blue-800">
                        {selectedRequest.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase">Submitted</h3>
                    <p className="mt-1 text-sm md:text-base text-gray-800">{formatDate(selectedRequest.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase">Status</h3>
                    <p className="mt-1 text-sm md:text-base">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedRequest.status === "new"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {selectedRequest.status === "new" ? "New" : "Resolved"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-medium text-gray-500 uppercase mb-1">Subject</h3>
                  <p className="text-sm md:text-base font-medium text-gray-800">{selectedRequest.subject}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-medium text-gray-500 uppercase mb-1">Message</h3>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{selectedRequest.message}</p>
                  </div>
                </div>

                {selectedRequest.respondedAt && (
                     <div className="mb-6">
                        <h3 className="text-xs font-medium text-gray-500 uppercase">Responded/Resolved At</h3>
                        <p className="mt-1 text-sm md:text-base text-gray-800">{formatDate(selectedRequest.respondedAt)}</p>
                    </div>
                )}

                <div className="mt-6">
                  <h3 className="text-xs font-medium text-gray-500 uppercase mb-1">Admin Notes</h3>
                  <textarea
                    value={selectedRequest.notes || ""}
                    onChange={(e) => setSelectedRequest(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                    placeholder="Add notes about this contact request..."
                  ></textarea>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() =>
                        handleUpdateRequest(selectedRequest.id, undefined, selectedRequest.notes)
                      } // Only update notes when this button is clicked
                      disabled={isUpdating}
                      className="px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isUpdating ? "Saving..." : "Save Notes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 h-full flex flex-col justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400 mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                Select a contact request from the list to view its details.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactRequestsPage