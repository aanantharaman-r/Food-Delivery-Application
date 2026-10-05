import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Clock, MapPin, Sparkles } from 'lucide-react'

export const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="group block bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-orange-200/60 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Banner / Food Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {restaurant.featured ? (
            <span className="flex items-center gap-1 bg-amber-500/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3" /> Promoted
            </span>
          ) : (
            <div />
          )}

          {restaurant.offer && (
            <span className="bg-rose-600/95 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
              {restaurant.offer}
            </span>
          )}
        </div>

        {/* Rating Floating Over Image Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{restaurant.rating}</span>
            <span className="text-white/70 text-[10px]">({restaurant.ratingCount})</span>
          </div>

          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3 text-orange-400" />
            <span>{restaurant.deliveryTime}</span>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
            {restaurant.priceRange}
          </span>
        </div>

        <p className="text-xs text-slate-500 font-medium mb-3 line-clamp-1">
          {restaurant.cuisine}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{restaurant.distance}</span>
          </div>
          <span className="font-semibold text-slate-700">{restaurant.priceForTwo}</span>
        </div>
      </div>
    </Link>
  )
}

export default RestaurantCard