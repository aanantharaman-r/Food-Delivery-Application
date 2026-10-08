import React from 'react'

export const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-7 overflow-x-auto pb-4 pt-2 scrollbar-none no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id

          return (
            <div
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className="flex flex-col items-center gap-2.5 cursor-pointer shrink-0 group select-none"
            >
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden transition-all duration-300 p-0.5 ${
                  isActive
                    ? 'ring-4 ring-[#ff4c24] ring-offset-2 scale-105'
                    : 'hover:scale-105 border-2 border-transparent'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>

              <span
                className={`text-sm sm:text-base font-medium transition-colors ${
                  isActive ? 'text-[#ff4c24] font-bold' : 'text-slate-600 group-hover:text-slate-900'
                }`}
              >
                {cat.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryFilter