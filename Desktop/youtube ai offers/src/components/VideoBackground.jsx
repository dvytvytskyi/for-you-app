import React, { useRef, useState } from 'react'
import './VideoBackground.css'

function VideoBackground({ isVisible }) {
  const videoRef = useRef(null)

  React.useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isVisible) {
      video.play()
    }
  }, [isVisible])

  return (
    <div className={`video-background ${isVisible ? 'visible' : ''}`}>
      <video 
        ref={videoRef}
        className="background-video"
        loop
        muted
        playsInline
        crossOrigin="anonymous"
      >
        {/* Тимчасово: безкоштовне відео з Pexels */}
        <source src="https://videos.pexels.com/video-files/8186989/8186989-uhd_2560_1440_24fps.mp4" type="video/mp4" />
      </video>
    </div>
  )
}

export default VideoBackground

