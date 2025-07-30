import React from 'react'
import { Users, Mail, Phone } from 'lucide-react'

const BoardMembers = () => {
  const boardMembers = [
    {
      id: 1,
      name: 'John Smith',
      position: 'President',
      bio: 'John has been a resident for over 8 years and brings extensive experience in community management.',
      email: 'president@greenfieldHOA.com'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      position: 'Treasurer',
      bio: 'Sarah manages our community finances with 15+ years of accounting experience.',
      email: 'treasurer@greenfieldHOA.com'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      position: 'Secretary',
      bio: 'Mike coordinates board meetings and maintains community records.',
      email: 'secretary@greenfieldHOA.com'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Board Members</h1>
            <p className="text-gray-600">Meet your community leadership team</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {boardMembers.map((member) => (
            <div key={member.id} className="card text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-green-600 font-medium mb-4">{member.position}</p>
              <p className="text-gray-600 mb-6">{member.bio}</p>
              <div className="flex items-center justify-center">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <a href={`mailto:${member.email}`} className="text-green-600 hover:text-green-700">
                  {member.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BoardMembers