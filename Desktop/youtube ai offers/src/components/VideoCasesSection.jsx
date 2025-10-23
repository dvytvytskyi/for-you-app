import React, { useState, useRef, useEffect } from 'react'
import './VideoCasesSection.css'

function VideoCasesSection({ isVisible, onBackClick }) {
  const [hoveredVideo, setHoveredVideo] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const videoRefs = useRef({})
  const scrollContainerRefs = useRef({})

  useEffect(() => {
    if (isVisible) {
      setShowModal(true)
    }
  }, [isVisible])

  const categories = [
    { id: 'gambling', name: 'Gambling' },
    { id: 'betting', name: 'Betting' },
    { id: 'e-com', name: 'E-commerce' },
    { id: 'podcast', name: 'Podcast' }
  ]

  // Відео з S3
  const S3_URL = 'https://roomy-ae.s3.eu-west-3.amazonaws.com/fenix-showcase'
  
  const videoCases = {
    gambling: [
      { id: 1, title: 'Casino Win', url: `${S3_URL}/videos/gambling/gambling_1.mp4`, views: '2.5K' },
      { id: 3, title: 'Slots Win', url: `${S3_URL}/videos/gambling/gambling_3.mp4`, views: '1.8K' },
      { id: 4, title: 'Jackpot', url: `${S3_URL}/videos/gambling/gambling_4.mp4`, views: '2.2K' },
      { id: 6, title: 'Casino Bonus', url: `${S3_URL}/videos/gambling/gambling_6.mp4`, views: '1.9K' },
      { id: 7, title: 'Roulette Win', url: `${S3_URL}/videos/gambling/gambling_7.mp4`, views: '2.4K' },
      { id: 8, title: 'Slots Strategy', url: `${S3_URL}/videos/gambling/gambling_8.mp4`, views: '2.1K' },
      { id: 9, title: 'Big Payout', url: `${S3_URL}/videos/gambling/gambling_9.mp4`, views: '3.0K' },
      { id: 11, title: 'Mega Win', url: `${S3_URL}/videos/gambling/gambling_11.mp4`, views: '2.6K' }
    ],
    betting: [
      { id: 21, title: 'Sports Betting Tips', url: `${S3_URL}/videos/betting/betting_1.mp4`, views: '1.9K' },
      { id: 22, title: 'Live Betting', url: `${S3_URL}/videos/betting/betting_2.mp4`, views: '2.4K' },
      { id: 23, title: 'Odds Explained', url: `${S3_URL}/videos/betting/betting_3.mp4`, views: '1.5K' },
      { id: 24, title: 'Betting Strategy', url: `${S3_URL}/videos/betting/betting_4.mp4`, views: '2.8K' },
      { id: 25, title: 'Win Analysis', url: `${S3_URL}/videos/betting/betting_5.mp4`, views: '2.2K' },
      { id: 26, title: 'Betting Guide', url: `${S3_URL}/videos/betting/betting_6.mp4`, views: '3.1K' }
    ],
    'e-com': [
      { id: 31, title: 'Product Review', url: `${S3_URL}/videos/e-com/ecom_1.mp4`, views: '3.2K' },
      { id: 32, title: 'Unboxing', url: `${S3_URL}/videos/e-com/ecom_2.mp4`, views: '2.8K' },
      { id: 33, title: 'Product Demo', url: `${S3_URL}/videos/e-com/ecom_3.mp4`, views: '2.1K' },
      { id: 34, title: 'Shopping Haul', url: `${S3_URL}/videos/e-com/ecom_4.mp4`, views: '2.5K' },
      { id: 35, title: 'Product Test', url: `${S3_URL}/videos/e-com/ecom_5.mp4`, views: '1.9K' },
      { id: 36, title: 'Best Finds', url: `${S3_URL}/videos/e-com/ecom_6.mp4`, views: '3.4K' },
      { id: 37, title: 'Shopping Tips', url: `${S3_URL}/videos/e-com/ecom_7.mp4`, views: '2.7K' }
    ],
    podcast: [
      { id: 41, title: 'Interview Highlights', url: `${S3_URL}/videos/podcast/podcast_1.mp4`, views: '4.2K' },
      { id: 42, title: 'Expert Talk', url: `${S3_URL}/videos/podcast/podcast_2.mp4`, views: '3.8K' },
      { id: 43, title: 'Business Insights', url: `${S3_URL}/videos/podcast/podcast_3.mp4`, views: '3.5K' },
      { id: 44, title: 'Industry Trends', url: `${S3_URL}/videos/podcast/podcast_4.mp4`, views: '4.0K' },
      { id: 45, title: 'Success Stories', url: `${S3_URL}/videos/podcast/podcast_5.mp4`, views: '3.9K' },
      { id: 46, title: 'Q&A Session', url: `${S3_URL}/videos/podcast/podcast_6.mp4`, views: '4.5K' }
    ]
  }

  const handleScroll = (categoryId, direction) => {
    const container = scrollContainerRefs.current[categoryId]
    if (container) {
      const scrollAmount = 600
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    // Спочатку зупиняємо і мутимо всі відео
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.pause()
        video.muted = true
        video.currentTime = 0
      }
    })

    // Потім запускаємо тільки наведене відео
    if (hoveredVideo !== null) {
      const video = videoRefs.current[hoveredVideo]
      if (video) {
        video.muted = false
        video.play().catch(err => {
          // Обробка помилки автоплею
          console.log('Autoplay prevented:', err)
        })
      }
    }
  }, [hoveredVideo])

  return (
    <section className={`video-cases-section ${isVisible ? 'visible' : ''}`}>
      {/* Modal з попередженням про звук */}
      {showModal && (
        <div className="sound-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sound-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sound-modal-icon">🔊</div>
            <h2 className="sound-modal-title">Sound Alert</h2>
            <p className="sound-modal-text">
              When you hover over a video, audio will play automatically
            </p>
            <button className="sound-modal-button" onClick={() => setShowModal(false)}>
              Got it
            </button>
          </div>
        </div>
      )}

      <button className="back-button" onClick={onBackClick}>
        <span className="back-arrow">←</span>
        <span>Back</span>
      </button>

      <div className="video-cases-content">
        <h1 className="video-cases-title">Video Cases</h1>
        <p className="video-cases-subtitle">Real examples of our video content performance</p>

        {/* Categories with Videos */}
        {categories.map(category => (
          <div key={category.id} className="category-section">
            <div className="category-header">
              <h2 className="category-name">{category.name}</h2>
              <div className="scroll-arrows">
                <button 
                  className="scroll-arrow left"
                  onClick={() => handleScroll(category.id, 'left')}
                >
                  ←
                </button>
                <button 
                  className="scroll-arrow right"
                  onClick={() => handleScroll(category.id, 'right')}
                >
                  →
                </button>
              </div>
            </div>

            {/* Videos Horizontal Scroll */}
            <div 
              className="videos-horizontal-scroll"
              ref={el => scrollContainerRefs.current[category.id] = el}
            >
              <div className="videos-container">
                {videoCases[category.id]?.map(video => (
                  <div
                    key={video.id}
                    className="video-card"
                    onMouseEnter={() => setHoveredVideo(video.id)}
                    onMouseLeave={() => setHoveredVideo(null)}
                  >
                    <div className="video-wrapper">
                        <video
                          ref={el => videoRefs.current[video.id] = el}
                          src={video.url}
                          loop
                          muted
                          playsInline
                          crossOrigin="anonymous"
                          className="video-player"
                        />
                      <div className={`video-overlay ${hoveredVideo === video.id ? 'hidden' : ''}`}>
                        <div className="play-icon">▶</div>
                      </div>
                    </div>
                    <div className="video-info">
                      <h3 className="video-title">{video.title}</h3>
                      <p className="video-views">{video.views} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default VideoCasesSection

