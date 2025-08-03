import React, { useState } from 'react'
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'
import { exportProfileData, exportProfileDataAsText } from '../../services/profileService'

const ExportOptions = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState('')

  const handleExport = async (type) => {
    try {
      setIsExporting(true)
      setExportType(type)
      
      switch (type) {
        case 'excel':
          await exportProfileData()
          break
        case 'text':
          await exportProfileDataAsText()
          break
        case 'json':
          // Original JSON export
          const response = await api.post('/users/profile/export-data/')
          const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `HOA_Profile_Data_${new Date().toISOString().split('T')[0]}.json`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
          break
        default:
          break
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
      setExportType('')
    }
  }

  const exportOptions = [
    {
      type: 'excel',
      label: 'Excel Spreadsheet',
      description: 'Structured data in multiple sheets - ideal for analysis',
      icon: FileSpreadsheet,
      extension: '.csv',
      recommended: true
    },
    {
      type: 'text',
      label: 'Formatted Text',
      description: 'Human-readable format - easy to view and print',
      icon: FileText,
      extension: '.txt'
    },
    {
      type: 'json',
      label: 'JSON Data',
      description: 'Raw data format - for technical users',
      icon: File,
      extension: '.json'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Export Profile Data</h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        Download your complete profile data in your preferred format. This includes all your 
        personal information, household members, pets, vehicles, and settings.
      </p>

      <div className="grid gap-4">
        {exportOptions.map((option) => {
          const Icon = option.icon
          const isLoading = isExporting && exportType === option.type
          
          return (
            <div
              key={option.type}
              className={`relative border rounded-lg p-4 transition-all duration-200 ${
                option.recommended 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {option.recommended && (
                <div className="absolute -top-2 left-4">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  option.recommended ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    option.recommended ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{option.label}</h4>
                    <span className="text-sm text-gray-500">{option.extension}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                  
                  <button
                    onClick={() => handleExport(option.type)}
                    disabled={isExporting}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      option.recommended
                        ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400'
                        : 'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400'
                    } disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download {option.label}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Privacy Notice</h4>
        <p className="text-sm text-gray-600">
          Your exported data will be downloaded directly to your device. No data is sent to external 
          servers during the export process. Please store your exported files securely as they contain 
          personal information.
        </p>
      </div>
    </div>
  )
}

export default ExportOptions