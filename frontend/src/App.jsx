import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import { AlertProvider } from './context/AlertContext'
import AppRouter from './router'
import Layout from './components/layout/Layout'
import './styles/globals.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <Layout>
            <AppRouter />
          </Layout>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            className="mt-16"
          />
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App