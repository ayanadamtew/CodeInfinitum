import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import AdminLayout from "./components/layout/AdminLayout"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import ProblemListPage from "./pages/problems/ProblemListPage"
import ProblemFormPage from "./pages/problems/ProblemFormPage"
import UserListPage from "./pages/users/UserListPage"
import UserDetailPage from "./pages/users/UserDetailPage"
import ContactRequestsPage from "./pages/contact/ContactRequestsPage"
import SettingsPage from "./pages/SettingsPage"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import NotFoundPage from "./pages/NotFoundPage"
import TopicListPage from "./pages/topics/TopicListPage"
import TopicFormPage from "./pages/topics/TopicFormPage"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Admin routes - all protected and using AdminLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Problem management routes */}
            <Route path="problems" element={<ProblemListPage />} />
            <Route path="problems/new" element={<ProblemFormPage />} />
            <Route path="problems/:id" element={<ProblemFormPage />} />

            {/* Topic management routes */}
            <Route path="topics" element={<TopicListPage />} />
            <Route path="topics/new" element={<TopicFormPage />} />
            <Route path="topics/:id" element={<TopicFormPage />} />

            {/* User management routes */}
            <Route path="users" element={<UserListPage />} />
            <Route path="users/:id" element={<UserDetailPage />} />

            {/* Other admin routes */}
            <Route path="contact-requests" element={<ContactRequestsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
