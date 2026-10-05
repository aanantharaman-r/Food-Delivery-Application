import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Flame, 
  Star,
  ChevronRight
} from 'lucide-react'
import { CATEGORIES, RESTAURANTS, FOOD_ITEMS } from '../data/mockData'
import { RestaurantCard } from '../components/RestaurantCard'
import { FoodCard } from '../components/FoodCard'
import { CategoryFilter } from '../components/CategoryFilter'
import { OffersBanner } from '../components/OffersBanner'

export const Home = () => {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchVal, setSearchVal] = useState('')

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`)
    }
  }

  // Filter foods by category if chosen
  const filteredFoods = activeCategory === 'all'
    ? FOOD_ITEMS
    : FOOD_ITEMS.filter(f => f.category === activeCategory)

  // Filter restaurants by category if chosen
  const filteredRestaurants = activeCategory === 'all'
    ? RESTAURANTS
    : RESTAURANTS.filter(r => r.category === activeCategory)

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/80 via-white to-slate-50 pt-8 pb-16 md:pt-16 md:pb-24 border-b border-orange-100/40">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 -ml-20 w-80 h-80 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200/60 text-orange-700 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The #1 Food Delivery Experience in Town</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Crave it? <br className="hidden sm:inline" />
                We <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-rose-500 bg-clip-text text-transparent">deliver it</span> warm & fast.
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Explore hand-crafted sourdough pizzas, sizzling Angus smash burgers, slow-cooked Hyderabadi biryanis, and Tokyo artisan ramen.
              </p>

              {/* Search Bar Input */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0">
                <div className="p-2 bg-white rounded-3xl shadow-xl shadow-orange-500/5 border border-slate-200/80 flex items-center gap-2">
                  <div className="pl-3 text-slate-400">
                    <Search className="w-5 h-5 text-orange-500" />
                  </div>
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search dishes, groceries, or restaurants..."
                    className="w-full py-2.5 px-2 text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-orange-500/20 shrink-0"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Highlights row */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">✓</div>
                  <span>Free delivery on first 3 orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">⚡</div>
                  <span>Average 28 min delivery time</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Graphic Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
                    alt="Delicious Spread"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Chef Recommendation</span>
                    <h3 className="text-xl font-bold">Signature Flame Grill & Gourmet Pizza</h3>
                    <p className="text-xs text-white/80 mt-1">Starting from just ₹11.99</p>
                  </div>
                </div>

                {/* Floating Rating Pill */}
                <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce duration-1000">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                    <Star className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-slate-900">4.9 / 5.0</span>
                    <p className="text-[10px] text-slate-400">10k+ Happy Foodies</p>
                  </div>
                </div>

                {/* Floating Speedy Delivery Pill */}
                <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-slate-900">Under 30 Min</span>
                    <p className="text-[10px] text-slate-400">Fast doorstep drop</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Promotional Offers & Deals Banner */}
        <OffersBanner />

        {/* Categories Bar */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Explore Cuisines & Categories
              </h2>
              <p className="text-xs text-slate-500">Pick whatever tempts your taste buds</p>
            </div>
          </div>
          <CategoryFilter
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={(catId) => setActiveCategory(catId)}
          />
        </section>

        {/* Popular Restaurants Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Featured & Top-Rated Restaurants
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">Handpicked dining spots with verified customer reviews</p>
            </div>
            <button
              onClick={() => navigate('/restaurants')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 hover:underline"
            >
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </section>

        {/* Popular Dishes / Foods Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
                  <Flame className="w-4 h-4" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Trending Popular Dishes
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">Most ordered delicacies right now in your city</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </section>

      </main>

    </div>
  )
}

export default Home