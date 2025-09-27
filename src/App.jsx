import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './pages/Dashboard'
import { authService } from './services/authService'
import { ThemeProvider } from './contexts/ThemeContext'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si el usuario ya está autenticado al cargar la app
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated()
      setIsAuthenticated(authenticated)
      setLoading(false)
    }

    checkAuth()
  }, [])

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true)
    console.log('Usuario logueado:', user)
  }

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                  <Navigate to="/dashboard" replace /> : 
                  <Login onLoginSuccess={handleLoginSuccess} />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? 
                  <Dashboard /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/" 
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
              } 
            />
            {/* Ruta catch-all para páginas no encontradas */}
            <Route 
              path="*" 
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
              } 
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
