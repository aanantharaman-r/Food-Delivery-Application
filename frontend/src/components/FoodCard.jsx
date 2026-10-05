import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Star, Flame, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useToast } from './Toast'

export const FoodCard = ({ food }) => {
  const { items, addItem, increaseQuantity, decreaseQuantity } = useCart()
  const { showToast } = useToast()

  const cartEntry = items.find(i => i.food.id === food.id)
  const quantity = cartEntry ? cartEntry.quantity : 0

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(food)
    showToast({
      title: 'Added to cart',
      description: `${food.name} was added.`,
      variant: 'success'
    })
  }

  const handleIncrease = (e) => {
    e.preventDefault()
    e.stopPropagation()
    increaseQuantity(food.id)
  }

  const handleDecrease = (e) => {
    e.preventDefault()
    e.stopPropagation()
    decreaseQuantity(food.id)
  }

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-orange-200/70 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Food Image & Tags */}
      <Link to={`/food/${food.id}`} className="relative aspect-[4/3] overflow-hidden bg-slate-100 block">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`w-5 h-5 rounded-md flex items-center justify-center bg-white/95 backdrop-blur-md shadow-xs border ${
            food.isVeg ? 'border-emerald-500' : 'border-rose-500'
          }`}>
            <span className={`w-2 h-2 rounded-full ${food.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </span>

          {food.isBestseller && (
            <span className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Flame className="w-2.5 h-2.5" /> Best Seller
            </span>
          )}
        </div>

        {/* Rating Floating Tag */}
        <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>{food.rating}</span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-semibold text-orange-600 uppercase tracking-wider mb-1">
            {food.restaurantName}
          </div>
          <Link to={`/food/${food.id}`} className="block">
            <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1 text-base">
              {food.name}
            </h4>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Price & Add to Cart Controls */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-slate-400">Price</span>
            <span className="text-lg font-black text-slate-900">
              ₹{food.price.toFixed(2)}
            </span>
          </div>

          {quantity > 0 ? (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-2xl p-1 shadow-xs">
              <button
                onClick={handleDecrease}
                className="w-7 h-7 rounded-xl bg-white text-orange-600 font-bold flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors shadow-xs text-sm"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="text-xs font-bold text-orange-700 min-w-4 text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="w-7 h-7 rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center hover:bg-orange-700 transition-colors shadow-xs text-sm"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold shadow-sm transition-all duration-200 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FoodCard