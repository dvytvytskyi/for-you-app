import React from 'react'
import './Header.css'

function Header({ isVisible, onPersonalOfferClick, onVideoCasesClick }) {
  return (
    <header className={`header ${isVisible ? 'visible' : ''}`}>
      <div className="header-container">
        {/* Логотип */}
        <div className="header-logo">
          <img src="/logo.svg" alt="Fenix Logo" className="logo-image" />
        </div>

        {/* Навігація */}
        <nav className="header-nav">
          <button onClick={onPersonalOfferClick} className="nav-link highlighted">Personal Offer</button>
          <a href="#analytics" className="nav-link">Analytics</a>
          <button onClick={onVideoCasesClick} className="nav-link">Video Cases</button>
        </nav>

        {/* Кнопка інвестора */}
        <button className="investor-button">
          <span className="button-text">Become investor</span>
          <span className="button-arrow">→</span>
        </button>
      </div>
    </header>
  )
}

export default Header

