import React from 'react'
import { Sparkles, Ticket, Check, ArrowRight } from 'lucide-react'
import { OFFERS } from '../data/mockData'
import { useCart } from '../context/CartContext'
import { useToast } from './Toast'

export const OffersBanner = () => {
  const { applyCoupon, appliedCoupon } = useCart()
  const { showToast } = useToast()

  const handleApply = (offer) => {
    const res = applyCoupon(offer)
    if (res.success) {
      showToast({ title: 'Coupon Applied!', description: res.message, variant: 'success' })
    } else {
      showToast({ title: 'Coupon Notice', description: res.message, variant: 'info' })
    }
  }

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Special Deals & Promotions
          </h2>
        </div>
        <span className="text-xs font-semibold text-orange-600">Limited time offers</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {OFFERS.map((offer) => {
          const isApplied = appliedCoupon?.code === offer.code

          return (
            <div
              key={offer.id}
              className={`relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${offer.gradient} text-white shadow-lg shadow-orange-500/10 flex flex-col justify-between group transform transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Background ambient pattern */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20">
                    {offer.tag}
                  </span>
                  <Ticket className="w-5 h-5 text-white/60" />
                </div>

                <h3 className="text-xl font-black tracking-tight leading-snug mb-1">
                  {offer.title}
                </h3>
                <p className="text-xs text-white/80 line-clamp-2">
                  {offer.subTitle}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/70 uppercase font-semibold">Code</span>
                  <span className="text-sm font-mono font-bold tracking-wider">{offer.code}</span>
                </div>

                <button
                  onClick={() => handleApply(offer)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shadow-sm ${
                    isApplied
                      ? 'bg-white text-emerald-600'
                      : 'bg-white/95 text-slate-900 hover:bg-white active:scale-95'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Applied
                    </>
                  ) : (
                    <>
                      Apply
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default OffersBanner
