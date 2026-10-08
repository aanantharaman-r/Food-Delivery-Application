import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CATEGORIES, FOOD_ITEMS } from '../data/mockData'
import { FoodCard } from '../components/FoodCard'
import { CategoryFilter } from '../components/CategoryFilter'

export const Home = () => {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')

  // Filter foods by selected category
  const filteredFoods = activeCategory === 'all'
    ? FOOD_ITEMS
    : FOOD_ITEMS.filter(f => f.category === activeCategory)

  const handleCategorySelect = (catId) => {
    setActiveCategory(prev => prev === catId ? 'all' : catId)
  }

  const scrollToMenu = () => {
    const el = document.getElementById('explore-menu')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        
        {/* 1. Hero Banner: Tomato style orange banner with food imagery, heading, description and View Menu button */}
        <section className="relative rounded-3xl overflow-hidden shadow-sm bg-gradient-to-r from-[#ff4c24] via-[#ff5b36] to-[#ff6b47] min-h-[360px] sm:min-h-[460px] md:min-h-[500px] flex items-center">
          {/* Subtle background food illustration or photography overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-right md:bg-center opacity-30 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')`
            }}
          />

          {/* Right side floating dish visual for desktop */}
          <div className="hidden lg:block absolute right-8 -bottom-10 w-[420px] h-[420px] pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" 
              alt="Delightful food dish"
              className="w-full h-full object-cover rounded-full shadow-2xl ring-8 ring-white/20 animate-spin-slow"
              style={{ animationDuration: '60s' }}
            />
          </div>

          <div className="relative z-10 px-6 sm:px-12 md:px-16 py-12 max-w-2xl text-white space-y-5">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Order your <br />
              favourite food here
            </h1>
            
            <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed font-normal max-w-xl">
              Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
            </p>

            <div className="pt-2">
              <button
                onClick={scrollToMenu}
                className="bg-white hover:bg-slate-100 text-[#49557e] hover:text-[#ff4c24] font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg transition-all duration-300 cursor-pointer active:scale-95"
              >
                View Menu
              </button>
            </div>
          </div>
        </section>


        {/* 2. Explore our menu Section */}
        <section id="explore-menu" className="space-y-6 pt-4">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              Explore our menu
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
            </p>
          </div>

          {/* Circular Category items */}
          <CategoryFilter
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={handleCategorySelect}
          />
        </section>


        {/* Horizontal Divider */}
        <hr className="border-t border-slate-200" />


        {/* 3. Top dishes near you Section (4-column grid like reference) */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              Top dishes near you
            </h2>
            {activeCategory !== 'all' && (
              <button
                onClick={() => setActiveCategory('all')}
                className="text-xs sm:text-sm text-[#ff4c24] font-semibold hover:underline cursor-pointer"
              >
                Clear filter (Show all)
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </section>


        {/* 4. Download App Banner Section */}
        <section id="download-app" className="py-12 text-center space-y-8">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 leading-tight">
              For Better Experience Download <br />
              <span className="text-[#ff4c24]">Tomato App</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Google Play Store Badge */}
            <div className="cursor-pointer hover:scale-105 transition-transform bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-md border border-slate-800">
              <svg className="w-6 h-6 fill-current text-emerald-400" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.793 12 3.61 22.186c-.37-.428-.61-.994-.61-1.63V3.444c0-.636.24-1.202.61-1.63zm11.248 11.25l2.484 2.483-11.455 6.467 8.971-8.95zm0-2.128L5.887 1.986l11.454 6.467-2.484 2.483zm1.488 1.064l3.86 2.18c.954.54.954 1.42 0 1.96l-3.86 2.18-2.128-2.128 2.128-2.192z"/>
              </svg>
              <div className="text-left leading-tight">
                <p className="text-[9px] uppercase font-semibold text-slate-400">GET IT ON</p>
                <p className="text-sm font-bold text-white">Google Play</p>
              </div>
            </div>

            {/* Apple App Store Badge */}
            <div className="cursor-pointer hover:scale-105 transition-transform bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-md border border-slate-800">
              <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.35-.58.67-1.08 1.74-0.95 2.77.99.08 2.05-0.52 2.68-1.27z"/>
              </svg>
              <div className="text-left leading-tight">
                <p className="text-[9px] uppercase font-semibold text-slate-400">Download on the</p>
                <p className="text-sm font-bold text-white">App Store</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default Home