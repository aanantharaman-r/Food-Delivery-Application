import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  UtensilsCrossed, 
  Search, 
  ShoppingBag, 
  User, 
  MapPin, 
  ChevronDown, 
  Sparkles, 
  Percent,
  Menu,
  X,
  LogOut,
  Clock
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartCount, selectedAddress } = useCart()
  const { isLoggedIn, user, logout } = useAuth()
  const [searchVal, setSearchVal] = useState('')
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`)
      setSearchVal('')
      setMobileMenuOpen(false)
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Delivery Location */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-rose-500 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                <UtensilsCrossed className="w-6 h-6 text-white stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                  Foodie<span className="text-orange-500">.</span>
                </span>
                <span className="text-[10px] tracking-widest font-semibold uppercase text-slate-400 -mt-1 hidden sm:block">
                  Fast & Delicious
                </span>
              </div>
            </Link>

            {/* Quick Location Badge */}
            <div 
              onClick={() => navigate('/profile')} 
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-orange-50/80 border border-slate-200/60 hover:border-orange-200 transition-all cursor-pointer group"
            >
              <MapPin className="w-4 h-4 text-orange-500 group-hover:animate-bounce" />
              <div className="text-xs">
                <span className="font-bold text-slate-800 capitalize mr-1">{selectedAddress?.label || 'Home'}:</span>
                <span className="text-slate-500 max-w-[150px] truncate inline-block align-bottom">
                  {selectedAddress?.street || 'Select delivery address'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 transition-colors" />
            </div>
          </div>

          {/* Desktop Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-md relative mx-4"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search for restaurants, burgers, pizza, sushi..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white rounded-full border border-transparent focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-slate-800 placeholder-slate-400"
            />
          </form>

          {/* Desktop Navigation Links & Actions */}
          <div className="hidden md:flex items-center gap-5">
            <Link 
              to="/restaurants" 
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg ${
                isActive('/restaurants') 
                  ? 'text-orange-600 bg-orange-50' 
                  : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Restaurants
            </Link>

            <Link 
              to="/my-orders" 
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg ${
                isActive('/my-orders') 
                  ? 'text-orange-600 bg-orange-50' 
                  : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-4 h-4" />
              Orders
            </Link>

            {/* Cart Button with Count Badge */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-orange-600 text-white font-medium text-sm transition-all shadow-md shadow-slate-900/10 hover:shadow-orange-500/20 group"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-orange-500 group-hover:bg-white group-hover:text-orange-600 text-white text-xs font-bold px-2 py-0.5 rounded-full transition-colors">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth / Profile Area */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/40"
                  />
                  <span className="text-xs font-semibold text-slate-800 max-w-[90px] truncate hidden lg:inline">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                </button>

                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Manage Profile
                    </Link>
                    <Link
                      to="/my-orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                      Order History & Tracking
                    </Link>
                    
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout()
                          setProfileDropdownOpen(false)
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-orange-600 px-3 py-2 rounded-lg transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:text-orange-600 transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-orange-600 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3 animate-in fade-in">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search food or restaurants..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </form>

            <div className="flex flex-col gap-1 pt-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
              >
                Home
              </Link>
              <Link
                to="/restaurants"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
              >
                All Restaurants
              </Link>
              <Link
                to="/my-orders"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
              >
                My Orders & Live Tracking
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
              >
                Profile & Saved Addresses
              </Link>
              
              {!isLoggedIn && (
                <div className="pt-2 flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 bg-slate-100 text-slate-800 rounded-xl text-sm font-semibold"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 bg-orange-600 text-white rounded-xl text-sm font-semibold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar