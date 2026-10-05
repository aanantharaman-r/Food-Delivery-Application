import React, { useState } from 'react'
import { Ticket, Check, X, Sparkles, Tag } from 'lucide-react'
import { OFFERS } from '../data/mockData'
import { useCart } from '../context/CartContext'
import { useToast } from './Toast'

export const CouponSection = () => {
  const { appliedCoupon, applyCoupon, removeCoupon, subtotal } = useCart()
  const { showToast } = useToast()
  const [customCode, setCustomCode] = useState('')

  const handleApplyCustom = (e) => {
    e.preventDefault()
    if (!customCode.trim()) return

    const found = OFFERS.find(o => o.code.toUpperCase() === customCode.trim().toUpperCase())
    if (found) {
      const res = applyCoupon(found)
      if (res.success) {
        showToast({ title: 'Coupon Applied!', description: res.message, variant: 'success' })
        setCustomCode('')
      } else {
        showToast({ title: 'Cannot Apply', description: res.message, variant: 'error' })
      }
    } else {
      showToast({ title: 'Invalid Code', description: 'Coupon code not found or expired', variant: 'error' })
    }
  }

  const handleApplyOffer = (offer) => {
    const res = applyCoupon(offer)
    if (res.success) {
      showToast({ title: 'Coupon Applied!', description: res.message, variant: 'success' })
    } else {
      showToast({ title: 'Notice', description: res.message, variant: 'info' })
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
          <Ticket className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-slate-900 text-base">Apply Coupon & Offers</h3>
      </div>

      {/* Currently Applied Coupon Notification */}
      {appliedCoupon ? (
        <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-800">
                Code <span className="font-mono">{appliedCoupon.code}</span> applied!
              </p>
              <p className="text-[11px] text-emerald-600">
                {appliedCoupon.title}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              removeCoupon()
              showToast({ title: 'Coupon Removed', description: 'Coupon was removed from cart', variant: 'info' })
            }}
            className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
            title="Remove Coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Manual Code Entry */
        <form onSubmit={handleApplyCustom} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
              placeholder="ENTER PROMO CODE"
              className="w-full pl-10 pr-3 py-2.5 text-xs font-mono font-semibold uppercase bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold rounded-2xl transition-all shadow-xs"
          >
            Apply
          </button>
        </form>
      )}

      {/* Available Coupon Quick Buttons */}
      <div className="space-y-2.5 pt-1">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Available for you</p>
        {OFFERS.map((offer) => {
          const isSelected = appliedCoupon?.code === offer.code
          const isEligible = subtotal >= (offer.minOrder || 0)

          return (
            <div
              key={offer.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                isSelected
                  ? 'border-emerald-300 bg-emerald-50/50'
                  : 'border-slate-100 hover:border-slate-200 bg-slate-50/60'
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-mono font-bold text-xs text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                    {offer.code}
                  </span>
                  <span className="text-[10px] text-orange-600 font-bold uppercase">{offer.tag}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium truncate">{offer.title}</p>
                <p className="text-[10px] text-slate-400 truncate">{offer.subTitle}</p>
              </div>

              <button
                type="button"
                onClick={() => handleApplyOffer(offer)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white hover:bg-orange-50 text-slate-800 hover:text-orange-600 border border-slate-200 shadow-xs'
                }`}
              >
                {isSelected ? 'Applied' : 'Apply'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CouponSection
