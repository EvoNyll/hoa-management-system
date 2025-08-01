// frontend/src/App.jsx
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProfileProvider } from './context/ProfileContext'
import AppRouter from './router'
import Layout from './components/layout/Layout'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <Layout>
            <AppRouter />
          </Layout>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App