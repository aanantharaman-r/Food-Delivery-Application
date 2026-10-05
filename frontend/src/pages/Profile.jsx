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

  if (!isLoggedIn) {
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

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Header Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-orange-500/20 shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {user.name}
                  </h1>
                  <span className="bg-orange-100 text-orange-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    Gold Foodie
                  </span>
                </div>
                <p className="text-xs text-slate-500">{user.email}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Member since: {user.memberSince || 'March 2024'}
                </p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2.5 rounded-2xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
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
                className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>

          </div>

          {/* Loyalty & Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center">
            <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-100">
              <div className="flex items-center justify-center gap-1 text-orange-600 mb-0.5">
                <Coins className="w-4 h-4" />
                <span className="text-lg font-black">{user.loyaltyPoints || 340}</span>
              </div>
              <p className="text-[11px] font-bold text-slate-500">Foodie Coins Balance</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-lg font-black text-slate-900 block">{orders.length}</span>
              <p className="text-[11px] font-bold text-slate-500">Orders Delivered</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-lg font-black text-slate-900 block">4</span>
              <p className="text-[11px] font-bold text-slate-500">Favorite Restaurants</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-lg font-black text-emerald-700 block">₹28.50</span>
              <p className="text-[11px] font-bold text-emerald-800">Total Money Saved</p>
            </div>
          </div>
        </div>

        {/* Edit Form Drawer if opened */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md">
            <h3 className="font-bold text-slate-900 text-base mb-4">Update Profile Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Saved Addresses Section */}
          <div className="lg:col-span-7">
            <AddressSelector />
          </div>

          {/* Quick Shortcuts & Orders Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Recent Activity</h3>
                </div>
                <Link to="/my-orders" className="text-xs font-bold text-orange-600 hover:underline">
                  View All Orders
                </Link>
              </div>

              <div className="space-y-3">
                {orders.slice(0, 2).map((order) => (
                  <div key={order.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <h5 className="font-bold text-slate-900">{order.restaurant}</h5>
                      <span className="text-[11px] text-slate-400">{order.date}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-orange-600 block">₹{order.total?.toFixed(2)}</span>
                      <span className="text-[10px] text-emerald-600 font-bold">{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Profile
