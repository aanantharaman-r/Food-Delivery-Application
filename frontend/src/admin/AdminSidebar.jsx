import React from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  LogOut,
  ChevronRight,
  ExternalLink,
  Store,
  Menu,
  X,
  ChefHat
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      description: 'Store metrics & revenue'
    },
    {
      name: 'Food Management',
      path: '/admin/foods',
      icon: UtensilsCrossed,
      description: 'CRUD menu dishes'
    },
    {
      name: 'Order Management',
      path: '/admin/orders',
      icon: ShoppingBag,
      description: 'Live order tracking'
    },
    {
      name: 'Customers',
      path: '/admin/customers',
      icon: Users,
      description: 'Registered shoppers'
    }
  ]

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white border-r border-orange-100">
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between px-6 py-5 border-b border-orange-100/70">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-600 to-orange-400 text-white shadow-md shadow-orange-200">
              <ChefHat size={24} className="stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">Foodie</span>
                <span className="rounded-md bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-extrabold text-orange-600 uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Control & Operations</p>
            </div>
          </div>

          {mobileOpen !== undefined && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-6 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main Menu
          </div>

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
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={`group flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200/80 font-semibold'
                    : 'text-slate-600 hover:bg-orange-50/80 hover:text-orange-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-600'
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="leading-tight">{item.name}</div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        isActive ? 'text-orange-100' : 'text-slate-400 group-hover:text-slate-500'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  size={16}
                  className={`transition-transform duration-200 ${
                    isActive
                      ? 'text-white translate-x-0.5'
                      : 'text-slate-300 group-hover:text-orange-400 group-hover:translate-x-0.5'
                  }`}
                />
              </NavLink>
            )
          })}
        </div>
      </div>

      {/* User profile & actions footer */}
      <div className="p-4 border-t border-orange-100/70 bg-gradient-to-b from-transparent to-orange-50/30">
        <NavLink
          to="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2.5 mb-3 text-xs font-semibold text-slate-600 bg-white border border-slate-200/80 rounded-xl hover:border-orange-200 hover:bg-orange-50/50 hover:text-orange-600 transition"
        >
          <div className="flex items-center gap-2">
            <Store size={15} className="text-orange-500" />
            <span>View Customer Website</span>
          </div>
          <ExternalLink size={13} className="text-slate-400" />
        </NavLink>

        {/* Current Admin User card */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-orange-100 shadow-xs mb-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700 font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-800 truncate">
                {user?.name || 'Administrator'}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {user?.email || 'admin@foodie.com'}
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition cursor-pointer"
        >
          <LogOut size={15} />
          <span>Logout of Admin</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 flex-col h-screen sticky top-0 shadow-sm z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}

