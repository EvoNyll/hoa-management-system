// frontend/src/App.jsx - UPDATED WITH ERROR BOUNDARY
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProfileProvider } from './context/ProfileContext'
import AppRouter from './router'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/common/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ProfileProvider>
            <Layout>
              <ErrorBoundary>
                <AppRouter />
              </ErrorBoundary>
            </Layout>
          </ProfileProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App