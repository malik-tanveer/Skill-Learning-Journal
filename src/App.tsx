// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Skills from "./pages/Skills";
import Progress from "./pages/Progress";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
      <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />

              {/* Protected App */}
              <Route
                path="/skills"
                element={
                  <ProtectedRoute>
                    <Skills />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedRoute>
                    <Progress />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Default to dashboard when authenticated */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
      </AuthProvider>
  );
};

export default App;
