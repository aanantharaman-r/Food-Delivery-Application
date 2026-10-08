import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'

export const CartPage = () => {
  const navigate = useNavigate()
  const { 
    items, 
    removeItem, 
    increaseQuantity, 
    decreaseQuantity, 
    subtotal, 
    deliveryFee, 
    total, 
    cartCount,
    applyCoupon,
    appliedCoupon
  } = useCart()

  const [promoInput, setPromoInput] = useState('')
  const [promoMessage, setPromoMessage] = useState('')

  const handleApplyPromo = (e) => {
    e.preventDefault()
    if (!promoInput.trim()) return
    const code = promoInput.trim().toUpperCase()
    if (code === 'FEAST50' || code === 'FOODIE20' || code === 'TOMATO') {
      applyCoupon({
        code: code,
        discountPercent: 20,
        maxDiscount: 5,
        minOrder: 10
      })
      setPromoMessage('Promo code applied successfully!')
    } else {
      setPromoMessage('Invalid promo code. Try TOMATO or FEAST50')
    }
  }

  // Calculate delivery fee: free if cart is empty, else $2 (or standard)
  const effectiveDeliveryFee = items.length === 0 ? 0 : 2
  const effectiveTotal = items.length === 0 ? 0 : subtotal + effectiveDeliveryFee - (appliedCoupon ? 2 : 0)

  if (items.length === 0) {
    return (
      <div className="min-h-[65vh] bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-20 h-20 mx-auto flex items-center justify-center bg-orange-50 text-[#ff4c24] rounded-full">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            Your cart is empty
          </h2>
          <p className="text-sm text-slate-500">
            Looks like you haven't added anything to your cart yet. Explore our delicious menu!
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#ff4c24] hover:bg-[#e03a14] text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
            >
              Explore Menu
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Table of Cart Items */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-xs sm:text-sm font-normal">
                <th className="py-3 font-normal">Items</th>
                <th className="py-3 font-normal">Title</th>
                <th className="py-3 font-normal">Price</th>
                <th className="py-3 font-normal">Quantity</th>
                <th className="py-3 font-normal">Total</th>
                <th className="py-3 font-normal text-center">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {items.map((entry) => {
                const itemTotal = entry.food.price * entry.quantity
                return (
                  <tr key={entry.food.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Item Image */}
                    <td className="py-4">
                      <img
                        src={entry.food.image}
                        alt={entry.food.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    </td>

                    {/* Title */}
                    <td className="py-4 font-medium text-slate-800 max-w-[200px] truncate">
                      {entry.food.name}
                    </td>

                    {/* Price */}
                    <td className="py-4 font-medium">
                      ${entry.food.price.toFixed(0)}
                    </td>

                    {/* Quantity with +/- controls */}
                    <td className="py-4">
                      <div className="inline-flex items-center gap-2 border border-slate-200 rounded-lg px-2 py-1 bg-white">
                        <button
                          onClick={() => decreaseQuantity(entry.food.id)}
                          className="text-slate-500 hover:text-rose-500 p-0.5 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs min-w-4 text-center">
                          {entry.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(entry.food.id)}
                          className="text-slate-500 hover:text-emerald-500 p-0.5 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-4 font-semibold text-slate-900">
                      ${itemTotal.toFixed(0)}
                    </td>

                    {/* Remove 'x' button */}
                    <td className="py-4 text-center">
                      <button
                        onClick={() => removeItem(entry.food.id)}
                        className="text-slate-400 hover:text-[#ff4c24] p-1 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <X className="w-4 h-4 stroke-[2.5] mx-auto" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Section: Cart Totals on Left, Promo Code on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start pt-6">
          
          {/* Cart Totals Box */}
          <div className="md:col-span-6 space-y-4">
            <h3 className="text-xl font-bold text-slate-800">
              Cart Totals
            </h3>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800">${subtotal.toFixed(0)}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <span>Delivery Fee</span>
                <span className="font-medium text-slate-800">${effectiveDeliveryFee.toFixed(0)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex items-center justify-between py-2 border-b border-slate-200 text-emerald-600">
                  <span>Promo Discount ({appliedCoupon.code})</span>
                  <span className="font-medium">-$2</span>
                </div>
              )}

              <div className="flex items-center justify-between py-2 text-base font-bold text-slate-900">
                <span>Total</span>
                <span>${effectiveTotal.toFixed(0)}</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#ff4c24] hover:bg-[#e03a14] text-white font-semibold text-xs uppercase tracking-wider rounded-md transition-all shadow-md cursor-pointer"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>

          {/* Promo code on Right */}
          <div className="md:col-span-6 space-y-3">
            <p className="text-sm text-slate-500">
              If you have a promo code, Enter it here
            </p>

            <form onSubmit={handleApplyPromo} className="flex max-w-md">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="promo code"
                className="flex-1 bg-slate-100 text-sm px-4 py-3 rounded-l-md outline-none text-slate-800 placeholder-slate-400"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-7 py-3 rounded-r-md uppercase transition-colors cursor-pointer"
              >
                Submit
              </button>
            </form>

            {promoMessage && (
              <p className="text-xs font-medium text-emerald-600">
                {promoMessage}
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

export default CartPage