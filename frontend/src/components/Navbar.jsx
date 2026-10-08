import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  Search, 
  ShoppingBag, 
  User, 
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
  const { cartCount } = useCart()
  const { isLoggedIn, user, logout } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`)
      setSearchVal('')
      setSearchOpen(false)
      setMobileMenuOpen(false)
    }
  }

  const scrollToSection = (id) => {
    setMobileMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo - Tomato. */}
          <Link to="/" className="flex items-center gap-1 group">
            <span className="text-3xl font-black tracking-tight text-[#ff4c24] font-sans">
              Tomato<span className="text-[#ff4c24]">.</span>
            </span>
          </Link>

          {/* Desktop Nav Links: Home, Menu, Mobile App, Contact Us */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-600">
            <Link 
              to="/" 
              className={`transition-colors hover:text-[#ff4c24] ${
                location.pathname === '/' ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-1' : ''
              }`}
            >
              home
            </Link>
            <button 
              onClick={() => scrollToSection('explore-menu')} 
              className="transition-colors hover:text-[#ff4c24] cursor-pointer"
            >
              menu
            </button>
            <button 
              onClick={() => scrollToSection('download-app')} 
              className="transition-colors hover:text-[#ff4c24] cursor-pointer"
            >
              mobile-app
            </button>
            <button 
              onClick={() => scrollToSection('contact-us')} 
              className="transition-colors hover:text-[#ff4c24] cursor-pointer"
            >
              contact us
            </button>
          </nav>

          {/* Right Action Icons & Sign In Button */}
          <div className="flex items-center gap-6">
            
            {/* Search Icon / Toggle */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    autoFocus
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search dishes..."
                    className="w-48 sm:w-64 py-1.5 pl-3 pr-8 text-sm border border-slate-300 rounded-full outline-none focus:border-[#ff4c24]"
                  />
                  <button 
                    type="button" 
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-slate-700 hover:text-[#ff4c24] transition-colors p-1 cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 stroke-[2.2]" />
                </button>
              )}
            </div>

            {/* Cart Icon with notification dot */}
            <Link
              to="/cart"
              className="relative text-slate-700 hover:text-[#ff4c24] transition-colors p-1 cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff4c24] rounded-full ring-2 ring-white" />
              )}
            </Link>

            {/* Sign In button or Profile Avatar */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#ff4c24]"
                  />
                </button>

                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-3.5 h-3.5" />
                      Manage Profile
                    </Link>
                    <Link
                      to="/my-orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Orders
                    </Link>
                    
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout()
                          setProfileDropdownOpen(false)
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center justify-center px-6 py-2 rounded-full border border-slate-400/80 hover:border-[#ff4c24] text-slate-700 hover:text-[#ff4c24] text-sm font-medium transition-all duration-200"
              >
                sign in
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-slate-700 md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3 animate-in fade-in">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#ff4c24]"
              >
                Home
              </Link>
              <button
                onClick={() => scrollToSection('explore-menu')}
                className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#ff4c24]"
              >
                Menu
              </button>
              <button
                onClick={() => scrollToSection('download-app')}
                className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#ff4c24]"
              >
                Mobile App
              </button>
              <button
                onClick={() => scrollToSection('contact-us')}
                className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#ff4c24]"
              >
                Contact Us
              </button>
              
              {!isLoggedIn && (
                <div className="pt-2 px-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2 px-4 rounded-full border border-[#ff4c24] text-[#ff4c24] text-sm font-medium"
                  >
                    Sign In
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