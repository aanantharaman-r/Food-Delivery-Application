import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/Toast'

// Navigation & Layout Components
import { Navbar } from './components/Navbar'
import { MobileNav } from './components/MobileNav'
import { Footer } from './components/Footer'

// Pages
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased font-sans">
              
              {/* Sticky Modern Top Navigation */}
              <Navbar />

              {/* Main Routing Container */}
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

              {/* Tomato style Footer */}
              <Footer />

              {/* Mobile App-Style Bottom Tab Navigation */}
              <MobileNav />

            </div>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
