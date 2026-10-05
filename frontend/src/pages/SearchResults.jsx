import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Sparkles, Utensils, Store } from 'lucide-react'
import { FOOD_ITEMS, RESTAURANTS } from '../data/mockData'
import { FoodCard } from '../components/FoodCard'
import { RestaurantCard } from '../components/RestaurantCard'

export const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchInput, setSearchInput] = useState(query)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() })
    }
  }

  const qLower = query.toLowerCase().trim()

  const matchedFoods = qLower
    ? FOOD_ITEMS.filter(f =>
        f.name.toLowerCase().includes(qLower) ||
        f.description.toLowerCase().includes(qLower) ||
        f.category.toLowerCase().includes(qLower)
      )
    : []

  const matchedRestaurants = qLower
    ? RESTAURANTS.filter(r =>
        r.name.toLowerCase().includes(qLower) ||
        r.cuisine.toLowerCase().includes(qLower) ||
        r.category.toLowerCase().includes(qLower)
      )
    : []

  const totalResults = matchedFoods.length + matchedRestaurants.length

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search header & input */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Search Food & Restaurants
          </h1>
          
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-5 h-5 text-orange-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for 'Truffle', 'Pizza', 'Biryani', 'Burger'..."
              className="w-full pl-12 pr-28 py-3.5 bg-white rounded-full border border-slate-200 text-sm focus:border-orange-500 focus:outline-none shadow-md shadow-orange-500/5"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-full text-xs font-bold transition-colors"
            >
              Search
            </button>
          </form>

          {query && (
            <p className="text-xs text-slate-500">
              Showing {totalResults} results for <strong className="text-orange-600 font-bold">"{query}"</strong>
            </p>
          )}
        </div>

        {query && totalResults === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-100 shadow-xs">
            <p className="text-slate-800 font-bold text-lg mb-1">No Results Found</p>
            <p className="text-xs text-slate-400 mb-6">We couldn't find any dish or kitchen matching "{query}".</p>
            <Link
              to="/restaurants"
              className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Browse All Restaurants
            </Link>
          </div>
        )}

        {/* Matched Dishes */}
        {matchedFoods.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Utensils className="w-4 h-4 text-orange-600" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Dishes ({matchedFoods.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {matchedFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          </div>
        )}

        {/* Matched Restaurants */}
        {matchedRestaurants.length > 0 && (
          <div className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Store className="w-4 h-4 text-orange-600" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Restaurants ({matchedRestaurants.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedRestaurants.map((res) => (
                <RestaurantCard key={res.id} restaurant={res} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default SearchResults