import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Users
} from 'lucide-react'

export default function AdminMobileNav() {
  const location = useLocation()

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard
    },
    {
      name: 'Foods',
      path: '/admin/foods',
      icon: UtensilsCrossed
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingBag
    },
    {
      name: 'Customers',
      path: '/admin/customers',
      icon: Users
    }
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-orange-100 shadow-[0_-4px_20px_rgba(249,115,22,0.08)]">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.path)

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive
                  ? 'text-orange-600 scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-xs shadow-orange-200'
                    : ''
                }`}
              >
                <Icon size={18} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
              </div>
              <span
                className={`text-[10px] mt-1 font-semibold ${
                  isActive ? 'text-orange-600 font-bold' : ''
                }`}
              >
                {item.name}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

