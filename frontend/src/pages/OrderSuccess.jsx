import React from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ShoppingBag, 
  Sparkles,
  Bike
} from 'lucide-react'
import { OrderStatusTimeline } from '../components/OrderStatusTimeline'

export const OrderSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const order = location.state?.order

  // Default fallback order if opened directly
  const displayOrder = order || {
    id: 'ORD-98214',
    restaurant: 'The Burger Barn & Grill',
    total: 32.37,
    status: 'Order Placed',
    stepIndex: 0,
    address: 'Apt 4B, Emerald Green Residency, 74 Elm Street',
    eta: '25-35 mins',
    deliveryPartner: {
      name: 'Michael Davis',
      rating: 4.9,
      phone: '+1 (555) 789-0123',
      vehicle: 'Honda Activa • NY 4829'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Success Header Hero Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl text-center">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-full shadow-lg shadow-emerald-500/25">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Payment Confirmed
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            Woohoo! Your Feast is Being Prepared!
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            The kitchen has accepted your order from <strong className="text-slate-800 font-semibold">{displayOrder.restaurant}</strong>.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/my-orders"
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Track in My Orders
            </Link>

            <Link
              to="/"
              className="px-6 py-3.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs border border-orange-200 transition-all flex items-center gap-2"
            >
              Order More Food
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Real-time Order Tracking Status Component */}
        <OrderStatusTimeline order={displayOrder} />

      </div>
    </div>
  )
}

export default OrderSuccess