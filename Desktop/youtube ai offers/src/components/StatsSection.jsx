import React, { useState, useEffect } from 'react'
import './StatsSection.css'

function StatsSection({ stats, isVisible }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setCurrentIndex(-1)
      return
    }

    const timeouts = []

    // Перший елемент з'являється через 1 секунду і висить 2 секунди
    const firstTimeout = setTimeout(() => {
      setCurrentIndex(0)
    }, 1000)
    timeouts.push(firstTimeout)

    // Другий елемент через 1 + 2 = 3 секунди
    const secondTimeout = setTimeout(() => {
      setCurrentIndex(1)
    }, 3000)
    timeouts.push(secondTimeout)

    // Третій елемент через 3 + 2 = 5 секунд
    const thirdTimeout = setTimeout(() => {
      setCurrentIndex(2)
    }, 5000)
    timeouts.push(thirdTimeout)

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [isVisible, stats.length])

  return (
    <section className={`stats-section ${isVisible ? 'visible' : ''}`}>
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`stat-item ${index === currentIndex ? 'active' : ''}`}
          >
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StatsSection

