import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, UtensilsCrossed } from 'lucide-react'

export const Footer = () => {
  return (
    <footer id="contact-us" className="bg-[#32324d] text-slate-300 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
          
          {/* Col 1: Foodie Logo & Intro & Social Icons */}
          <div className="md:col-span-5 space-y-5">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#ff4c24] to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform ring-2 ring-orange-500/10">
                <UtensilsCrossed className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-3xl font-black text-[#ff4c24] tracking-tight">
                Foodie<span className="text-[#ff4c24]">.</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#facebook"
                className="w-10 h-10 rounded-full border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#ff4c24] hover:bg-[#ff4c24] transition-all"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#twitter"
                className="w-10 h-10 rounded-full border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#ff4c24] hover:bg-[#ff4c24] transition-all"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="#linkedin"
                className="w-10 h-10 rounded-full border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#ff4c24] hover:bg-[#ff4c24] transition-all"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: COMPANY Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <a href="#about-us" className="hover:text-white transition-colors">About us</a>
              </li>
              <li>
                <a href="#delivery" className="hover:text-white transition-colors">Delivery</a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">Privacy policy</a>
              </li>
            </ul>
          </div>

          {/* Col 3: GET IN TOUCH */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">
              GET IN TOUCH
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#ff4c24]" />
                <span>+1-212-456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#ff4c24]" />
                <span>contact@foodie.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="pt-8 border-t border-slate-700/80 text-center text-xs text-slate-400">
          <p>Copyright {new Date().getFullYear()} © Foodie.com - All Right Reserved.</p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
