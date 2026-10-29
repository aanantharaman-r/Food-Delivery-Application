import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import { Menu, ChefHat, Bell, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#fffaf6] flex">
      {/* Responsive Orange & White Sidebar */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top navigation header */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur border-b border-orange-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-1 text-slate-700 hover:bg-orange-50 rounded-xl"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                <ChefHat size={18} />
              </div>
              <span className="font-extrabold text-slate-900 text-sm">
                Foodie <span className="text-orange-500">Admin</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-[11px] font-semibold text-orange-700 border border-orange-200">
              <Shield size={12} />
              <span>Admin Mode</span>
            </div>
          </div>
        </header>

        {/* Child Pages Rendered Here */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

