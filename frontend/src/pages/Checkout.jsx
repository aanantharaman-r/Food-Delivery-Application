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
  ArrowRight,
  AlertCircle
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
    placeOrder,
    removeUnavailableItems
  } = useCart()
  const { user, token } = useAuth()
  const { showToast } = useToast()

  const [paymentMethod, setPaymentMethod] = useState('COD') // 'COD' | 'RAZORPAY'
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  // Check if any items in cart are unavailable
  const unavailableInCart = items.filter(i => i.food && i.food.isAvailable === false)

  const handleCompleteOrder = async () => {
    setCheckoutError('')

    // Guard against unavailable items
    if (unavailableInCart.length > 0) {
      setCheckoutError(
        `"${unavailableInCart.map(i => i.food.name).join(', ')}" is no longer available. Please remove it before placing your order.`
      )
      return
    }

    setIsProcessing(true)

    try {
      let savedDbOrder = null

      // Save to real MongoDB if customer is logged in
      if (token) {
        const orderPayload = {
          items: items.map(i => ({
            food: i.food._id || i.food.id,
            name: i.food.name,
            price: Number(i.food.price),
            quantity: i.quantity
          })),
          deliveryAddress: selectedAddress
            ? `${selectedAddress.street}, ${selectedAddress.city} - ${selectedAddress.zip || '600001'}`
            : 'Chennai, Tamil Nadu',
          paymentMethod: paymentMethod === 'RAZORPAY' ? 'RAZORPAY' : 'COD',
          totalAmount: total
        }

        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(orderPayload)
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to place order in backend')
        }

        savedDbOrder = data.order
      }

      const order = placeOrder({
        paymentMethod: paymentMethod === 'RAZORPAY' ? 'Online Payment / Razorpay' : 'Cash on Delivery',
        deliveryNotes,
        savedDbOrder
      })

      showToast({
        title: 'Order Placed Successfully!',
        description: `Order ${order.id} is confirmed.`,
        variant: 'success'
      })

      navigate('/order-success', { state: { order } })
    } catch (err) {
      setCheckoutError(err.message || 'Order could not be processed. Please try again.')
      showToast({
        title: 'Order Failed',
        description: err.message,
        variant: 'destructive'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Checkout & Payment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Choose your preferred payment method and confirm delivery instructions.
          </p>
        </div>

        {/* Unavailable items alert */}
        {unavailableInCart.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0 text-rose-500" />
              <span>
                <strong>Attention:</strong> Some items in your cart (
                {unavailableInCart.map(i => i.food.name).join(', ')}) are currently out of stock.
              </span>
            </div>
            <button
              onClick={removeUnavailableItems}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs shrink-0 hover:bg-rose-700 cursor-pointer"
            >
              Remove Unavailable
            </button>
          </div>
        )}

        {checkoutError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0 text-rose-500" />
            <span>{checkoutError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Address, Payment, Notes */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Destination Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#ff4c24]" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Delivering to {selectedAddress?.label || 'Home'}
                  </h3>
                </div>
                <button
                  onClick={() => navigate('/cart')}
                  className="text-xs font-bold text-[#ff4c24] hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedAddress?.street}, {selectedAddress?.city} - {selectedAddress?.zip || '600001'}
              </p>
              <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Estimated Delivery: 25 - 35 minutes</span>
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Select Payment Method</span>
              </h3>

              <div className="space-y-3">
                {/* Cash On Delivery */}
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'COD'
                      ? 'border-[#ff4c24] bg-orange-50/30 ring-1 ring-[#ff4c24]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-[#ff4c24] focus:ring-[#ff4c24]"
                    />
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Cash on Delivery (COD)</p>
                        <p className="text-[11px] text-slate-400">Pay cash or UPI at your doorstep</p>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Online / Razorpay */}
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'RAZORPAY'
                      ? 'border-[#ff4c24] bg-orange-50/30 ring-1 ring-[#ff4c24]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="RAZORPAY"
                      checked={paymentMethod === 'RAZORPAY'}
                      onChange={() => setPaymentMethod('RAZORPAY')}
                      className="text-[#ff4c24] focus:ring-[#ff4c24]"
                    />
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Online Payment (Razorpay / UPI)</p>
                        <p className="text-[11px] text-slate-400">Credit, Debit card, Net Banking & UPI</p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Delivery Instructions */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>Delivery Notes for Partner (Optional)</span>
              </h3>
              <textarea
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="e.g. Ring the doorbell twice, leave parcel with security..."
                rows={2}
                className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff4c24] bg-slate-50/50"
              />
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5 sticky top-24">
              <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
                Order Summary ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item, index) => {
                  const itemAvail = item.food && item.food.isAvailable !== false
                  return (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-bold text-slate-600 min-w-5">{item.quantity}x</span>
                        <span className={`truncate font-medium ${!itemAvail ? 'text-rose-500 line-through' : 'text-slate-800'}`}>
                          {item.food.name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-800 shrink-0 ml-2">
                        ₹{(Number(item.food.price) || 0) * item.quantity}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Item Subtotal</span>
                  <span className="font-bold text-slate-800">₹{subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Restaurant Packaging</span>
                  <span>₹{packagingFee}</span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Taxes & GST (5%)</span>
                  <span>₹{tax}</span>
                </div>

                <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline text-sm font-black text-slate-900">
                  <span>To Pay</span>
                  <span className="text-xl text-[#ff4c24]">₹{total}</span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                onClick={handleCompleteOrder}
                disabled={isProcessing || unavailableInCart.length > 0}
                className="w-full py-4 rounded-2xl bg-[#ff4c24] hover:bg-[#e03f1b] text-white font-extrabold text-sm shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Placing Order...</span>
                  </div>
                ) : (
                  <>
                    <span>Place Order • ₹{total}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <Lock className="w-3.5 h-3.5" />
                <span>Safe and 256-bit SSL encrypted checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
