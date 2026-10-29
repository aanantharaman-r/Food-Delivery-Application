import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Clock, 
  MapPin, 
  ChevronRight, 
  ShoppingBag, 
  RotateCcw, 
  CheckCircle2, 
  Bike,
  Receipt,
  RefreshCw
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { OrderStatusTimeline } from '../components/OrderStatusTimeline'

export const MyOrders = () => {
  const { orders: localOrders } = useCart()
  const { token, isLoggedIn } = useAuth()
  const [allOrders, setAllOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(false)

  // Status mapping helper to human title and stepIndex
  const mapOrderStatus = (status) => {
    switch (status) {
      case 'PLACED':
        return { title: 'Order Placed', step: 0 }
      case 'CONFIRMED':
        return { title: 'Order Confirmed', step: 1 }
      case 'PREPARING':
        return { title: 'Preparing Food', step: 2 }
      case 'OUT_FOR_DELIVERY':
        return { title: 'Out for Delivery', step: 3 }
      case 'DELIVERED':
        return { title: 'Delivered', step: 4 }
      case 'CANCELLED':
        return { title: 'Cancelled', step: 0 }
      default:
        return { title: status || 'Order Placed', step: 0 }
    }
  }

  const fetchBackendOrders = async () => {
    if (!token) {
      setAllOrders(localOrders)
      if (localOrders.length > 0) setSelectedOrder(localOrders[0])
      return
    }

    try {
      setLoading(true)
      const res = await fetch('http://localhost:5000/api/orders/my', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
        // Convert MongoDB orders into format compatible with UI
        const dbMapped = data.orders.map((o) => {
          const { title, step } = mapOrderStatus(o.orderStatus)
          return {
            _id: o._id,
            id: `ORD-${o._id.slice(-6).toUpperCase()}`,
            date: new Date(o.createdAt).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            }),
            restaurant: 'Foodie Partner Kitchen',
            restaurantImage:
              o.items[0]?.food?.image ||
              'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
            items: o.items.map((i) => ({
              name: i.name,
              quantity: i.quantity,
              price: i.price
            })),
            itemTotal: o.totalAmount,
            discount: 0,
            deliveryFee: 40,
            tax: 0,
            total: o.totalAmount,
            status: title,
            orderStatus: o.orderStatus,
            stepIndex: step,
            paymentMethod: o.paymentMethod || 'COD',
            address: o.deliveryAddress,
            eta: o.orderStatus === 'DELIVERED' ? 'Delivered' : '20-30 mins'
          }
        })

        // Merge with local orders, prioritizing DB orders
        const combined = [...dbMapped, ...localOrders.filter(lo => !dbMapped.some(dbo => dbo.id === lo.id))]
        setAllOrders(combined)
        setSelectedOrder(combined[0])
      } else {
        setAllOrders(localOrders)
        if (localOrders.length > 0) setSelectedOrder(localOrders[0])
      }
    } catch (err) {
      console.error('Failed to load orders from backend:', err)
      setAllOrders(localOrders)
      if (localOrders.length > 0) setSelectedOrder(localOrders[0])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBackendOrders()
  }, [token, localOrders.length])

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              My Orders & Tracking
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time status updates synced directly with kitchen and delivery partner.
            </p>
          </div>

          {token && (
            <button
              onClick={fetchBackendOrders}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 self-start sm:self-auto shadow-2xs"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Refresh Status</span>
            </button>
          )}
        </div>

        {allOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-100 shadow-xl">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Orders Placed Yet</h3>
            <p className="text-xs text-slate-500 mb-6">Explore our menu and treat yourself to something delicious!</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-[#ff4c24] hover:bg-[#e03a14] text-white font-bold text-xs rounded-2xl shadow-md"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: List of all user orders */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
                Recent Orders ({allOrders.length})
              </span>

              {allOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id
                const isDelivered = order.status === 'Delivered' || order.orderStatus === 'DELIVERED'

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`bg-white rounded-3xl p-5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#ff4c24] ring-2 ring-[#ff4c24]/20 shadow-md'
                        : 'border-slate-100 hover:border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.restaurantImage}
                          alt={order.restaurant}
                          className="w-12 h-12 rounded-2xl object-cover shrink-0"
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
                          }}
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                            {order.restaurant}
                          </h4>
                          <span className="text-[11px] text-slate-400">{order.date}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full shrink-0 ${
                          isDelivered
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-orange-50 text-orange-700 border border-orange-200 animate-pulse'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Order items list */}
                    <div className="text-xs text-slate-500 mb-4 line-clamp-1">
                      {order.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-black text-slate-900 text-sm">
                        ₹{order.total?.toFixed(2)}
                      </span>

                      <button className="text-xs font-bold text-[#ff4c24] flex items-center gap-1 hover:underline">
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
                        <Receipt className="w-4 h-4 text-[#ff4c24]" />
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
                            ₹{((item.price || 0) * item.quantity).toFixed(2)}
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
                        <span>
                          {selectedOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedOrder.deliveryFee || 40}`}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-100 text-sm">
                        <span>Grand Total</span>
                        <span className="text-[#ff4c24]">₹{selectedOrder.total?.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Delivery Address & Partner details */}
                    <div className="pt-4 text-xs text-slate-600 space-y-1">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span>{selectedOrder.address || 'Address provided at checkout'}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center text-slate-400">
                  Select an order on the left to track its live status.
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
