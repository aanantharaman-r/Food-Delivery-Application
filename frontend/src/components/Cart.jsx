import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

export const Cart = () => {
  const { items, total, cartCount, removeItem, increaseQuantity, decreaseQuantity } = useCart()

  if (items.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-xs">
        <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-orange-50 text-orange-600 rounded-2xl">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">Your cart is empty</h3>
        <p className="text-xs text-slate-500 mb-4">Add tasty dishes from restaurants.</p>
        <Link
          to="/restaurants"
          className="inline-block bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-500 transition-colors shadow-xs"
        >
          Browse Restaurants
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <h2 className="text-base font-black text-slate-900">
          Cart ({cartCount})
        </h2>
        <Link to="/cart" className="text-xs font-bold text-orange-600 hover:underline">
          View Details
        </Link>
      </div>

      <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.food.id} className="py-3 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs text-slate-900 truncate">{item.food.name}</h4>
              <p className="text-[11px] text-slate-400">${item.food.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1">
                <button
                  onClick={() => decreaseQuantity(item.food.id)}
                  className="w-5 h-5 rounded-md bg-white text-slate-700 font-bold flex items-center justify-center hover:bg-slate-200 text-xs shadow-xs"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <span className="text-xs font-bold min-w-3 text-center">{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.food.id)}
                  className="w-5 h-5 rounded-md bg-orange-600 text-white font-bold flex items-center justify-center hover:bg-orange-700 text-xs shadow-xs"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>

              <span className="text-xs font-black text-slate-900 w-12 text-right">
                ${(item.food.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Subtotal</span>
          <span className="font-black text-sm text-slate-900">${total.toFixed(2)}</span>
        </div>
        <Link
          to="/checkout"
          className="block w-full text-center py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all"
        >
          Checkout
        </Link>
      </div>
    </div>
  )
}

export default Cart