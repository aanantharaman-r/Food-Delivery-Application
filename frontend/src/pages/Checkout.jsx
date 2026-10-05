import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  CreditCard, 
  Wallet, 
  Banknote, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  MessageSquare,
  Lock,
  ArrowRight
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

export const Checkout = () => {
  const navigate = useNavigate()
  const { 
    items, 
    total, 
    subtotal, 
    deliveryFee, 
    tax, 
    packagingFee, 
    discountAmount, 
    cartCount,
    selectedAddress,
    placeOrder 
  } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const handleCompleteOrder = () => {
    setIsProcessing(true)

    setTimeout(() => {
      const order = placeOrder({
        paymentMethod: paymentMethod === 'card' 
          ? 'Credit Card (••• 4242)' 
          : paymentMethod === 'upi' 
          ? 'Digital Wallet / UPI' 
          : 'Cash on Delivery',
        deliveryNotes
      })

      setIsProcessing(false)
      showToast({
        title: 'Order Placed Successfully!',
        description: `Order ${order.id} is confirmed.`,
        variant: 'success'
      })

      navigate('/order-success', { state: { order } })
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Checkout & Payment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Choose your preferred payment method and confirm instructions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Delivery Address summary, Payment Options, Order Notes */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Delivery Destination Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Delivering to {selectedAddress?.label || 'Home'}</h3>
                </div>
                <button
                  onClick={() => navigate('/cart')}
                  className="text-xs font-bold text-orange-600 hover:underline"
                >
                  Change
                </button>
              </div>

              <p className="text-xs text-slate-700 font-medium">
                {selectedAddress?.street}, {selectedAddress?.city}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Contact: {selectedAddress?.phone || user?.phone}
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
              <h3 className="font-black text-slate-900 text-lg tracking-tight mb-4">
                Select Payment Method
              </h3>

              <div className="space-y-3">
                {/* Option 1: Credit / Debit Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'card'
                      ? 'border-orange-500 bg-orange-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Credit or Debit Card</h4>
                      <p className="text-xs text-slate-400">Visa, Mastercard, Amex (Mock 4242)</p>
                    </div>
                  </div>
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-orange-500 bg-orange-500' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'card' && <span className="w-2 h-2 rounded-full bg-white" />}
                  </span>
                </div>

                {/* Option 2: Digital Wallet / Apple Pay / UPI */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'upi'
                      ? 'border-orange-500 bg-orange-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Digital Wallet / Instant Pay</h4>
                      <p className="text-xs text-slate-400">Google Pay, Apple Pay, PayPal</p>
                    </div>
                  </div>
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'upi' ? 'border-orange-500 bg-orange-500' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'upi' && <span className="w-2 h-2 rounded-full bg-white" />}
                  </span>
                </div>

                {/* Option 3: Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'cod'
                      ? 'border-orange-500 bg-orange-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Pay on Delivery (Cash / POS)</h4>
                      <p className="text-xs text-slate-400">Pay the rider when food arrives</p>
                    </div>
                  </div>
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'cod' ? 'border-orange-500 bg-orange-500' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'cod' && <span className="w-2 h-2 rounded-full bg-white" />}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Instructions / Order Notes */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-orange-600" />
                <h3 className="font-bold text-slate-900 text-sm">Delivery Instructions</h3>
              </div>
              <textarea
                rows={2}
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="e.g. Please do not ring doorbell, baby sleeping. Leave on doorstep."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 outline-none resize-none"
              />
            </div>

          </div>

          {/* Right Column: Order Items Preview & Pay CTA */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
              <h3 className="font-black text-slate-900 text-lg tracking-tight mb-4">
                Items ({cartCount})
              </h3>

              <div className="space-y-3 pb-4 border-b border-slate-100 text-xs">
                {items.map((i) => (
                  <div key={i.food.id} className="flex items-center justify-between">
                    <span className="text-slate-700 truncate max-w-[200px]">
                      {i.quantity}x {i.food.name}
                    </span>
                    <span className="font-bold text-slate-900">
                      ${(i.food.price * i.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 py-4 border-b border-slate-100 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Fees</span>
                  <span>${(tax + packagingFee).toFixed(2)}</span>
                </div>
              </div>

              {/* Final Amount */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase">Total Payable</span>
                  <h4 className="text-2xl font-black text-orange-600">${total.toFixed(2)}</h4>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-4 h-4" />
                  <span>256-bit Encrypted</span>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                onClick={handleCompleteOrder}
                disabled={isProcessing}
                className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-70"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ${total.toFixed(2)} & Place Order</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default Checkout