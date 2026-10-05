import React from 'react'

export const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer ${
              isActive
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-105'
                : 'bg-white hover:bg-slate-100/80 text-slate-700 border border-slate-200/80'
            }`}
          >
            {cat.icon && <span className="text-base">{cat.icon}</span>}
            <span>{cat.name}</span>
          </button>
        )
      })}
    </div>
  )
}

export default CategoryFilter