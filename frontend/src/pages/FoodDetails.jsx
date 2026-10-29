import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  Star, 
  Clock, 
  Flame, 
  ChevronLeft, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Share2, 
  ShieldCheck, 
  ShoppingBag,
  Sparkles,
  Ban,
  RefreshCw
} from 'lucide-react'
import { RESTAURANTS } from '../data/mockData'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'
import { FoodCard } from '../components/FoodCard'

const API_BASE = 'http://localhost:5000/api'

export const FoodDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [quantity, setQuantity] = useState(1)

  const [food, setFood] = useState(null)
  const [relatedFoods, setRelatedFoods] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/foods/${id}`)
        const data = await res.json()

        if (data.success && data.food) {
          setFood(data.food)

          // Fetch related foods in same category
          const catId = data.food.category?._id || data.food.category
          if (catId) {
            const relRes = await fetch(`${API_BASE}/foods?category=${catId}`)
            const relData = await relRes.json()
            if (relData.success) {
              setRelatedFoods(
                (relData.foods || []).filter((f) => f._id !== data.food._id).slice(0, 4)
              )
            }
          }
        }
      } catch (err) {
        console.error('Failed to load food details:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchFoodDetails()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-slate-400">
        <RefreshCw size={32} className="animate-spin text-orange-500 mb-3" />
        <p className="font-semibold text-sm">Loading dish details...</p>
      </div>
    )
  }

  if (!food) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Food item not found</h2>
        <p className="text-xs text-slate-400 mb-6">This item may have been removed or is unavailable.</p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-full bg-orange-600 text-white font-bold text-xs"
        >
          Return to Menu
        </Link>
      </div>
    )
  }

  const isAvailable = food.isAvailable !== false
  const categoryName = typeof food.category === 'object' ? food.category?.name : 'Dishes'

  const handleAddToCart = () => {
    if (!isAvailable) {
      showToast({
        title: 'Item Unavailable',
        description: `${food.name} is currently out of stock.`,
        variant: 'destructive'
      })
      return
    }
    addItem(food, quantity)
    showToast({
      title: 'Added to cart!',
      description: `${quantity}x ${food.name} added.`,
      variant: 'success'
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-500">{categoryName}</span>
          <span>/</span>
          <span className="text-slate-900 truncate max-w-xs">{food.name}</span>
        </div>

        {/* Food Hero Showcase Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Big Picture Image */}
            <div className="lg:col-span-6 relative aspect-square lg:aspect-auto overflow-hidden bg-slate-100 min-h-[350px]">
              <img
                src={food.image}
                alt={food.name}
                className={`w-full h-full object-cover ${!isAvailable ? 'grayscale-[50%]' : ''}`}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
                }}
              />

              {!isAvailable && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-xs text-white text-xs font-bold shadow-md">
                  <Ban size={14} className="text-rose-400" />
                  <span>Currently Out of Stock</span>
                </div>
              )}
            </div>

            {/* Right Food Information and Customization */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2 inline-block">
                  {categoryName}
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                  {food.name}
                </h1>

                {/* Rating & Reviews Count */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-slate-800">{food.rating || 4.8}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Customer Favorite</span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {food.description || 'Delicious meal prepared with fresh ingredients and authentic flavor.'}
                </p>

                {/* Price Display */}
                <div className="mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Price
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-[#ff4c24]">
                      ₹{food.price}
                    </span>
                    <span className="text-xs text-slate-400">Inclusive of all taxes</span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
                {isAvailable ? (
                  <>
                    <div className="flex items-center gap-3 bg-slate-100 rounded-2xl p-1.5">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-9 h-9 rounded-xl bg-white text-slate-700 flex items-center justify-center hover:bg-slate-200 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-slate-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-9 h-9 rounded-xl bg-white text-slate-700 flex items-center justify-center hover:bg-slate-200 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="flex-1 w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-8 rounded-2xl bg-[#ff4c24] hover:bg-[#e03f1b] text-white font-bold text-sm shadow-lg shadow-orange-200 active:scale-95 transition"
                    >
                      <ShoppingBag size={18} />
                      <span>Add to Cart (₹{food.price * quantity})</span>
                    </button>
                  </>
                ) : (
                  <div className="w-full p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center justify-center gap-2">
                    <Ban size={18} />
                    <span>This dish is currently unavailable for ordering.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Dishes */}
        {relatedFoods.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800">You might also like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedFoods.map((item) => (
                <FoodCard key={item._id} food={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodDetails
