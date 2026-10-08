import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Minus, Star } from 'lucide-react'
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
    <div className="w-full bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100/80 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl group">
      {/* Food Image Container */}
      <div className="relative w-full aspect-[4/3] bg-slate-50 overflow-hidden">
        <Link to={`/food/${food.id}`} className="block w-full h-full">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Counter / Add Button positioned at bottom-right corner of image */}
        <div className="absolute bottom-3 right-3 z-10">
          {quantity > 0 ? (
            <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-md border border-slate-100">
              <button
                onClick={handleDecrease}
                className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-200 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="text-xs font-bold text-slate-800 min-w-4 text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="w-8 h-8 rounded-full bg-white text-slate-800 hover:text-white hover:bg-[#ff4c24] flex items-center justify-center shadow-md border border-slate-100 transition-all active:scale-95 cursor-pointer"
              aria-label="Add to cart"
              title="Add to cart"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Food Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & 5-Star Rating row */}
          <div className="flex items-start justify-between gap-2">
            <Link to={`/food/${food.id}`} className="flex-1">
              <h4 className="font-bold text-[15px] sm:text-base text-slate-800 hover:text-[#ff4c24] transition-colors line-clamp-1">
                {food.name}
              </h4>
            </Link>
            {/* Tomato 5-star rating icon display */}
            <div className="flex items-center gap-0.5 shrink-0 mt-0.5" title={`Rated ${food.rating || 5} stars`}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 text-[#ff4c24] fill-[#ff4c24]"
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Price */}
        <div className="mt-3.5 pt-2 flex items-center justify-between">
          <span className="text-lg font-black text-[#ff4c24]">
            ${typeof food.price === 'number' ? food.price.toFixed(0) : food.price}
          </span>
          <span className="text-[11px] font-medium text-slate-400 capitalize">
            {food.category}
          </span>
        </div>
      </div>
    </div>
  )
}

export default FoodCard