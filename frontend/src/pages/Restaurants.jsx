import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Sparkles, Star, RefreshCw } from 'lucide-react'
import { RESTAURANTS } from '../data/mockData'
import { RestaurantCard } from '../components/RestaurantCard'
import { CategoryFilter } from '../components/CategoryFilter'

const API_BASE = 'http://localhost:5000/api'

export const Restaurants = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'
  
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('rating') // 'rating' | 'delivery'
  const [vegOnly, setVegOnly] = useState(false)
  const [categories, setCategories] = useState([])
  const [loadingCats, setLoadingCats] = useState(true)

  // Fetch real categories from MongoDB backend
  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoadingCats(true)
        const res = await fetch(`${API_BASE}/categories`)
        const data = await res.json()
        if (data.success && Array.isArray(data.categories)) {
          setCategories([
            {
              id: 'all',
              name: 'All Cuisines',
              image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
            },
            ...data.categories.map(c => ({
              id: c._id,
              name: c.name,
              image: c.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
            }))
          ])
        }
      } catch (err) {
        console.error('Failed to load categories:', err)
      } finally {
        setLoadingCats(false)
      }
    }

    fetchCats()
  }, [])

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId)
    if (catId === 'all') {
      searchParams.delete('category')
      setSearchParams(searchParams)
    } else {
      setSearchParams({ category: catId })
    }
  }

  // Filter logic: resolve category name if matching by MongoDB ID or name
  const selectedCatObj = categories.find(c => c.id === activeCategory)
  const selectedCatName = selectedCatObj ? selectedCatObj.name.toLowerCase() : activeCategory.toLowerCase()

  let filtered = RESTAURANTS.filter(r => {
    const rCat = r.category?.toLowerCase() || ''
    const matchesCategory = activeCategory === 'all' || 
      rCat === selectedCatName || 
      selectedCatName.includes(rCat) || 
      rCat.includes(selectedCatName)

    const matchesSearch = !searchQuery.trim() || 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesVeg = !vegOnly || r.pureVeg
    return matchesCategory && matchesSearch && matchesVeg
  })

  // Sort logic
  if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title & Live Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              All Partner Restaurants
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing top gourmet and cloud kitchens delivering to your zone
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by restaurant or cuisine name..."
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-sm focus:border-orange-500 focus:outline-none shadow-xs"
            />
          </div>
        </div>

        {/* Category Filter Chips from MongoDB */}
        {categories.length > 0 && (
          <div>
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        )}

        {/* Filter Controls Bar (Veg-Only, Sort by rating) */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                vegOnly
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Pure Veg Only
            </button>

            <span className="text-xs text-slate-400">
              Found <strong className="text-slate-800">{filtered.length}</strong> restaurants
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="rating">Highest Rated ★</option>
              <option value="delivery">Fastest Delivery ⚡</option>
            </select>
          </div>
        </div>

        {/* Restaurant Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 max-w-md mx-auto">
            <p className="text-slate-800 font-bold mb-1">No restaurants match your filters</p>
            <p className="text-xs text-slate-400 mb-4">Try clearing your filters or search terms.</p>
            <button
              onClick={() => {
                setActiveCategory('all')
                setSearchQuery('')
                setVegOnly(false)
              }}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold cursor-pointer transition"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Restaurants
