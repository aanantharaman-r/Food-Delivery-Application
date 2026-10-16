import React, { useState, useEffect } from 'react'
import { Sparkles, Check } from 'lucide-react'

// Layers for the burger stacking animation
const BURGER_LAYERS = [
  { id: 'bottom-bun', name: 'Toasted Brioche Bun', emoji: '🍞', color: 'bg-amber-600', height: 'h-4', width: 'w-28', rounded: 'rounded-b-2xl' },
  { id: 'lettuce', name: 'Crispy Romaine Lettuce', emoji: '🥬', color: 'bg-emerald-500', height: 'h-2.5', width: 'w-30', rounded: 'rounded-md' },
  { id: 'patty', name: 'Smash Grilled Patty', emoji: '🥩', color: 'bg-amber-950', height: 'h-4', width: 'w-28', rounded: 'rounded-lg' },
  { id: 'cheese', name: 'Melted Cheddar Slice', emoji: '🧀', color: 'bg-yellow-400', height: 'h-2', width: 'w-29', rounded: 'rounded-sm' },
  { id: 'tomato', name: 'Ripe Vine Tomatoes', emoji: '🍅', color: 'bg-rose-500', height: 'h-2.5', width: 'w-27', rounded: 'rounded-md' },
  { id: 'top-bun', name: 'Sesame Top Crown', emoji: '🍔', color: 'bg-amber-500', height: 'h-7', width: 'w-28', rounded: 'rounded-t-3xl' }
]

export const CrazyLoadingScreen = ({ 
  onComplete, 
  duration = 2400, 
  forceShow = false 
}) => {
  const [activeLayers, setActiveLayers] = useState([])
  const [currentStepText, setCurrentStepText] = useState('Heating up the grill...')
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isAssembled, setIsAssembled] = useState(false)

  // Stepwise drop of each layer
  useEffect(() => {
    BURGER_LAYERS.forEach((layer, index) => {
      setTimeout(() => {
        setActiveLayers((prev) => [...prev, layer.id])
        setCurrentStepText(`Stacking: ${layer.name}`)
      }, 250 + index * 260)
    })

    // Finished assembling trigger
    const finishTimeout = setTimeout(() => {
      setIsAssembled(true)
      setCurrentStepText('Fresh & ready to serve!')
    }, 250 + BURGER_LAYERS.length * 260)

    return () => clearTimeout(finishTimeout)
  }, [])

  // Manage progress bar & exit timing
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
        }, 500)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [duration, onComplete])

  if (!isVisible && !forceShow) return null

  return (
    <div 
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between py-12 px-6 transition-all duration-500 ease-in-out ${
        isFadingOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 40%, #ffffff 0%, #fef3ef 55%, #fed7aa 120%)'
      }}
    >
      {/* Top Brand Pill */}
      <div className="pt-2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-orange-200/80 shadow-xs backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-[#ff4c24] animate-spin" style={{ animationDuration: '4s' }} />
        <span className="text-xs font-bold text-slate-800 tracking-wide font-sans">
          Foodie Kitchen Express
        </span>
      </div>

      {/* Center Stage: Mid-Air Falling Burger Stack */}
      <div className="flex flex-col items-center justify-center relative w-full max-w-xs">
        
        {/* Glow & plate shadow beneath burger */}
        <div className={`w-36 h-6 bg-slate-400/20 rounded-full blur-md mb-2 transition-all duration-300 ${isAssembled ? 'scale-110 opacity-70' : 'scale-90 opacity-40'}`} />

        {/* Burger Assembly Container */}
        <div className={`relative flex flex-col-reverse items-center justify-end h-56 w-44 transition-transform duration-300 ${isAssembled ? 'animate-bounce' : ''}`}>
          {BURGER_LAYERS.map((layer) => {
            const isDropped = activeLayers.includes(layer.id)

            return (
              <div
                key={layer.id}
                className={`transition-all duration-400 ease-out flex items-center justify-center shadow-xs my-0.5 ${layer.height} ${layer.width} ${layer.rounded} ${layer.color} ${
                  isDropped 
                    ? 'translate-y-0 opacity-100 scale-100' 
                    : '-translate-y-24 opacity-0 scale-125'
                }`}
                style={{
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.12), 0 2px 4px -2px rgba(0, 0, 0, 0.08)'
                }}
              >
                {/* Special details for top bun: Sesame dots */}
                {layer.id === 'top-bun' && isDropped && (
                  <div className="flex gap-2 text-[9px] opacity-80 select-none pb-1">
                    <span>•</span><span>•</span><span>•</span><span>•</span><span>•</span>
                  </div>
                )}
                {/* Cheese melt corner drip */}
                {layer.id === 'cheese' && isDropped && (
                  <div className="absolute -bottom-1.5 left-5 w-3 h-3 bg-yellow-400 rotate-45 rounded-xs" />
                )}
              </div>
            )
          })}
        </div>

        {/* Brand Headline */}
        <div className="mt-8 text-center space-y-1">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans">
            Foodie<span className="text-[#ff4c24]">.</span>
          </h2>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest h-4">
            {currentStepText}
          </p>
        </div>

        {/* Sleek Progress Bar */}
        <div className="w-56 mt-6">
          <div className="w-full bg-orange-100/80 h-2 rounded-full overflow-hidden p-0.5 border border-orange-200/50">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-[#ff4c24] rounded-full transition-all duration-150 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 mt-1.5">
            <span>Freshly Stacked</span>
            <span className="font-mono text-slate-700">{progress}%</span>
          </div>
        </div>

      </div>

      {/* Footer text */}
      <div className="pb-2 text-center text-xs font-medium text-slate-400">
        Crafting your cravings with love
      </div>
    </div>
  )
}
export default CrazyLoadingScreen
