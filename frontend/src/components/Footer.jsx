import React from 'react'
import { Link } from 'react-router-dom'
import { UtensilsCrossed, Heart, ShieldCheck, Truck, Headphones, Sparkles } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Lightning Fast</h4>
              <p className="text-xs text-slate-400">Under 30 mins delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">100% Hygienic</h4>
              <p className="text-xs text-slate-400">Certified kitchen partners</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Live Tracking</h4>
              <p className="text-xs text-slate-400">Real-time GPS updates</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">24/7 Support</h4>
              <p className="text-xs text-slate-400">Always here to help</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-rose-500 flex items-center justify-center shadow-lg">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Foodie<span className="text-orange-500">.</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              Experience gourmet dining delivered to your doorstep. From woodfired pizzas to spicy street tacos and authentic sushi bowls.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for food lovers everywhere</span>
            </div>
          </div>

          <div>
            <h5 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Navigation</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-orange-400 transition-colors">Home</Link></li>
              <li><Link to="/restaurants" className="hover:text-orange-400 transition-colors">All Restaurants</Link></li>
              <li><Link to="/cart" className="hover:text-orange-400 transition-colors">My Cart</Link></li>
              <li><Link to="/my-orders" className="hover:text-orange-400 transition-colors">Live Order Status</Link></li>
              <li><Link to="/profile" className="hover:text-orange-400 transition-colors">Manage Profile</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Top Cuisines</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/restaurants?category=burgers" className="hover:text-orange-400 transition-colors">Gourmet Burgers</Link></li>
              <li><Link to="/restaurants?category=pizza" className="hover:text-orange-400 transition-colors">Woodfire Pizza</Link></li>
              <li><Link to="/restaurants?category=sushi" className="hover:text-orange-400 transition-colors">Japanese Sushi</Link></li>
              <li><Link to="/restaurants?category=biryani" className="hover:text-orange-400 transition-colors">Hyderabadi Biryani</Link></li>
              <li><Link to="/restaurants?category=mexican" className="hover:text-orange-400 transition-colors">Crispy Tacos</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Popular Cities</h5>
            <ul className="space-y-2.5 text-sm">
              <li className="text-slate-400">New York City</li>
              <li className="text-slate-400">San Francisco</li>
              <li className="text-slate-400">Austin, Texas</li>
              <li className="text-slate-400">Chicago</li>
              <li className="text-slate-400">Seattle</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 text-center md:flex md:justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Foodie Technologies Inc. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4 md:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookie Settings</span>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
