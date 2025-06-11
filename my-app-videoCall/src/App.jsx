import React from 'react'
import AppRoutes from './AppRouters'
import { BrowserRouter as Router  } from 'react-router-dom'



function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App