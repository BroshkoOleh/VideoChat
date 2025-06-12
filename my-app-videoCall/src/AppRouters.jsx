import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import './App.css'

export default function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem('videocall-auth')
      setIsAuthenticated(!!authData)
      setIsLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth()
    }

    window.addEventListener('auth-change', handleAuthChange)
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange)
    }
  }, [])

  if (isLoading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '1.2rem'
    }}>
      Завантаження...
    </div>
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} 
      />
      <Route 
        path="/home" 
        element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="*" 
        element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} 
      />
    </Routes>
  )
}

