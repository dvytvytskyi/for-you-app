import React from 'react'
import './HeroSection.css'

function HeroSection({ data, onButtonHover, onStartClick, isVisible }) {
  return (
    <section className={`hero-section ${!isVisible ? 'hidden' : ''}`}>
      <div className="hero-content">
        <h1 className="hero-greeting">
          Hello <span className="hero-name">{data.clientName}</span>
        </h1>
        <p className="hero-subtitle">
          {data.subtitle}
        </p>
        <div className="hero-cta">
          <button 
            className="start-button"
            onMouseEnter={() => onButtonHover(true)}
            onMouseLeave={() => onButtonHover(false)}
            onClick={onStartClick}
          >
            <span className="button-text">Start</span>
            <span className="button-glow"></span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

