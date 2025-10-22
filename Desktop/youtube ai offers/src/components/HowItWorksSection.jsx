import React, { useState, useEffect } from 'react'
import './HowItWorksSection.css'
import data from '../structured.json'

function HowItWorksSection({ isVisible }) {
  const [titleMoved, setTitleMoved] = useState(false)
  const [selectedNiche, setSelectedNiche] = useState(null)
  const [selectedVideoStyle, setSelectedVideoStyle] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState('niche')

  useEffect(() => {
    if (isVisible) {
      // Через 2 секунди після появи переміщаємо заголовок
      const timer = setTimeout(() => {
        setTitleMoved(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isVisible])

  useEffect(() => {
    // Оновлюємо час кожну секунду
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleNicheClick = (niche) => {
    setSelectedNiche(niche)
    setActiveTab('videoStyle')
  }

  const handleVideoStyleClick = (style) => {
    setSelectedVideoStyle(style)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    })
  }

  return (
    <section className={`how-it-works-section ${isVisible ? 'visible' : ''} ${titleMoved ? 'gradient-shifted' : ''}`}>
      <div className="color-transition-layer"></div>
      <div className="glitch-overlay"></div>
      <div className={`how-it-works-container ${titleMoved ? 'title-moved' : ''}`}>
        <h2 className="how-title">How it works</h2>
        
        {titleMoved && (
          <>
            <div className="steps-container">
              <div className="step-item step-with-selection">
                <span className="step-number">1.</span>
                <span className="step-text">Choose your niche</span>
                {selectedNiche && (
                  <>
                    <div className="selection-line"></div>
                    <div className="selected-value">
                      {selectedNiche}
                    </div>
                  </>
                )}
              </div>
              <div className={`step-item step-with-selection ${selectedNiche ? 'active-step' : ''}`}>
                <span className="step-number">2.</span>
                <span className="step-text">Choose your category</span>
                {selectedVideoStyle && (
                  <>
                    <div className="selection-line"></div>
                    <div className="selected-value">
                      {selectedVideoStyle}
                    </div>
                  </>
                )}
              </div>
              <div className="step-item">
                <span className="step-number">3.</span>
                <span className="step-text">Write CTA</span>
              </div>
              <div className="step-item">
                <span className="step-number">4.</span>
                <span className="step-text">Select amount of videos</span>
              </div>
              <div className="step-item">
                <span className="step-number">5.</span>
                <span className="step-text">Start factory</span>
              </div>
              <div className="step-item">
                <span className="step-number">6.</span>
                <span className="step-text">Enjoy the result</span>
              </div>
            </div>

            <div className="content-container">
              <div className="container-tabs">
                <div className={`tab ${activeTab === 'niche' ? 'active' : ''}`}>
                  <span>Choose Niche</span>
                  <span className="tab-close">×</span>
                </div>
                <div className={`tab ${activeTab === 'videoStyle' ? 'active' : ''}`}>
                  <span>Choose Category</span>
                  <span className="tab-close">×</span>
                </div>
              </div>

              <div className="container-content">
                <div className={`niches-grid ${selectedNiche ? 'hidden' : ''}`}>
                  {data.analytics.niches.map((niche, index) => (
                    <div 
                      key={index} 
                      className="niche-block"
                      onClick={() => handleNicheClick(niche)}
                    >
                      {niche}
                    </div>
                  ))}
                </div>

                <div className={`video-styles-grid ${selectedNiche && !selectedVideoStyle ? 'visible' : ''}`}>
                  {data.videoStyles.map((style, index) => (
                    <div 
                      key={index} 
                      className="video-style-block"
                      style={{ backgroundImage: `url(${style.image})` }}
                      onClick={() => handleVideoStyleClick(style.name)}
                    >
                      <span className="style-name">{style.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="container-footer">
                <span className="footer-brand">Fenix Reels</span>
                <span className="footer-time">{formatTime(currentTime)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default HowItWorksSection

