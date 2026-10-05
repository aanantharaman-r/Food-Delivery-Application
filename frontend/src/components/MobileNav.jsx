import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Utensils, ShoppingBag, Clock, User } from 'lucide-react'
import { useCart } from '../context/CartContext'

export const MobileNav = () => {
  const location = useLocation()
  const { cartCount } = useCart()

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Restaurants', path: '/restaurants', icon: Utensils },
    { label: 'Cart', path: '/cart', icon: ShoppingBag, badge: cartCount },
    { label: 'Orders', path: '/my-orders', icon: Clock },
    { label: 'Profile', path: '/profile', icon: User },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
                isActive ? 'text-orange-600 scale-105' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileNav