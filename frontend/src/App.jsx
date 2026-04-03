import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

// --- Pages ---
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import QuizPage from "./pages/QuizPage";
import Result from "./pages/Result";
import History from "./pages/History";

// --- Faculty Pages ---
import CreateQuestion from "./pages/CreateQuestion";
import CreateQuiz from "./pages/CreateQuiz";
import FacultyAnalytics from "./pages/FacultyAnalytics"; // ✅ Added this import

// --- Components ---
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // Token check for redirecting logged-in users from Login/Register
  const token = localStorage.getItem("token");

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Home />} />
          
          {/* 🛡️ Redirect to dashboard if already logged in */}
          <Route 
            path="/login" 
            element={token ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={token ? <Navigate to="/dashboard" replace /> : <Register />} 
          />

          {/* --- Student & General Protected Routes --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/result"
            element={
              <ProtectedRoute>
                <Result />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          {/* --- Faculty Specific Routes (Protected) --- */}
          <Route
            path="/faculty/create-question"
            element={
              <ProtectedRoute>
                <CreateQuestion />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faculty/create-quiz"
            element={
              <ProtectedRoute>
                <CreateQuiz />
              </ProtectedRoute>
            }
          />

          {/* 🏆 NEW: Analytics Route (Fixes the Home Page Redirect issue) */}
          <Route
            path="/analytics/:quizId"
            element={
              <ProtectedRoute>
                <FacultyAnalytics />
              </ProtectedRoute>
            }
          />

          {/* --- Fallback Route (Catch-all) --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;