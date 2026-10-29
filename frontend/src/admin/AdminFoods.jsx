import React, { useEffect, useState } from 'react'
import {
  UtensilsCrossed,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Eye,
  Check,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const API_BASE = 'http://localhost:5000/api'

export default function AdminFoods() {
  const { token } = useAuth()

  const [foods, setFoods] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Notification states
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  // Modal states: 'add' | 'edit' | 'delete' | null
  const [modalMode, setModalMode] = useState(null)
  const [activeFood, setActiveFood] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isAvailable: true,
    rating: 4.5
  })
  const [formErrors, setFormErrors] = useState({})

  // Fetch foods and categories from real backend MongoDB
  const fetchData = async () => {
    try {
      setLoading(true)
      setFeedback({ type: '', message: '' })

      const [foodsRes, catsRes] = await Promise.all([
        fetch(`${API_BASE}/foods?includeUnavailable=true`),
        fetch(`${API_BASE}/categories`)
      ])

      const foodsData = await foodsRes.json()
      const catsData = await catsRes.json()

      if (foodsData.success) {
        setFoods(foodsData.foods || [])
      }
      if (catsData.success) {
        setCategories(catsData.categories || [])
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Failed to connect to backend server: ' + err.message
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const showNotification = (type, message) => {
    setFeedback({ type, message })
    setTimeout(() => {
      setFeedback({ type: '', message: '' })
    }, 4500)
  }

  const openAddModal = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: categories[0]?._id || '',
      image: '',
      isAvailable: true,
      rating: 4.5
    })
    setFormErrors({})
    setModalMode('add')
  }

  const openEditModal = (food) => {
    setActiveFood(food)
    setFormData({
      name: food.name || '',
      description: food.description || '',
      price: food.price ?? '',
      category: food.category?._id || food.category || categories[0]?._id || '',
      image: food.image || '',
      isAvailable: Boolean(food.isAvailable),
      rating: food.rating || 4.5
    })
    setFormErrors({})
    setModalMode('edit')
  }

  const openDeleteModal = (food) => {
    setActiveFood(food)
    setModalMode('delete')
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Food name is required'
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      errors.price = 'Please provide a valid price (>= 0)'
    }
    if (!formData.category) errors.category = 'Please select a category'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle Create or Update Food
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setSubmitting(true)

      const url =
        modalMode === 'add'
          ? `${API_BASE}/foods`
          : `${API_BASE}/foods/${activeFood._id}`

      const method = modalMode === 'add' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: Number(formData.price),
          category: formData.category,
          image: formData.image.trim(),
          isAvailable: formData.isAvailable,
          rating: Number(formData.rating)
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Operation failed')
      }

      showNotification(
        'success',
        modalMode === 'add'
          ? `"${data.food.name}" was added to the menu!`
          : `"${data.food.name}" was successfully updated!`
      )

      setModalMode(null)
      fetchData()
    } catch (err) {
      showNotification('error', err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Delete Food
  const handleDeleteConfirm = async () => {
    if (!activeFood) return

    try {
      setSubmitting(true)

      const response = await fetch(`${API_BASE}/foods/${activeFood._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Delete failed')
      }

      showNotification('success', `"${activeFood.name}" was deleted successfully.`)
      setModalMode(null)
      setFoods((prev) => prev.filter((item) => item._id !== activeFood._id))
    } catch (err) {
      showNotification('error', err.message || 'Failed to delete food')
    } finally {
      setSubmitting(false)
    }
  }

  // Quick toggle availability directly from table
  const handleToggleAvailability = async (food) => {
    try {
      const updatedAvailability = !food.isAvailable

      // Optimistic update
      setFoods((prev) =>
        prev.map((f) =>
          f._id === food._id ? { ...f, isAvailable: updatedAvailability } : f
        )
      )

      const response = await fetch(`${API_BASE}/foods/${food._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isAvailable: updatedAvailability })
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        // Rollback
        setFoods((prev) =>
          prev.map((f) =>
            f._id === food._id ? { ...f, isAvailable: food.isAvailable } : f
          )
        )
        throw new Error(data.message || 'Failed to update availability')
      }

      showNotification(
        'success',
        `"${food.name}" is now marked as ${
          updatedAvailability ? 'Available' : 'Unavailable'
        }.`
      )
    } catch (err) {
      showNotification('error', err.message)
    }
  }

  // Filter foods locally by search query and category filter
  const filteredFoods = foods.filter((food) => {
    const matchesSearch =
      !searchQuery.trim() ||
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (food.description &&
        food.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const catId = food.category?._id || food.category
    const catName = food.category?.name?.toLowerCase() || ''
    const matchesCat =
      selectedCategory === 'all' ||
      catId === selectedCategory ||
      catName === selectedCategory.toLowerCase()

    return matchesSearch && matchesCat
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 mb-1">
            <UtensilsCrossed size={15} />
            <span>Catalog Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Food Menu Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, modify, toggle availability, and delete customer dishes in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer shadow-2xs"
            title="Refresh from MongoDB"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-200 hover:from-orange-600 hover:to-orange-700 transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Dish</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert Bar */}
      {feedback.message && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl text-xs sm:text-sm font-medium border animate-in fade-in duration-200 ${
            feedback.type === 'error'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'error' ? (
              <AlertCircle size={18} className="shrink-0 text-rose-500" />
            ) : (
              <CheckCircle size={18} className="shrink-0 text-emerald-500" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback({ type: '', message: '' })}
            className="p-1 hover:opacity-70 rounded-md"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search dish name, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-400 shrink-0">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">All Categories ({foods.length})</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="text-xs text-slate-400 ml-auto md:ml-3">
            Showing <span className="font-bold text-slate-700">{filteredFoods.length}</span> items
          </div>
        </div>
      </div>

      {/* Foods Table / Grid */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw size={28} className="animate-spin mx-auto text-orange-500" />
            <p className="text-sm font-semibold">Loading dishes from MongoDB...</p>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <UtensilsCrossed size={36} className="mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No food items found.</p>
            <p className="text-xs text-slate-400">
              {searchQuery ? 'Try adjusting your search criteria.' : 'Click "Add New Dish" to add foods.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#fff9f4] border-b border-orange-100 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Dish</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFoods.map((food) => {
                  const catName = food.category?.name || 'General'
                  return (
                    <tr
                      key={food._id}
                      className="hover:bg-orange-50/30 transition-colors duration-150"
                    >
                      {/* Image & Name & Description */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                            {food.image ? (
                              <img
                                src={food.image}
                                alt={food.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.onerror = null
                                  e.currentTarget.src =
                                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
                                }}
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-slate-400">
                                <ImageIcon size={20} />
                              </div>
                            )}
                          </div>
                          <div className="max-w-xs sm:max-w-md">
                            <div className="font-bold text-slate-900 text-sm">{food.name}</div>
                            <div className="text-xs text-slate-500 truncate mt-0.5 line-clamp-1">
                              {food.description || 'No description provided.'}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">
                              ID: {food._id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200/70">
                          <Tag size={12} />
                          {catName}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900 text-sm">
                        ₹{food.price}
                      </td>

                      {/* Availability Toggle */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleAvailability(food)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer border ${
                            food.isAvailable
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                          title="Click to toggle availability"
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              food.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <span>{food.isAvailable ? 'Available' : 'Unavailable'}</span>
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(food)}
                            className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                            title="Edit food"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(food)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete food"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-orange-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <UtensilsCrossed size={18} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {modalMode === 'add' ? 'Add New Food Item' : 'Edit Food Item'}
                </h3>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Classic Truffle Burger"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${
                    formErrors.name
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:ring-orange-300'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Fresh ingredients, flavor profile, sauces..."
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              {/* Price & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 199"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${
                      formErrors.price
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-200 focus:ring-orange-300'
                    }`}
                  />
                  {formErrors.price && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                {formData.image && (
                  <div className="mt-2 flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-10 w-10 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <span className="text-[11px] text-slate-500">Image preview valid</span>
                  </div>
                )}
              </div>

              {/* Availability checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="availCheck"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 cursor-pointer"
                />
                <label htmlFor="availCheck" className="text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                  Available for customer ordering
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200 hover:from-orange-600 hover:to-orange-700 transition cursor-pointer disabled:opacity-60"
                >
                  {submitting
                    ? 'Saving...'
                    : modalMode === 'add'
                    ? 'Add Food to Menu'
                    : 'Update Food'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalMode === 'delete' && activeFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Delete Food Item?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-bold text-slate-800">"{activeFood.name}"</span> from the
                menu? This action will remove it permanently from MongoDB and customer menu pages.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                No, Keep it
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-200 transition cursor-pointer disabled:opacity-60"
              >
                {submitting ? 'Deleting...' : 'Yes, Delete Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

