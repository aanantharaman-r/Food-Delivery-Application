import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Clock, 
  MapPin, 
  ChevronRight, 
  ShoppingBag, 
  RotateCcw, 
  CheckCircle2, 
  Bike,
  Receipt
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { OrderStatusTimeline } from '../components/OrderStatusTimeline'

export const MyOrders = () => {
  const { orders } = useCart()
  const [selectedOrder, setSelectedOrder] = useState(orders[0] || null)

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            My Orders & Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status updates, past receipts, and order histories.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-100 shadow-xl">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Orders Placed Yet</h3>
            <p className="text-xs text-slate-500 mb-6">Explore our menu and treat yourself to something delicious!</p>
            <Link
              to="/restaurants"
              className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-2xl shadow-md"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: List of all user orders */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
                Recent Orders ({orders.length})
              </span>

              {orders.map((order) => {
                const isSelected = selectedOrder?.id === order.id
                const isDelivered = order.status === 'Delivered'

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`bg-white rounded-3xl p-5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md'
                        : 'border-slate-100 hover:border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.restaurantImage}
                          alt={order.restaurant}
                          className="w-12 h-12 rounded-2xl object-cover shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                            {order.restaurant}
                          </h4>
                          <span className="text-[11px] text-slate-400">{order.date}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full shrink-0 ${
                        isDelivered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-orange-50 text-orange-700 border border-orange-200 animate-pulse'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Order items list */}
                    <div className="text-xs text-slate-500 mb-4 line-clamp-1">
                      {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-black text-slate-900 text-sm">
                        ₹{order.total?.toFixed(2)}
                      </span>

                      <button
                        className="text-xs font-bold text-orange-600 flex items-center gap-1 hover:underline"
                      >
                        Track Status <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right Column: Live Tracking Timeline & Order Breakdown for Selected Order */}
            <div className="lg:col-span-7 space-y-6">
              {selectedOrder ? (
                <>
                  {/* Status Timeline */}
                  <OrderStatusTimeline order={selectedOrder} />

                  {/* Receipt & Itemized Details Box */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-orange-600" />
                        <h4 className="font-bold text-slate-900 text-base">Order Receipt Details</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {selectedOrder.id}
                      </span>
                    </div>

                    {/* Dishes Breakdown */}
                    <div className="space-y-3 pb-4 border-b border-slate-100 text-xs">
                      {selectedOrder.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-slate-700 font-medium">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-bold text-slate-900">
                            ₹{((item.price || 12.99) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Charges Summary */}
                    <div className="space-y-2 py-4 border-b border-slate-100 text-xs text-slate-500">
                      <div className="flex justify-between">
                        <span>Items Subtotal</span>
                        <span>₹{(selectedOrder.itemTotal || selectedOrder.total).toFixed(2)}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>Discount Applied</span>
                          <span>-₹{selectedOrder.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>{selectedOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedOrder.deliveryFee || 2.99}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes & Handling</span>
                        <span>₹{(selectedOrder.tax || 2.40).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="pt-4 flex justify-between items-center text-sm">
                      <span className="font-black text-slate-900">Paid Total</span>
                      <span className="font-black text-xl text-orange-600">
                        ₹{selectedOrder.total?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                  <p className="text-slate-500 text-sm">Select an order on the left to inspect its live status.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default MyOrders