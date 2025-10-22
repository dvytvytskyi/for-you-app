import React from 'react'
import './PersonalOfferSection.css'

function PersonalOfferSection({ data, isVisible, onBackClick }) {
  return (
    <section className={`personal-offer-section ${isVisible ? 'visible' : ''}`}>
      <button className="back-button" onClick={onBackClick}>
        <span className="back-arrow">←</span>
        <span>Back</span>
      </button>
      <div className="offer-container">
        <h1 className="offer-title">{data.title}</h1>
        <p className="offer-subtitle">{data.subtitle}</p>

        <div className="offer-content">
          {/* Intro */}
          <div className="offer-block">
            <p className="offer-text">{data.intro}</p>
          </div>

          {/* What's Included */}
          <div className="offer-block">
            <h2 className="offer-heading">What's Included</h2>
            <ul className="offer-list">
              {data.included.map((item, index) => (
                <li key={index} className="offer-list-item">{item}</li>
              ))}
            </ul>
          </div>

          {/* Pricing */}
          <div className="offer-block highlight">
            <h2 className="offer-heading">Investment</h2>
            <div className="pricing-info">
              <div className="price-tag">{data.pricing.amount}</div>
              <p className="price-description">{data.pricing.description}</p>
            </div>
          </div>

          {/* Terms */}
          <div className="offer-block">
            <h2 className="offer-heading">Terms & Conditions</h2>
            <ul className="offer-list">
              {data.terms.map((term, index) => (
                <li key={index} className="offer-list-item">{term}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="offer-footer">
          <p>Fenix Reels © 2025</p>
        </div>
      </div>
    </section>
  )
}

export default PersonalOfferSection

