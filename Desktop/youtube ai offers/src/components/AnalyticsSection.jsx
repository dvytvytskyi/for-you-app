import React from 'react'
import './AnalyticsSection.css'

function AnalyticsSection({ data, isVisible, onPersonalOfferClick, onAnalyticsClick, onVideoCasesClick }) {
  const getAnimatedIcon = (type) => {
    switch(type) {
      case 'views':
        return <div className="animated-icon icon-views"><div className="pulse-ring"></div><div className="icon-core"></div></div>
      case 'ctr':
        return <div className="animated-icon icon-target"><div className="target-outer"></div><div className="target-middle"></div><div className="target-center"></div></div>
      case 'accounts':
        return <div className="animated-icon icon-users"><div className="user-dot"></div><div className="user-dot"></div><div className="user-dot"></div></div>
      case 'weekly':
        return <div className="animated-icon icon-chart"><div className="bar bar-1"></div><div className="bar bar-2"></div><div className="bar bar-3"></div></div>
      default:
        return null
    }
  }

  return (
    <section className={`analytics-section ${isVisible ? 'visible' : ''}`}>
      <div className="analytics-container">
        {/* Main Title */}
        <h1 className="analytics-main-heading">FENIX AI SOCIAL MEDIA FACTORY</h1>
        
        {/* Верхня частина - ніші */}
        <div className="analytics-niches">
          <h3 className="niches-title">Niches</h3>
          <div className="niches-list">
            {data.niches.map((niche, index) => (
              <div key={index} className="niche-tag">
                {niche}
              </div>
            ))}
          </div>
        </div>

        {/* Нижня частина - статистика */}
        <div className="analytics-stats">
          {data.stats.map((stat, index) => (
            <div key={index} className="stat-card">
              {getAnimatedIcon(stat.iconType)}
              <div className="stat-info">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-title">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Кнопки */}
        <div className="analytics-buttons">
          <button className="analytics-btn highlighted" onClick={onPersonalOfferClick}>
            <span>Personal Offer</span>
          </button>
          <button className="analytics-btn" onClick={onAnalyticsClick}>
            <span>Analytics</span>
          </button>
          <button className="analytics-btn" onClick={onVideoCasesClick}>
            <span>Video Cases</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default AnalyticsSection

