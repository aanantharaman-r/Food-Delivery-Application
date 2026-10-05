import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Tag, 
  Percent,
  Plus,
  Minus
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { CouponSection } from '../components/CouponSection'
import { AddressSelector } from '../components/AddressSelector'

export const CartPage = () => {
  const navigate = useNavigate()
  const { 
    items, 
    removeItem, 
    increaseQuantity, 
    decreaseQuantity, 
    subtotal, 
    deliveryFee, 
    packagingFee, 
    tax, 
    discountAmount, 
    total, 
    cartCount,
    appliedCoupon
  } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-slate-100">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-orange-100 text-orange-600 rounded-3xl">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            Good food is always just around the corner. Explore restaurants and add tasty meals!
          </p>
          <Link
            to="/restaurants"
            className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-500/20 transition-all"
          >
            Explore Restaurants
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Review Your Order ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review selected dishes, apply discounts, and confirm delivery address.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List & Delivery Address Selection */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Cart Items Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Dish Items
                </span>
                <span className="text-xs text-slate-500">
                  From {items[0]?.food?.restaurantName || 'Foodie Kitchen'}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {items.map((entry) => (
                  <div key={entry.food.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={entry.food.image}
                        alt={entry.food.name}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 truncate">
                          {entry.food.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          ₹{entry.food.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1">
                        <button
                          onClick={() => decreaseQuantity(entry.food.id)}
                          className="w-6 h-6 rounded-lg bg-white text-slate-700 font-bold flex items-center justify-center hover:bg-slate-200 transition-colors shadow-xs"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-900 min-w-4 text-center">
                          {entry.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(entry.food.id)}
                          className="w-6 h-6 rounded-lg bg-orange-600 text-white font-bold flex items-center justify-center hover:bg-orange-700 transition-colors shadow-xs"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total for this item */}
                      <span className="text-sm font-black text-slate-900 w-16 text-right">
                        ₹{(entry.food.price * entry.quantity).toFixed(2)}
                      </span>

                      <button
                        onClick={() => removeItem(entry.food.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Items Link */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Link
                  to="/restaurants"
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  + Add more items from menu
                </Link>
              </div>
            </div>

            {/* Address Selector Component */}
            <AddressSelector />

          </div>

          {/* Right Column: Coupons & Real-World Bill Summary */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Coupon Section */}
            <CouponSection />

            {/* Bill Details Breakdown Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
              <h3 className="font-black text-slate-900 text-lg tracking-tight mb-4">
                Bill Summary
              </h3>

              <div className="space-y-3 text-xs">
                {/* Item Subtotal */}
                <div className="flex items-center justify-between text-slate-600">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
                </div>

                {/* Applied Discount */}
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5" /> Coupon Discount ({appliedCoupon?.code})
                    </span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                {/* Delivery Fee */}
                <div className="flex items-center justify-between text-slate-600">
                  <span>Delivery Partner Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <strong className="text-emerald-600 uppercase font-bold">FREE</strong>
                    ) : (
                      `₹${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                {/* Restaurant Packaging Fee */}
                <div className="flex items-center justify-between text-slate-600">
                  <span>Eco-Packaging & Handling</span>
                  <span>₹{packagingFee.toFixed(2)}</span>
                </div>

                {/* Taxes (GST / Sales Tax) */}
                <div className="flex items-center justify-between text-slate-600">
                  <span>Taxes & Restaurant Charges (8%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                {/* Grand Total */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-base">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 text-lg">TO PAY</span>
                    <span className="text-[10px] text-slate-400 font-medium">Inclusive of all duties</span>
                  </div>
                  <span className="text-2xl font-black text-orange-600">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Safe and contactless delivery guaranteed</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default CartPage