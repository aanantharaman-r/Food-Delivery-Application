import React, { useState, useEffect } from 'react'
import { Sparkles, Utensils, UtensilsCrossed, Flame, Bike, Heart } from 'lucide-react'

const FOOD_TIDBITS = [
  "Firing up the tandoor & preheating the ovens...",
  "Tossing fresh pizza dough in the air...",
  "Drizzling hot truffle glaze & melting the cheese...",
  "Routing the fastest delivery rider on GPS...",
  "Packaging warm bites in eco-friendly boxes...",
  "Plating gourmet goodness just for you..."
]

export const CrazyLoadingScreen = ({ 
  onComplete, 
  duration = 2600, 
  forceShow = false,
  showReplayButton = true
}) => {
  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [activeDish, setActiveDish] = useState(0)

  const dishes = ['🍔', '🍕', '🍜', '🍣', '🌮', '🍩', '🥑', '🍗']

  // Rotate fun food emojis
  useEffect(() => {
    const dishInterval = setInterval(() => {
      setActiveDish((prev) => (prev + 1) % dishes.length)
    }, 400)
    return () => clearInterval(dishInterval)
  }, [dishes.length])

  // Cycle through quirky food messages
  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % FOOD_TIDBITS.length)
    }, 750)
    return () => clearInterval(msgInterval)
  }, [])

  // Manage progress bar & exit animation
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
        }, 600) // smooth curtain fade duration
      }
    }, 30)

    return () => clearInterval(interval)
  }, [duration, onComplete])

  if (!isVisible && !forceShow) return null

  return (
    <div 
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 30%, #1e112a 0%, #0d0714 60%, #050208 100%)'
      }}
    >
      {/* Background glowing ambient light orbs */}
      <div className="absolute w-[450px] h-[450px] bg-gradient-to-tr from-[#ff4c24]/25 via-[#ff7844]/20 to-[#f59e0b]/15 rounded-full blur-[110px] animate-pulse pointer-events-none -top-12 -left-12" />
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-[#ec4899]/20 via-[#8b5cf6]/20 to-[#3b82f6]/10 rounded-full blur-[120px] pointer-events-none -bottom-16 -right-12 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Floating Sparkle Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/40 animate-ping"
            style={{
              top: `${(i * 19 + 7) % 95}%`,
              left: `${(i * 29 + 13) % 92}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              animationDuration: `${2 + (i % 3)}s`,
              animationDelay: `${(i * 0.25)}s`
            }}
          />
        ))}
      </div>

      {/* Main Center Stage */}
      <div className="relative flex flex-col items-center max-w-sm w-full px-6 text-center z-10">
        
        {/* Animated Sizzling Gourmet Wok / Frying Pan with Flying Ingredients */}
        <div className="relative w-44 h-44 flex items-center justify-center mb-6">
          
          {/* Outer Rotating Glowing Dash Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#ff4c24]/40 animate-spin" style={{ animationDuration: '10s' }} />
          <div className="absolute inset-2 rounded-full border border-orange-400/20 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
          
          {/* Inner Golden Aura */}
          <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-[#ff4c24] via-[#f59e0b] to-[#ec4899] opacity-30 blur-xl animate-pulse" />

          {/* Sizzling Sparks / Steam rise */}
          <div className="absolute -top-4 flex gap-2">
            <span className="w-1.5 h-4 bg-orange-300/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-6 bg-amber-300/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-4 bg-rose-400/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>

          {/* Center Crazy Flying Emojis Orbit / Pop */}
          <div className="relative z-10 w-28 h-28 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/20 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center group overflow-hidden">
            <span 
              key={activeDish}
              className="text-5xl transform transition-transform duration-300 animate-bounce select-none filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
            >
              {dishes[activeDish]}
            </span>

            {/* Micro flame badges */}
            <div className="absolute bottom-1 flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-amber-300/90 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
              <Flame className="w-3 h-3 text-orange-500 fill-orange-500 animate-pulse" /> Sizzling
            </div>
          </div>

          {/* Satellite Orbiting Mini Food badges */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-xl drop-shadow">🌶️</span>
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '5s', animationDirection: 'reverse' }}>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 text-xl drop-shadow">🧀</span>
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s' }}>
            <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 text-xl drop-shadow">🍟</span>
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '7s', animationDirection: 'reverse' }}>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 text-xl drop-shadow">🍕</span>
          </div>
        </div>

        {/* Brand Title with Official Foodie Logo & Glow */}
        <div className="space-y-2.5 mb-5 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-orange-300 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Master Chefs At Work</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            {/* Foodie App Logo Badge */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#ff4c24] via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/40 ring-2 ring-white/20 animate-pulse">
              <UtensilsCrossed className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center">
              <span>Foodie</span>
              <span className="text-[#ff4c24] animate-pulse">.</span>
            </h2>
          </div>
        </div>

        {/* Dynamic cycling whimsical food quote */}
        <div className="h-10 flex items-center justify-center mb-6 px-2">
          <p 
            key={messageIndex}
            className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide transition-all duration-300 animate-fade-in line-clamp-1"
          >
            {FOOD_TIDBITS[messageIndex]}
          </p>
        </div>

        {/* Turbo Progress Bar with Speeding Scooter Rider on top */}
        <div className="w-full relative py-3">
          {/* Moving delivery scooter on top of the bar */}
          <div 
            className="absolute top-0 transition-all duration-150 ease-out flex items-center -translate-x-1/2"
            style={{ left: `${Math.max(6, Math.min(progress, 94))}%` }}
          >
            <div className="relative">
              <div className="bg-[#ff4c24] text-white p-1 rounded-full shadow-lg shadow-orange-500/50 transform -scale-x-100 flex items-center justify-center">
                <Bike className="w-4 h-4 animate-bounce" />
              </div>
              {/* Exhaust puffs */}
              <div className="absolute -right-2 top-2 flex gap-0.5">
                <span className="w-1 h-1 bg-white/60 rounded-full animate-ping" />
              </div>
            </div>
          </div>

          {/* Track */}
          <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10 backdrop-blur-sm shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-[#ff4c24] rounded-full transition-all duration-150 ease-out relative shadow-[0_0_12px_rgba(255,76,36,0.8)]"
              style={{ width: `${progress}%` }}
            >
              {/* Glossy light streak across the bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Progress Numbers & ETA */}
        <div className="w-full flex justify-between items-center text-xs font-semibold text-slate-400 pt-1">
          <span className="flex items-center gap-1 text-orange-400">
            <Utensils className="w-3 h-3" /> Preparing Fresh Flavours
          </span>
          <span className="font-mono text-white/90 bg-white/10 px-2 py-0.5 rounded text-[11px] border border-white/5">
            {progress}%
          </span>
        </div>

      </div>

      {/* Footer subtle tag */}
      <div className="absolute bottom-6 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
        <span>Handcrafted with</span>
        <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
        <span>for food lovers everywhere</span>
      </div>
    </div>
  )
}
export default CrazyLoadingScreen
