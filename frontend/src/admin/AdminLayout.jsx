import React, { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminMobileNav from './AdminMobileNav'
import { Menu, ChefHat, Shield, Store, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-[#fffaf6] flex">
      {/* Responsive Orange & White Sidebar (Desktop sticky & Mobile full drawer) */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* Mobile top navigation header */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-1 text-slate-700 hover:bg-orange-50 active:scale-95 rounded-xl cursor-pointer transition"
              aria-label="Open Admin Menu"
            >
              <Menu size={22} className="text-slate-800" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-500 text-white flex items-center justify-center shadow-xs shadow-orange-200">
                <ChefHat size={17} />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-sm">
                  Foodie <span className="text-orange-500">Admin</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NavLink
              to="/"
              className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition"
              title="Customer Website"
            >
              <Store size={17} />
            </NavLink>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-[10px] font-bold text-orange-700 border border-orange-200/80">
              <Shield size={11} className="text-orange-600" />
              <span>Admin</span>
            </div>
          </div>
        </header>

        {/* Child Pages Rendered Here */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Mobile Persistent Bottom Tab Bar */}
        <AdminMobileNav />
      </div>
    </div>
  )
}
