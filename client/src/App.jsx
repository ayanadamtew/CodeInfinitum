import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import HomePage from "./pages/HomePage"
import ProblemListPage from "./pages/ProblemListPage"
import TopicsPage from "./pages/topics/TopicsPage"
import TopicDetailPage from "./pages/topics/TopicDetailPage"
import ProblemSolvePage from "./pages/ProblemSolvePage"
import ProfilePage from "./pages/ProfilePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/problems" element={<ProblemListPage />} />
              <Route path="/problems/:id" element={<ProblemSolvePage />} />
              <Route path="/topics" element={<TopicsPage />} />
              <Route path="/topics/:id" element={<TopicDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
