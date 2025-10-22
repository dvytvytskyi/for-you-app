import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import AnimatedBackground from './components/AnimatedBackground'
import VideoBackground from './components/VideoBackground'
import HeroSection from './components/HeroSection'
import StatsSection from './components/StatsSection'
import AnalyticsSection from './components/AnalyticsSection'
import HowItWorksSection from './components/HowItWorksSection'
import PersonalOfferSection from './components/PersonalOfferSection'
import DetailedAnalytics from './components/DetailedAnalytics'
import VideoCasesSection from './components/VideoCasesSection'
import './App.css'
import data from './structured.json'

function App() {
  const [isVideoVisible, setIsVideoVisible] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [showPersonalOffer, setShowPersonalOffer] = useState(false)
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false)
  const [showVideoCases, setShowVideoCases] = useState(false)

  const handleStartClick = () => {
    setShowStats(true)
  }

  const handleHowItWorksClick = () => {
    setShowHowItWorks(true)
  }

  const handlePersonalOfferClick = () => {
    setShowPersonalOffer(true)
  }

  const handleBackToHome = () => {
    setShowPersonalOffer(false)
    // Переконуємось що Stats та Analytics активні
    if (!showStats) {
      setShowStats(true)
    }
    if (!showAnalytics) {
      setShowAnalytics(true)
    }
  }

  const handleDetailedAnalyticsClick = () => {
    setShowDetailedAnalytics(true)
  }

  const handleBackToAnalytics = () => {
    setShowDetailedAnalytics(false)
    // Переконуємось що Stats та Analytics активні
    if (!showStats) {
      setShowStats(true)
    }
    if (!showAnalytics) {
      setShowAnalytics(true)
    }
  }

  const handleVideoCasesClick = () => {
    setShowVideoCases(true)
  }

  const handleBackFromVideoCases = () => {
    setShowVideoCases(false)
    // Переконуємось що Stats та Analytics активні
    if (!showStats) {
      setShowStats(true)
    }
    if (!showAnalytics) {
      setShowAnalytics(true)
    }
  }

  useEffect(() => {
    if (showStats) {
      // Показуємо analytics після того як stats закінчаться (7 секунд)
      const timer = setTimeout(() => {
        setShowAnalytics(true)
      }, 7000)
      
      return () => clearTimeout(timer)
    }
  }, [showStats])

  const allowScroll = showDetailedAnalytics || showVideoCases || showPersonalOffer

  return (
    <div className={`app ${allowScroll ? 'allow-scroll' : ''}`}>
      <Header 
        isVisible={(showAnalytics && !showHowItWorks) || showPersonalOffer || showDetailedAnalytics || showVideoCases}
        onPersonalOfferClick={handlePersonalOfferClick}
        onVideoCasesClick={handleVideoCasesClick}
      />
      <AnimatedBackground />
      <VideoBackground isVisible={isVideoVisible} />
      <HeroSection 
        data={data.hero} 
        onButtonHover={setIsVideoVisible}
        onStartClick={handleStartClick}
        isVisible={!showStats && !showPersonalOffer && !showDetailedAnalytics && !showVideoCases}
      />
      <StatsSection 
        stats={data.stats}
        isVisible={showStats && !showAnalytics && !showPersonalOffer && !showDetailedAnalytics && !showVideoCases}
      />
      <AnalyticsSection 
        data={data.analytics}
        isVisible={showAnalytics && !showHowItWorks && !showPersonalOffer && !showDetailedAnalytics && !showVideoCases}
        onPersonalOfferClick={handlePersonalOfferClick}
        onAnalyticsClick={handleDetailedAnalyticsClick}
        onVideoCasesClick={handleVideoCasesClick}
      />
      <HowItWorksSection 
        isVisible={showHowItWorks && !showPersonalOffer && !showDetailedAnalytics && !showVideoCases}
      />
      <PersonalOfferSection 
        data={data.personalOffer}
        isVisible={showPersonalOffer && !showDetailedAnalytics && !showVideoCases}
        onBackClick={handleBackToHome}
      />
      <DetailedAnalytics 
        data={data.analytics}
        isVisible={showDetailedAnalytics && !showVideoCases}
        onBackClick={handleBackToAnalytics}
      />
      <VideoCasesSection 
        isVisible={showVideoCases}
        onBackClick={handleBackFromVideoCases}
      />
    </div>
  )
}

export default App

