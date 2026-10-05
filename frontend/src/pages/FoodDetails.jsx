import React, { useState } from 'react'
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
  Sparkles
} from 'lucide-react'
import { FOOD_ITEMS, RESTAURANTS } from '../data/mockData'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'
import { FoodCard } from '../components/FoodCard'

export const FoodDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { items, addItem } = useCart()
  const { showToast } = useToast()
  const [quantity, setQuantity] = useState(1)

  const foodId = parseInt(id, 10)
  const food = FOOD_ITEMS.find(f => f.id === foodId) || FOOD_ITEMS[0]
  const restaurant = RESTAURANTS.find(r => r.id === food.restaurantId)

  // Related foods in the same category
  const relatedFoods = FOOD_ITEMS.filter(f => f.category === food.category && f.id !== food.id)

  const handleAddToCart = () => {
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
          <Link to={`/restaurant/${food.restaurantId}`} className="hover:text-orange-600 transition-colors">
            {food.restaurantName}
          </Link>
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
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center bg-white shadow-md border ${
                  food.isVeg ? 'border-emerald-500' : 'border-rose-500'
                }`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${food.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </span>

                {food.isBestseller && (
                  <span className="bg-amber-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> Bestseller
                  </span>
                )}
              </div>
            </div>

            {/* Right Food Information and Customization */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <Link
                  to={`/restaurant/${food.restaurantId}`}
                  className="text-xs font-bold uppercase tracking-wider text-orange-600 hover:underline mb-2 inline-block"
                >
                  {food.restaurantName}
                </Link>

                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                  {food.name}
                </h1>

                {/* Rating & Reviews Count */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full text-xs font-bold text-amber-800">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{food.rating}</span>
                  </div>
                  <span className="text-xs text-slate-400">({food.reviewsCount} food reviews)</span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-black text-slate-900">
                    ${food.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">inclusive of all taxes</span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {food.description}
                </p>

                {/* Nutrition and Prep Info Badges */}
                <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Calories</span>
                    <strong className="text-slate-800 font-bold">{food.calories || '550 kcal'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Prep Time</span>
                    <strong className="text-slate-800 font-bold">{food.prepTime || '15 mins'}</strong>
                  </div>
                </div>

                {/* Ingredients List */}
                {food.ingredients && (
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Key Ingredients
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {food.ingredients.map((ing) => (
                        <span key={ing} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Quantity Counter & Add To Cart */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex items-center justify-between sm:justify-start gap-3 bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-xl bg-white text-slate-700 font-bold flex items-center justify-center hover:bg-slate-200 transition-colors shadow-xs"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center hover:bg-orange-700 transition-colors shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart • ${(food.price * quantity).toFixed(2)}
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Related Culinary Picks */}
        {relatedFoods.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-6">
              You Might Also Crave
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedFoods.slice(0, 4).map((f) => (
                <FoodCard key={f.id} food={f} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default FoodDetails
