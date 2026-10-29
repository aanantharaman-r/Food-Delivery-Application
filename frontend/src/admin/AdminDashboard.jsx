import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ChefHat,
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

export default function AdminDashboard() {
  const { token, user } = useAuth()

  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalFoods: 0,
    totalUsers: 0,
    totalRevenue: 0
  })

  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [backendConnected, setBackendConnected] = useState(false)

  const fetchDashboardStats = async () => {
    if (!token) {
      setError('Login session not found. Please login again.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const [statsRes, ordersRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:5000/api/admin/orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ])

      const statsData = await statsRes.json()
      const ordersData = await ordersRes.json()

      if (!statsRes.ok || !statsData.success) {
        throw new Error(statsData.message || 'Failed to load dashboard statistics')
      }

      setDashboardStats({
        totalOrders: statsData.stats.totalOrders ?? 0,
        totalFoods: statsData.stats.totalFoods ?? 0,
        totalUsers: statsData.stats.totalUsers ?? 0,
        totalRevenue: statsData.stats.totalRevenue ?? 0
      })

      if (ordersData.success && Array.isArray(ordersData.orders)) {
        setRecentOrders(ordersData.orders.slice(0, 5))
      }

      setBackendConnected(true)
    } catch (err) {
      setBackendConnected(false)
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to backend server. Please verify backend is running on port 5000.'
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardStats()
  }, [token])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const stats = [
    {
      title: 'Total Orders',
      value: dashboardStats.totalOrders.toLocaleString('en-IN'),
      note: 'All customer orders in MongoDB',
      icon: ShoppingBag,
      color: '#f97316',
      bg: '#fff1e8',
      link: '/admin/orders'
    },
    {
      title: 'Total Foods',
      value: dashboardStats.totalFoods.toLocaleString('en-IN'),
      note: 'Live dishes in menu',
      icon: UtensilsCrossed,
      color: '#16a34a',
      bg: '#eaf8ef',
      link: '/admin/foods'
    },
    {
      title: 'Total Users',
      value: dashboardStats.totalUsers.toLocaleString('en-IN'),
      note: 'Registered customer accounts',
      icon: Users,
      color: '#7c3aed',
      bg: '#f2eefe',
      link: '/admin/customers'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(dashboardStats.totalRevenue),
      note: 'From paid non-cancelled orders',
      icon: IndianRupee,
      color: '#0284c7',
      bg: '#e8f5fe'
    }
  ]

  const quickLinks = [
    {
      title: 'Food Management',
      desc: 'Add new dishes, update prices & categories, toggle availability',
      icon: UtensilsCrossed,
      link: '/admin/foods',
      color: '#16a34a',
      bg: '#eaf8ef'
    },
    {
      title: 'Order Management',
      desc: 'Track live orders, dispatch status, customer delivery addresses',
      icon: ShoppingBag,
      link: '/admin/orders',
      color: '#f97316',
      bg: '#fff1e8'
    },
    {
      title: 'Customer Directory',
      desc: 'View customer contacts, order histories, account registrations',
      icon: Users,
      link: '/admin/customers',
      color: '#7c3aed',
      bg: '#f2eefe'
    }
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-orange-600">
            <LayoutDashboard size={15} />
            <span>Store Operations / Overview</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome back, {user?.name || 'Admin'} 👋
          </h2>

          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Here is your live Foodie performance summary connected to MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardStats}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Stats</span>
          </button>

          <div className="flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                backendConnected ? 'bg-green-500 animate-pulse' : 'bg-red-400'
              }`}
            />
            <span className="text-xs font-bold text-orange-950">
              {backendConnected ? 'MongoDB Live' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700 flex items-start gap-3"
        >
          <AlertCircle size={18} className="shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="font-bold">Failed to load statistics</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Stats 4-Card Grid */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon
          const CardWrapper = item.link ? Link : 'div'

          return (
            <CardWrapper
              key={item.title}
              to={item.link}
              className={`rounded-2xl border border-orange-100/90 bg-white p-5 shadow-2xs transition duration-200 hover:-translate-y-1 hover:shadow-md block ${
                item.link ? 'cursor-pointer hover:border-orange-300' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {item.title}
                  </p>

                  <h3 className="mt-2.5 break-words text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                    {loading ? '...' : item.value}
                  </h3>
                </div>

                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-2xs"
                  style={{
                    backgroundColor: item.bg,
                    color: item.color
                  }}
                >
                  <Icon size={24} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs text-slate-400">{item.note}</span>
                {item.link && (
                  <ArrowUpRight size={15} className="text-orange-500 shrink-0" />
                )}
              </div>
            </CardWrapper>
          )
        })}
      </section>

      {/* Navigation Quick Actions & System Info */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Links */}
        <div className="rounded-2xl border border-orange-100/90 bg-white p-6 shadow-2xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Admin Modules</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Quickly jump into each administrative section
              </p>
            </div>
            <div className="rounded-xl bg-orange-50 p-2 text-orange-500">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
            {quickLinks.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.title}
                  to={item.link}
                  className="group rounded-2xl border border-slate-100 p-4 transition-all duration-200 hover:border-orange-300 hover:bg-orange-50/40 hover:shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div
                      className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: item.bg,
                        color: item.color
                      }}
                    >
                      <Icon size={20} />
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h4>

                    <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-orange-600">
                    <span>Manage</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* System Overview Panel */}
        <div className="rounded-2xl border border-orange-100/90 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                <CheckCircle size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900">System Status</h3>
                <p className="text-xs text-slate-500">MongoDB & Services</p>
              </div>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span className="text-slate-600 font-medium">Admin Panel</span>
                <span className="font-bold text-emerald-600">Active</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span className="text-slate-600 font-medium">Backend API</span>
                <span
                  className={`font-bold ${
                    backendConnected ? 'text-emerald-600' : 'text-rose-500'
                  }`}
                >
                  {backendConnected ? 'Connected (Port 5000)' : 'Offline'}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span className="text-slate-600 font-medium">MongoDB Database</span>
                <span
                  className={`font-bold ${
                    backendConnected ? 'text-emerald-600' : 'text-amber-500'
                  }`}
                >
                  {backendConnected ? 'Cluster0 Connected' : 'Checking'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-orange-50/80 border border-orange-100 p-3.5">
            <div className="flex items-center gap-2 text-orange-700 text-xs font-bold">
              <Clock size={14} />
              <span>Real-time Sync Active</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
              Food menu changes, price updates, and order status updates sync across customer and admin views instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Orders Overview */}
      {recentOrders.length > 0 && (
        <section className="bg-white rounded-2xl border border-orange-100 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Recent Customer Orders</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest orders received from customer checkout
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <span>View all orders</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fff9f4] border-b border-orange-100 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-orange-50/30">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      #{ord._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 px-3">
                      {ord.user?.name || ord.user?.email || 'Customer'}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      ₹{ord.totalAmount}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-800">
                        {ord.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
