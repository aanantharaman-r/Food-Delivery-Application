import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Share2, 
  Heart, 
  Sparkles,
  ChevronLeft
} from 'lucide-react'
import { RESTAURANTS, FOOD_ITEMS } from '../data/mockData'
import { FoodCard } from '../components/FoodCard'
import { ReviewsSection } from '../components/ReviewsSection'
import { useToast } from '../components/Toast'

export const RestaurantDetails = () => {
  const { id } = useParams()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('menu') // 'menu' | 'reviews' | 'about'
  const [isLiked, setIsLiked] = useState(false)

  // Find restaurant or fallback to first
  const restaurantId = parseInt(id, 10)
  const restaurant = RESTAURANTS.find(r => r.id === restaurantId) || RESTAURANTS[0]
  
  // Find foods belonging to this restaurant
  const foods = FOOD_ITEMS.filter(f => f.restaurantId === restaurant.id)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: `Order from ${restaurant.name} on Foodie!`,
        url: window.location.href
      }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(window.location.href)
      showToast({ title: 'Link Copied', description: 'Restaurant link copied to clipboard', variant: 'success' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Restaurant Header Banner */}
      <div className="relative bg-slate-900 text-white">
        <div className="h-64 sm:h-80 w-full overflow-hidden relative">
          <img
            src={restaurant.banner || restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Back Link & Quick Actions */}
        <div className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-10">
          <Link
            to="/restaurants"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-bold hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Restaurants
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsLiked(!isLiked)
                showToast({
                  title: isLiked ? 'Removed' : 'Saved!',
                  description: isLiked ? 'Removed from favorites' : 'Added to your favorites',
                  variant: 'info'
                })
              }}
              className={`p-2.5 rounded-full backdrop-blur-md transition-colors ${
                isLiked ? 'bg-rose-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Restaurant Header Card Floating */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 text-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {restaurant.category.toUpperCase()}
                  </span>
                  {restaurant.featured && (
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured Partner
                    </span>
                  )}
                  {restaurant.offer && (
                    <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {restaurant.offer}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {restaurant.name}
                </h1>
                <p className="text-sm text-slate-500 mt-1">{restaurant.cuisine}</p>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{restaurant.address}</span>
                </div>
              </div>

              {/* Right Rating Big Badge */}
              <div className="flex items-center md:flex-col items-start md:items-end gap-3 shrink-0">
                <div className="flex items-center gap-1.5 bg-emerald-500 text-white px-3.5 py-1.5 rounded-2xl shadow-md shadow-emerald-500/20">
                  <Star className="w-4 h-4 fill-white" />
                  <span className="text-base font-black">{restaurant.rating}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-700">{restaurant.ratingCount} Ratings</p>
                  <p className="text-[11px] text-slate-400">Verified Orders</p>
                </div>
              </div>

            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center">
              <div className="p-3 rounded-2xl bg-slate-50">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Delivery Time</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{restaurant.deliveryTime}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Distance</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{restaurant.distance}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Price For Two</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{restaurant.priceForTwo}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Safety Standards</p>
                <p className="text-sm font-bold text-emerald-600 mt-0.5 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Sanitized
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Navigation Tabs (Menu | Reviews | About) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'menu'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Menu Items ({foods.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'reviews'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Ratings & Reviews
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'about'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            About Kitchen
          </button>
        </div>

        {/* Tab 1: Menu List */}
        {activeTab === 'menu' && (
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {foods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>

            {foods.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                <p className="text-slate-500 font-medium">No menu items found for this restaurant right now.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reviews Section */}
        {activeTab === 'reviews' && (
          <div className="mt-6">
            <ReviewsSection restaurantName={restaurant.name} />
          </div>
        )}

        {/* Tab 3: About Kitchen */}
        {activeTab === 'about' && (
          <div className="mt-6 bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Our Culinary Story</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{restaurant.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="space-y-2">
                <p className="font-bold text-slate-800">Operational Address</p>
                <p className="text-slate-500">{restaurant.address}</p>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-slate-800">Cuisine Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {restaurant.tags?.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}

export default RestaurantDetails