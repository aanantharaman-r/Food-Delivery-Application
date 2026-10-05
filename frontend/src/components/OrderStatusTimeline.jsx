import React from 'react'
import { CheckCircle2, Clock, MapPin, Phone, Bike, ChefHat, PackageCheck, AlertCircle } from 'lucide-react'

export const OrderStatusTimeline = ({ order }) => {
  if (!order) return null

  const steps = [
    { title: 'Order Placed', time: 'Received by system', icon: Clock },
    { title: 'Order Confirmed', time: 'Kitchen acknowledged', icon: CheckCircle2 },
    { title: 'Food Preparing', time: 'Chef cooking with love', icon: ChefHat },
    { title: 'Out for Delivery', time: 'Rider is on the way', icon: Bike },
    { title: 'Delivered', time: 'Arrived at your door', icon: PackageCheck }
  ]

  const currentStep = typeof order.stepIndex === 'number' ? order.stepIndex : 3

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Live Order Status
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {order.status || 'Out for Delivery'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Estimated Arrival: <span className="font-bold text-slate-800">{order.eta || '25-35 mins'}</span>
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-200/80 px-4 py-2.5 rounded-2xl flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-orange-600">Order ID</p>
            <p className="text-sm font-mono font-bold text-slate-900">{order.id}</p>
          </div>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="my-8">
        <div className="relative">
          {/* Track line behind steps */}
          <div className="hidden md:block absolute top-5 left-8 right-8 h-1 bg-slate-100 -z-0">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-500" 
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon
              const isPassed = idx < currentStep
              const isCurrent = idx === currentStep
              const isPending = idx > currentStep

              return (
                <div key={step.title} className="flex md:flex-col items-center md:items-center gap-4 md:gap-2">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs transition-all ${
                    isPassed
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-orange-600 text-white ring-4 ring-orange-100 shadow-orange-500/30 scale-110'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="md:text-center">
                    <p className={`text-xs font-bold ${
                      isCurrent ? 'text-orange-600' : isPassed ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{step.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Delivery Partner Details Card */}
      {order.deliveryPartner && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 font-black text-lg">
              {order.deliveryPartner.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">{order.deliveryPartner.name}</span>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  ★ {order.deliveryPartner.rating}
                </span>
              </div>
              <p className="text-xs text-slate-500">{order.deliveryPartner.vehicle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${order.deliveryPartner.phone}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-colors shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Call Rider
            </a>
          </div>
        </div>
      )}

      {/* Destination address */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
        <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
        <span>Delivering to: <strong className="text-slate-700 font-semibold">{order.address}</strong></span>
      </div>
    </div>
  )
}

export default OrderStatusTimeline
