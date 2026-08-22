import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'
import LandingPage from './pages/LandingPage'
import ReportIssue from './pages/ReportIssue'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Issues from './pages/Issues'
import IssueDetail from './pages/IssueDetail'
import About from './pages/About'
import AuthorityDashboard from './pages/AuthorityDashboard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/report"
            element={
              <RoleRoute role="citizen">
                <ReportIssue />
              </RoleRoute>
            }
          />
          <Route path="/authority" element={<RoleRoute role="authority"><AuthorityDashboard /></RoleRoute>} />
          <Route
            path="/dashboard"
            element={
              <RoleRoute role="citizen">
                <Dashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/issues"
            element={
              <RoleRoute role="citizen">
                <Issues />
              </RoleRoute>
            }
          />
          <Route
            path="/issues/:id"
            element={
              <ProtectedRoute>
                <IssueDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)