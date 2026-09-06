import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import LoginPage from './components/loginpage.jsx';
import SignupPage from './components/SignupPage.jsx';
import Dashboard from './components/Dashboard.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return !!(localStorage.getItem('dealflow_auth_token') || sessionStorage.getItem('dealflow_auth_token'));
    } catch {
      return false;
    }
  });

  return (
    <Router>
      <Routes>
        {/* Root and Home routes: Always open HomePage */}
        <Route path="/" element={<HomePage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/home" element={<HomePage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/index.html" element={<HomePage setIsAuthenticated={setIsAuthenticated} />} />
        
        {/* Authentication routes */}
        <Route 
          path="/login" 
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} 
        />
        
        <Route 
          path="/signup" 
          element={<SignupPage setIsAuthenticated={setIsAuthenticated} />} 
        />
        
        {/* Protected Dashboard route: Redirects to Home Page if not authenticated */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* Catch-all route: Fallback always opens HomePage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;