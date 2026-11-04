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
        <p className="text-xs text-slate-500 mb-4">Add tasty dishes from our menu.</p>
        <Link
          to="/"
          className="inline-block bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-500 transition-colors shadow-xs"
        >
          Browse Menu
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
        {items.map((item) => {
          const foodId = item.food._id || item.food.id
          const isAvail = item.food && item.food.isAvailable !== false
          const price = Number(item.food.price) || 0

          return (
            <div key={foodId} className="py-3 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className={`font-bold text-xs truncate ${!isAvail ? 'text-rose-500 line-through' : 'text-slate-900'}`}>
                  {item.food.name}
                </h4>
                <p className="text-[11px] text-slate-400">
                  ₹{price.toFixed(2)} {!isAvail && <span className="text-rose-500 font-bold">(Unavailable)</span>}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1">
                  <button
                    onClick={() => decreaseQuantity(foodId)}
                    className="w-5 h-5 rounded-md bg-white text-slate-700 font-bold flex items-center justify-center hover:bg-slate-200 text-xs shadow-xs cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  <span className="text-xs font-bold min-w-3 text-center">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(foodId)}
                    disabled={!isAvail}
                    className="w-5 h-5 rounded-md bg-orange-600 text-white font-bold flex items-center justify-center hover:bg-orange-700 text-xs shadow-xs cursor-pointer disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>

                <span className="text-xs font-black text-slate-900 w-14 text-right">
                  ₹{(price * item.quantity).toFixed(2)}
                </span>

                <button
                  onClick={() => removeItem(foodId)}
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Subtotal</span>
          <span className="font-black text-sm text-slate-900">₹{total.toFixed(2)}</span>
        </div>
        <Link
          to="/checkout"
          className="block w-full text-center py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer"
        >
          Checkout
        </Link>
      </div>
    </div>
  )
}

export default Cart
