import React from 'react'

const HeroSection = ({ 
  title, 
  subtitle, 
  backgroundImage = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  overlayColor = "#358939",
  overlayOpacity = "80",
  children,
  breadcrumb,
  height = "min-h-[400px]"
}) => {
  return (
    <section className="bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div 
          className={`relative rounded-3xl overflow-hidden ${height} flex items-center`}
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Colored Overlay */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundColor: overlayColor,
              opacity: overlayOpacity / 100
            }}
          ></div>
          
          {/* Additional gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full">
            <div className="w-full h-full bg-gradient-to-l from-white/10 to-transparent"></div>
          </div>
          
          <div className="relative w-full px-8 sm:px-12 lg:px-16 py-12 lg:py-20">
            <div className="max-w-4xl">
              {breadcrumb && (
                <nav className="mb-6">
                  <div className="flex items-center space-x-2 text-sm">
                    {breadcrumb.map((item, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <span className="text-white/60">•</span>}
                        <span className={index === breadcrumb.length - 1 ? "text-white font-medium" : "text-white/80"}>
                          {item}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </nav>
              )}
              
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-lg sm:text-xl text-white/90 max-w-3xl leading-relaxed">
                    {subtitle}
                  </p>
                )}
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection