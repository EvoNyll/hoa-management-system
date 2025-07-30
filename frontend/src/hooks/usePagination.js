import { useState, useMemo } from 'react'

export const usePagination = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate pagination values
  const pagination = useMemo(() => {
    const totalItems = data.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = data.slice(startIndex, endIndex)

    return {
      currentItems,
      currentPage,
      totalPages,
      totalItems,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, totalItems)
    }
  }, [data, currentPage, itemsPerPage])

  // Navigation functions
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page)
    }
  }

  const goToNextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const goToPrevPage = () => {
    if (pagination.hasPrevPage) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const goToFirstPage = () => {
    setCurrentPage(1)
  }

  const goToLastPage = () => {
    setCurrentPage(pagination.totalPages)
  }

  // Reset pagination when data changes
  const resetPagination = () => {
    setCurrentPage(1)
  }

  return {
    ...pagination,
    goToPage,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
    resetPagination
  }
}

export default usePagination