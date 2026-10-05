import React, { useState } from 'react'
import { MapPin, Plus, Check, Home, Briefcase, Navigation } from 'lucide-react'
import { useCart } from '../context/CartContext'

export const AddressSelector = () => {
  const { addresses, selectedAddressId, setSelectedAddressId, addAddress } = useCart()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newLabel, setNewLabel] = useState('Home')
  const [newStreet, setNewStreet] = useState('')
  const [newCity, setNewCity] = useState('')
  const [newPhone, setNewPhone] = useState('')

  const handleCreateAddress = (e) => {
    e.preventDefault()
    if (!newStreet || !newCity) return

    addAddress({
      label: newLabel,
      street: newStreet,
      city: newCity,
      phone: newPhone || '+1 (555) 000-0000',
      type: newLabel.toLowerCase().includes('work') ? 'work' : 'home'
    })

    setNewStreet('')
    setNewCity('')
    setNewPhone('')
    setShowAddModal(false)
  }

  const getIcon = (type) => {
    if (type === 'work') return <Briefcase className="w-4 h-4 text-purple-500" />
    if (type === 'home') return <Home className="w-4 h-4 text-orange-500" />
    return <Navigation className="w-4 h-4 text-blue-500" />
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
            <MapPin className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Delivery Address</h3>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New
        </button>
      </div>

      {/* Address cards list */}
      <div className="space-y-3">
        {addresses.map((addr) => {
          const isSelected = addr.id === selectedAddressId

          return (
            <div
              key={addr.id}
              onClick={() => setSelectedAddressId(addr.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                isSelected
                  ? 'border-orange-500 bg-orange-50/40 shadow-xs'
                  : 'border-slate-200/80 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="mt-0.5 p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                {getIcon(addr.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {addr.street}
                </p>
                <p className="text-xs text-slate-400">{addr.city}</p>
                {addr.phone && (
                  <p className="text-[11px] text-slate-500 mt-1">Phone: {addr.phone}</p>
                )}
              </div>

              <div className="mt-1">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500 text-white'
                    : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add New Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h4 className="text-lg font-bold text-slate-900 mb-4">Add New Delivery Address</h4>
            
            <form onSubmit={handleCreateAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Address Label</label>
                <div className="flex gap-2">
                  {['Home', 'Office', 'Other'].map(lbl => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewLabel(lbl)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                        newLabel === lbl 
                          ? 'border-orange-500 bg-orange-50 text-orange-600' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 742 Evergreen Terrace, Apt 5"
                  value={newStreet}
                  onChange={e => setNewStreet(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">City, State & Zip Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Springfield, OR 97477"
                  value={newCity}
                  onChange={e => setNewCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="e.g. +1 (555) 123-4567"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-500/20"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddressSelector
