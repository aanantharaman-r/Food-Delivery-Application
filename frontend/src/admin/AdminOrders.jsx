
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { ShoppingBag, RefreshCw } from 'lucide-react'

export default function AdminOrders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        'http://localhost:5000/api/admin/orders',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Orders load aagala')
      }

      setOrders(data.orders || [])
    } catch (err) {
      setError(err.message || 'Orders load pannumbodhu error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchOrders()
    else {
      setError('Login session missing. Admin login pannunga.')
      setLoading(false)
    }
  }, [token])

  return (
    <div className="min-h-screen bg-[#fffaf6] px-5 py-8 text-gray-800 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">
              Order Management
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Customer orders and order details
            </p>
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            <RefreshCw size={17} />
            Refresh Orders
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-5 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-3 text-orange-500">
              <ShoppingBag size={23} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-extrabold">
                {loading ? '...' : orders.length}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
          {loading ? (
            <p className="p-8 text-center text-gray-500">
              Orders loading...
            </p>
          ) : orders.length === 0 && !error ? (
            <p className="p-8 text-center text-gray-500">
              Innum orders create aagala.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-orange-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-4">Order ID</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Items</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-orange-50/40">
                      <td className="px-5 py-4 font-semibold">
                        #{order._id.slice(-6).toUpperCase()}
                        <p className="mt-1 text-xs text-gray-400">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('en-IN')
                            : '-'}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          {order.user?.name || 'Customer'}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {order.user?.email || 'No email'}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {order.items?.reduce(
                          (total, item) => total + (item.quantity || 0),
                          0
                        ) || 0} items
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="px-5 py-4">
                        <p>{order.paymentMethod || 'COD'}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {order.paymentStatus || 'PENDING'}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                          {order.orderStatus || 'PLACED'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
