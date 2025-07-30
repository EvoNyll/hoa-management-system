import React from 'react'
import { Users, Mail, Phone, Calendar, Award } from 'lucide-react'
import HeroSection from '../../components/common/HeroSection'

const BoardMembers = () => {
  const boardMembers = [
    {
      id: 1,
      name: 'John Smith',
      position: 'President',
      bio: 'John has been a resident for over 8 years and brings extensive experience in community management and urban planning.',
      email: 'president@greenfieldHOA.com',
      phone: '(555) 123-4567',
      tenure: 'Since 2020',
      achievements: ['Community Excellence Award', 'Sustainability Initiative Leader']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      position: 'Treasurer',
      bio: 'Sarah manages our community finances with 15+ years of accounting experience and CPA certification.',
      email: 'treasurer@greenfieldHOA.com',
      phone: '(555) 123-4568',
      tenure: 'Since 2019',
      achievements: ['Financial Management Excellence', 'Budget Optimization Expert']
    },
    {
      id: 3,
      name: 'Mike Wilson',
      position: 'Secretary',
      bio: 'Mike coordinates board meetings and maintains community records with meticulous attention to detail.',
      email: 'secretary@greenfieldHOA.com',
      phone: '(555) 123-4569',
      tenure: 'Since 2021',
      achievements: ['Communication Excellence', 'Digital Records Pioneer']
    },
    {
      id: 4,
      name: 'Lisa Chen',
      position: 'Vice President',
      bio: 'Lisa specializes in community relations and event coordination, fostering strong neighborhood connections.',
      email: 'vicepresident@greenfieldHOA.com',
      phone: '(555) 123-4570',
      tenure: 'Since 2022',
      achievements: ['Community Engagement Leader', 'Event Planning Excellence']
    }
  ]

  const boardResponsibilities = [
    {
      title: 'Financial Oversight',
      description: 'Managing community funds, budgets, and financial planning',
      icon: '💰'
    },
    {
      title: 'Policy Development',
      description: 'Creating and updating community rules and regulations',
      icon: '📋'
    },
    {
      title: 'Maintenance Planning',
      description: 'Overseeing common area maintenance and improvements',
      icon: '🔧'
    },
    {
      title: 'Community Events',
      description: 'Organizing activities and fostering community spirit',
      icon: '🎉'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Board Members"
        subtitle="Meet the dedicated leaders who guide our community with vision, integrity, and commitment to excellence."
        backgroundImage="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        breadcrumb={['Home', 'Board Members']}
        height="min-h-[400px]"
      />

      {/* Board Members Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#358939]/10 text-[#358939] rounded-full text-sm font-semibold mb-6">
              LEADERSHIP TEAM
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Your Community Leadership
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our board members are elected by residents and serve to ensure our community remains a wonderful place to live.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {boardMembers.map((member) => (
              <div key={member.id} className="card group hover:shadow-xl transition-all duration-300">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-[#358939]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#358939] transition-colors">
                      <Users className="w-10 h-10 text-[#358939] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                      <div className="inline-flex items-center px-3 py-1 bg-[#358939] text-white rounded-full text-sm font-medium">
                        {member.position}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">{member.bio}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {member.tenure}
                      </div>
                    </div>
                    
                    {member.achievements && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <Award className="w-4 h-4 mr-1" />
                          Achievements
                        </h4>
                        <div className="space-y-1">
                          {member.achievements.map((achievement, index) => (
                            <div key={index} className="text-sm text-[#358939] bg-[#358939]/5 px-2 py-1 rounded inline-block mr-2">
                              {achievement}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <a href={`mailto:${member.email}`} className="text-[#358939] hover:text-[#2d7230] text-sm">
                          {member.email}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <a href={`tel:${member.phone}`} className="text-[#358939] hover:text-[#2d7230] text-sm">
                          {member.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board Responsibilities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Board Responsibilities
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our board members work together to ensure the effective management and governance of our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {boardResponsibilities.map((responsibility, index) => (
              <div key={index} className="card text-center group hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">{responsibility.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#358939] transition-colors">
                  {responsibility.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {responsibility.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meeting Information */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#358939] to-[#7CB342] rounded-3xl p-12 lg:p-16 text-white">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Board Meeting Information
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                All residents are welcome to attend board meetings and participate in community governance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-2xl font-bold mb-2">Monthly</div>
                <div className="text-white/80">Meeting Frequency</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-2xl font-bold mb-2">First Tuesday</div>
                <div className="text-white/80">7:00 PM</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-2xl font-bold mb-2">Clubhouse</div>
                <div className="text-white/80">Conference Room</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BoardMembers