import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Sparkles, Utensils, Store, RefreshCw } from 'lucide-react'
import { RESTAURANTS } from '../data/mockData'
import { FoodCard } from '../components/FoodCard'
import { RestaurantCard } from '../components/RestaurantCard'

const API_BASE = 'http://localhost:5000/api'

export const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchInput, setSearchInput] = useState(query)
  const [dbFoods, setDbFoods] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch foods matching query from backend
  useEffect(() => {
    const fetchSearchFoods = async () => {
      try {
        setLoading(true)
        const url = query
          ? `${API_BASE}/foods?search=${encodeURIComponent(query)}&includeUnavailable=true`
          : `${API_BASE}/foods?includeUnavailable=true`
        const res = await fetch(url)
        const data = await res.json()
        if (data.success) {
          setDbFoods(data.foods || [])
        }
      } catch (err) {
        console.error('Failed to search foods:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSearchFoods()
  }, [query])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() })
    }
  }

  const qLower = query.toLowerCase().trim()

  const matchedRestaurants = qLower
    ? RESTAURANTS.filter(
        (r) =>
          r.name.toLowerCase().includes(qLower) ||
          r.cuisine.toLowerCase().includes(qLower) ||
          r.category.toLowerCase().includes(qLower)
      )
    : []

  const totalResults = dbFoods.length + matchedRestaurants.length

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search header & input */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Search Food & Restaurants
          </h1>

          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for burgers, pizza, sushi, salads..."
              className="w-full pl-12 pr-28 py-4 bg-white rounded-3xl border border-slate-200 shadow-md text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff4c24]"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-[#ff4c24] hover:bg-[#e03a14] text-white font-bold text-xs rounded-2xl shadow-sm transition-all"
            >
              Search
            </button>
          </form>

          {query && (
            <p className="text-xs text-slate-500">
              Showing {totalResults} result{totalResults === 1 ? '' : 's'} for{' '}
              <span className="font-bold text-slate-800">"{query}"</span>
            </p>
          )}
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-400 space-y-3">
            <RefreshCw size={28} className="animate-spin mx-auto text-[#ff4c24]" />
            <p className="text-sm font-semibold">Searching menu items...</p>
          </div>
        ) : !query ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-100 shadow-xl">
            <Sparkles className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">Craving Something Delicious?</h3>
            <p className="text-xs text-slate-500 mb-6">
              Enter any dish name, cuisine, or restaurant to see live suggestions.
            </p>
          </div>
        ) : totalResults === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-100 shadow-xl">
            <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No matches found</h3>
            <p className="text-xs text-slate-500 mb-6">
              We couldn't find anything matching "{query}". Try checking for spelling or search for popular items like Burgers or Biryani.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2.5 bg-[#ff4c24] text-white font-bold text-xs rounded-full shadow-md"
            >
              Back to Home Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Matching Dishes */}
            {dbFoods.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#ff4c24]" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Dishes ({dbFoods.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {dbFoods.map((food) => (
                    <FoodCard key={food._id} food={food} />
                  ))}
                </div>
              </div>
            )}

            {/* Matching Restaurants */}
            {matchedRestaurants.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#ff4c24]" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Restaurants ({matchedRestaurants.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedRestaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults
