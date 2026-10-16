import React, { useState, useEffect } from 'react'
import { UtensilsCrossed, ShieldCheck, Sparkles, MapPin, ArrowRight } from 'lucide-react'

const GOURMET_STEPS = [
  { label: "Curating top-rated kitchens nearby", icon: MapPin },
  { label: "Handpicking fresh ingredients & chefs", icon: Sparkles },
  { label: "Verifying lightning-speed delivery routes", icon: ShieldCheck }
]

export const CrazyLoadingScreen = ({ 
  onComplete, 
  duration = 2400, 
  forceShow = false 
}) => {
  const [progress, setProgress] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)

  // Step transitions
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % GOURMET_STEPS.length)
    }, 750)
    return () => clearInterval(stepInterval)
  }, [])

  // Progress ticker & exit animation
  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const calculated = Math.min(Math.round((elapsed / duration) * 100), 100)
      setProgress(calculated)

      if (elapsed >= duration) {
        clearInterval(interval)
        setIsFadingOut(true)
        setTimeout(() => {
          setIsVisible(false)
          if (onComplete) onComplete()
        }, 500) // smooth exit fade
      }
    }, 25)

    return () => clearInterval(interval)
  }, [duration, onComplete])

  if (!isVisible && !forceShow) return null

  // Circumference for circular progress indicator
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference
  const ActiveStepIcon = GOURMET_STEPS[currentStepIndex].icon

  return (
    <div 
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between py-12 px-6 bg-slate-900/40 backdrop-blur-2xl transition-all duration-500 ease-in-out ${
        isFadingOut ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 60%, #f4f4f5 100%)'
      }}
    >
      {/* Top subtle badge */}
      <div className="pt-2 animate-fade-in flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-[#ff4c24] animate-ping" />
        <span className="text-[12px] font-medium tracking-wide text-slate-600 uppercase font-sans">
          Gourmet Delivery Experience
        </span>
      </div>

      {/* Main Luxury Center Card */}
      <div className="relative flex flex-col items-center max-w-sm w-full text-center">
        
        {/* Elegant Circular Progress with Logo Centerpiece */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
          
          {/* Subtle Glow Ring */}
          <div className="absolute inset-2 rounded-full bg-orange-500/10 blur-xl" />

          {/* SVG Circular Progress Track & Fill */}
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
            {/* Background Track */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              className="text-slate-100 stroke-current"
              strokeWidth="4"
              fill="transparent"
            />
            {/* Animated Progress Gradient Ring */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="url(#foodieGradient)"
              strokeWidth="4.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-150 ease-out"
            />
            <defs>
              <linearGradient id="foodieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#ff4c24" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>
          </svg>

          {/* Centerpiece: Refined Circular Foodie Emblem */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-[#ff4c24] to-amber-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/25 ring-4 ring-white transition-transform duration-300">
              <UtensilsCrossed className="w-8 h-8 stroke-[2.2] animate-cutlery-bob" />
            </div>
          </div>
        </div>

        {/* Brand Headline */}
        <div className="space-y-2 mb-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 font-sans flex items-center justify-center">
            Foodie<span className="text-[#ff4c24]">.</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            Delivering Culinary Excellence
          </p>
        </div>

        {/* Minimal dynamic caption with smooth pulse */}
        <div className="h-8 flex items-center justify-center">
          <p 
            key={currentStepIndex}
            className="text-xs font-medium text-slate-500 animate-fade-in flex items-center gap-2"
          >
            <ActiveStepIcon className="w-3.5 h-3.5 text-[#ff4c24]" />
            <span>{GOURMET_STEPS[currentStepIndex].label}</span>
          </p>
        </div>
      </div>

      {/* Footer Minimalist Tag */}
      <div className="pb-2 text-center text-slate-400 text-xs font-normal">
        <p>Premium flavors at your doorstep</p>
      </div>

    </div>
  )
}
export default CrazyLoadingScreen
