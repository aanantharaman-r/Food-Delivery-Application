
import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'

import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/Toast'

// Navigation & Layout
import { Navbar } from './components/Navbar'
import { MobileNav } from './components/MobileNav'
import { Footer } from './components/Footer'

// Customer Pages
import { Home } from './pages/Home'
import { Restaurants } from './pages/Restaurants'
import { RestaurantDetails } from './pages/RestaurantDetails'
import { FoodDetails } from './pages/FoodDetails'
import { CartPage } from './pages/CartPage'
import { Checkout } from './pages/Checkout'
import { OrderSuccess } from './pages/OrderSuccess'
import { MyOrders } from './pages/MyOrders'
import { SearchResults } from './pages/SearchResults'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Profile } from './pages/Profile'
import { CrazyLoadingScreen } from './components/CrazyLoadingScreen'

// Admin Pages
import AdminDashboard from './admin/AdminDashboard'
import AdminOrders from './admin/AdminOrders'
import AdminRoute from './admin/AdminRoute'

function CustomerLayout({ setShowLoading }) {
  return (
    <>
      <Navbar onTriggerLoading={() => setShowLoading(true)} />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/food/:id" element={<FoodDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>

      <Footer />
      <MobileNav />
    </>
  )
}

function App() {
  const [showLoading, setShowLoading] = React.useState(true)

  React.useEffect(() => {
    const handleReplay = () => setShowLoading(true)

    window.addEventListener('replay-crazy-loader', handleReplay)

    return () => {
      window.removeEventListener('replay-crazy-loader', handleReplay)
    }
  }, [])

  return (
    <Router>
      {showLoading && (
        <CrazyLoadingScreen
          duration={2500}
          onComplete={() => setShowLoading(false)}
        />
      )}

      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased font-sans">
              <Routes>
                {/* Protected Admin Pages */}
                <Route element={<AdminRoute />}>
                  <Route
                    path="/admin"
                    element={<AdminDashboard />}
                  />

                  <Route
                    path="/admin/orders"
                    element={<AdminOrders />}
                  />
                </Route>

                {/* Existing Customer Website */}
                <Route
                  path="/*"
                  element={
                    <CustomerLayout
                      setShowLoading={setShowLoading}
                    />
                  }
                />
              </Routes>
            </div>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
