import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Linkedin, Mail, Phone } from 'lucide-react'

export const Footer = () => {
  return (
    <footer id="contact-us" className="bg-[#32324d] text-slate-300 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
          
          {/* Col 1: Tomato Logo & Intro & Social Icons */}
          <div className="md:col-span-5 space-y-5">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-black text-[#ff4c24] tracking-tight">
                Tomato<span className="text-[#ff4c24]">.</span>
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
                <Facebook className="w-4 h-4 fill-current" />
              </a>
              <a
                href="#twitter"
                className="w-10 h-10 rounded-full border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#ff4c24] hover:bg-[#ff4c24] transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 fill-current" />
              </a>
              <a
                href="#linkedin"
                className="w-10 h-10 rounded-full border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#ff4c24] hover:bg-[#ff4c24] transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 fill-current" />
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
                <span>contact@tomato.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="pt-8 border-t border-slate-700/80 text-center text-xs text-slate-400">
          <p>Copyright {new Date().getFullYear()} © Tomato.com - All Right Reserved.</p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
