export const showSuccess = (message) => {
  console.log('✅ Success:', message)
  // You can replace this with a proper toast library like react-toastify
  // For now, we'll use browser alert as fallback
  // alert(`Success: ${message}`)
}

export const showError = (message) => {
  console.error('❌ Error:', message)
  // You can replace this with a proper toast library like react-toastify
  // For now, we'll use browser alert as fallback
  // alert(`Error: ${message}`)
}

export const showInfo = (message) => {
  console.log('ℹ️ Info:', message)
  // alert(`Info: ${message}`)
}

export const showWarning = (message) => {
  console.warn('⚠️ Warning:', message)
  // alert(`Warning: ${message}`)
}