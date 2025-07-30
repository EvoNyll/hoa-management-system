import React, { createContext, useContext, useState } from 'react'
import { toast } from 'react-toastify'

const AlertContext = createContext({})

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([])

  const addAlert = (message, type = 'info', duration = 5000) => {
    const id = Date.now().toString()
    const alert = { id, message, type, duration }
    
    setAlerts(prev => [...prev, alert])
    
    // Auto remove alert
    setTimeout(() => {
      removeAlert(id)
    }, duration)
    
    return id
  }

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const showSuccess = (message, duration) => {
    toast.success(message)
    return addAlert(message, 'success', duration)
  }

  const showError = (message, duration) => {
    toast.error(message)
    return addAlert(message, 'error', duration)
  }

  const showWarning = (message, duration) => {
    toast.warning(message)
    return addAlert(message, 'warning', duration)
  }

  const showInfo = (message, duration) => {
    toast.info(message)
    return addAlert(message, 'info', duration)
  }

  const clearAlerts = () => {
    setAlerts([])
  }

  const value = {
    alerts,
    addAlert,
    removeAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAlerts
  }

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  )
}