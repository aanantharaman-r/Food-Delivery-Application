
import React from 'react'
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  ArrowUpRight,
  ChefHat
} from 'lucide-react'

const stats = [
  {
    title: 'Total Orders',
    value: '0',
    note: 'All customer orders',
    icon: ShoppingBag,
    color: '#f97316',
    bg: '#fff1e8'
  },
  {
    title: 'Total Foods',
    value: '0',
    note: 'Items in your menu',
    icon: UtensilsCrossed,
    color: '#16a34a',
    bg: '#eaf8ef'
  },
  {
    title: 'Total Users',
    value: '0',
    note: 'Registered customers',
    icon: Users,
    color: '#7c3aed',
    bg: '#f2eefe'
  },
  {
    title: 'Total Revenue',
    value: '₹0',
    note: 'Revenue from orders',
    icon: IndianRupee,
    color: '#0284c7',
    bg: '#e8f5fe'
  }
]

const activities = [
  { icon: Users, title: 'User Management', desc: 'Manage registered customers', color: '#7c3aed', bg: '#f2eefe' },
  { icon: UtensilsCrossed, title: 'Food Management', desc: 'Manage your menu items', color: '#16a34a', bg: '#eaf8ef' },
  { icon: ShoppingBag, title: 'Order Management', desc: 'View and manage orders', color: '#f97316', bg: '#fff1e8' }
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#fffaf6] text-gray-800">
      <header className="sticky top-0 z-20 border-b border-orange-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-200">
              <ChefHat size={24} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight sm:text-xl">
                Foodie <span className="text-orange-500">Admin</span>
              </h1>
              <p className="text-xs text-gray-500">Management Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-semibold text-gray-600 sm:text-sm">
              Admin Panel
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <LayoutDashboard size={16} />
              <span>Dashboard / Overview</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Welcome back, Admin 👋
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Here's what's happening with your food delivery store.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200">
            <TrendingUp size={18} />
            Store Overview
          </div>
        </div>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-orange-100/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {item.title}
                    </p>
                    <h3 className="mt-3 text-3xl font-extrabold tracking-tight">
                      {item.value}
                    </h3>
                  </div>
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: item.bg, color: item.color }}
                  >
                    <Icon size={23} />
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4">
                  <ArrowUpRight size={15} className="text-orange-500" />
                  <span className="text-xs text-gray-500">{item.note}</span>
                </div>
              </div>
            )
          })}
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-orange-100/80 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Quick Overview</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your food delivery operations
                </p>
              </div>
              <div className="rounded-xl bg-orange-50 p-3 text-orange-500">
                <LayoutDashboard size={21} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {activities.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-gray-100 p-4 transition hover:border-orange-200 hover:bg-orange-50/40"
                  >
                    <div
                      className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: item.bg, color: item.color }}
                    >
                      <Icon size={20} />
                    </div>
                    <h4 className="font-bold">{item.title}</h4>
                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      {item.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-orange-100/80 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <CheckCircle size={22} />
              </div>
              <div>
                <h3 className="font-bold">System Status</h3>
                <p className="text-xs text-gray-500">Dashboard overview</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Admin dashboard</span>
                <span className="text-xs font-semibold text-green-600">Ready</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Backend connection</span>
                <span className="text-xs font-semibold text-gray-500">Not checked</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Recent activity</span>
                <span className="text-xs font-semibold text-gray-500">No data</span>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-orange-50 p-4">
              <div className="flex items-center gap-2 text-orange-600">
                <Clock size={17} />
                <span className="text-sm font-bold">Next step</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Connect dashboard statistics to your MongoDB data.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-8 border-t border-orange-100 py-5 text-center text-xs text-gray-400">
          Foodie Admin Panel · Food Delivery Management
        </footer>
      </main>
    </div>
  )
}
