import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Coins, 
  ShieldCheck, 
  LogOut, 
  Clock, 
  Edit3, 
  Check,
  CreditCard
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'
import { AddressSelector } from '../components/AddressSelector'

export const Profile = () => {
  const navigate = useNavigate()
  const { user, isLoggedIn, logout, updateUser } = useAuth()
  const { orders } = useCart()
  const { showToast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')

  if (!isLoggedIn || !user) {
    navigate('/login')
    return null
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    updateUser({ name, phone })
    setIsEditing(false)
    showToast({
      title: 'Profile Updated',
      description: 'Your details have been saved.',
      variant: 'success'
    })
  }

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=ff4c24&color=fff&bold=true`

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Header Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user?.avatar || defaultAvatar}
                  alt={user?.name || 'User'}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-orange-500/20 shadow-md"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = defaultAvatar
                  }}
                />
                <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {user?.name || 'Customer'}
                  </h1>
                  <span className="bg-orange-100 text-orange-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    {user?.role === 'admin' ? 'Admin' : 'Foodie Member'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{user?.email}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Member since: {user?.memberSince || '2024'}
                </p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2.5 rounded-2xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>

              <button
                onClick={() => {
                  logout()
                  showToast({ title: 'Signed Out', description: 'See you next time!', variant: 'info' })
                  navigate('/')
                }}
                className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>

          </div>

          {/* Edit Form Drawer */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Update Profile Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/60">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-medium">Orders Placed</span>
              </div>
              <p className="text-xl font-black text-slate-900">{orders.length}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/60">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Coins className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-medium">Foodie Points</span>
              </div>
              <p className="text-xl font-black text-slate-900">{user?.loyaltyPoints || 450} pts</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/60">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium">Account Status</span>
              </div>
              <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Verified
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/60">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium">Wallet Balance</span>
              </div>
              <p className="text-xl font-black text-slate-900">₹0.00</p>
            </div>
          </div>
        </div>

        {/* Addresses & Orders Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Saved Addresses Section */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>Saved Delivery Addresses</span>
              </h2>
            </div>
            <AddressSelector />
          </div>

          {/* Account Settings / Quick Links */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Order History & Quick Links
            </h2>
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
              <Link
                to="/my-orders"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50 hover:text-orange-600 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 group-hover:text-orange-600">
                      My Orders & Live Tracking
                    </h4>
                    <p className="text-[11px] text-slate-400">View status of your previous meals</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-orange-600">→</span>
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-200 text-amber-800">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-amber-900">
                        Admin Control Panel
                      </h4>
                      <p className="text-[11px] text-amber-700">Manage foods, orders, and dashboard</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-800">→</span>
                </Link>
              )}

              <Link
                to="/"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50 hover:text-orange-600 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-200 text-slate-700">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 group-hover:text-orange-600">
                      Explore Food Menu
                    </h4>
                    <p className="text-[11px] text-slate-400">Order your favorite dishes today</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-orange-600">→</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile
