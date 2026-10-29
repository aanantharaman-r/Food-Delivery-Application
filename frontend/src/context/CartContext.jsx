import React, { createContext, useContext, useState, useEffect } from 'react'
import { USER_ADDRESSES } from '../data/mockData'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

const DELIVERY_BASE_FEE = 40
const TAX_RATE = 0.05 // 5% GST
const PACKAGING_FEE = 20

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('foodie_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('foodie_coupon')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('foodie_addresses')
      return saved ? JSON.parse(saved) : USER_ADDRESSES
    } catch {
      return USER_ADDRESSES
    }
  })

  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const defaultAddr = USER_ADDRESSES.find(a => a.isDefault)
    return defaultAddr ? defaultAddr.id : USER_ADDRESSES[0]?.id
  })

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('foodie_orders')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Helper to get consistent item id
  const getItemId = (food) => food._id || food.id

  // Automatically cleanse cart: remove or notify for items that are invalid or null
  useEffect(() => {
    localStorage.setItem('foodie_cart', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem('foodie_coupon', JSON.stringify(appliedCoupon))
  }, [appliedCoupon])

  useEffect(() => {
    localStorage.setItem('foodie_addresses', JSON.stringify(addresses))
  }, [addresses])

  useEffect(() => {
    localStorage.setItem('foodie_orders', JSON.stringify(orders))
  }, [orders])

  const addItem = (food, quantity = 1) => {
    if (!food || food.isAvailable === false) return
    const id = getItemId(food)

    setItems(prev => {
      const existing = prev.find(item => getItemId(item.food) === id)
      if (existing) {
        return prev.map(item =>
          getItemId(item.food) === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { food, quantity }]
    })
  }

  const removeItem = (foodId) => {
    setItems(prev => prev.filter(item => getItemId(item.food) !== foodId))
  }

  const decreaseQuantity = (foodId) => {
    setItems(prev =>
      prev
        .map(item => {
          if (getItemId(item.food) === foodId) {
            return item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : null
          }
          return item
        })
        .filter(Boolean)
    )
  }

  const increaseQuantity = (foodId) => {
    setItems(prev =>
      prev.map(item => {
        if (getItemId(item.food) === foodId) {
          // If marked unavailable, don't increase
          if (item.food.isAvailable === false) return item
          return { ...item, quantity: item.quantity + 1 }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setItems([])
    setAppliedCoupon(null)
  }

  // Remove any unavailable items from cart
  const removeUnavailableItems = () => {
    setItems(prev => prev.filter(i => i.food && i.food.isAvailable !== false))
  }

  // Financial Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.food.price) || 0) * item.quantity,
    0
  )

  const cartCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  // Calculate discount based on coupon
  let discountAmount = 0
  let isFreeDelivery = false

  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.isFreeDelivery) {
      isFreeDelivery = true
    } else if (appliedCoupon.discountPercent) {
      const rawDiscount = (subtotal * appliedCoupon.discountPercent) / 100
      discountAmount = appliedCoupon.maxDiscount
        ? Math.min(rawDiscount, appliedCoupon.maxDiscount)
        : rawDiscount
    }
  }

  const deliveryFee = subtotal === 0 ? 0 : (isFreeDelivery || subtotal > 499 ? 0 : DELIVERY_BASE_FEE)
  const packagingFee = subtotal === 0 ? 0 : PACKAGING_FEE
  const taxableAmount = Math.max(0, subtotal - discountAmount)
  const tax = subtotal === 0 ? 0 : Math.round(taxableAmount * TAX_RATE)
  const grandTotal = Math.max(0, taxableAmount + deliveryFee + packagingFee + tax)

  const applyCoupon = (coupon) => {
    if (subtotal < (coupon.minOrder || 0)) {
      return { success: false, message: `Minimum order of ₹${coupon.minOrder} required for this coupon.` }
    }
    setAppliedCoupon(coupon)
    return { success: true, message: `Coupon "${coupon.code}" applied successfully!` }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  const addAddress = (newAddr) => {
    const id = 'addr-' + Date.now()
    const address = { id, ...newAddr, isDefault: false }
    setAddresses(prev => [...prev, address])
    setSelectedAddressId(id)
  }

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0]

  const placeOrder = ({ paymentMethod, deliveryNotes, savedDbOrder }) => {
    const newOrderId = savedDbOrder?._id
      ? `ORD-${savedDbOrder._id.slice(-6).toUpperCase()}`
      : 'ORD-' + Math.floor(10000 + Math.random() * 90000)

    const restaurantName = items[0]?.food?.restaurantName || 'Foodie Partner Restaurant'

    const newOrder = {
      _id: savedDbOrder?._id,
      id: newOrderId,
      date: 'Just now',
      restaurant: restaurantName,
      restaurantImage:
        items[0]?.food?.image ||
        'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
      items: items.map(i => ({
        food: i.food._id || i.food.id,
        name: i.food.name,
        quantity: i.quantity,
        price: i.food.price
      })),
      itemTotal: subtotal,
      discount: discountAmount,
      deliveryFee,
      tax,
      packagingFee,
      total: grandTotal,
      status: savedDbOrder?.orderStatus || 'Order Placed',
      orderStatus: savedDbOrder?.orderStatus || 'PLACED',
      stepIndex: 0,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      deliveryNotes: deliveryNotes || '',
      deliveryPartner: {
        name: 'David Reynolds',
        rating: 4.95,
        phone: '+91 98765 43210',
        vehicle: 'Yamaha Scooter • TN 09 AB 4321'
      },
      address: selectedAddress
        ? `${selectedAddress.street}, ${selectedAddress.city}`
        : 'Default Delivery Address',
      eta: '25-35 mins'
    }

    setOrders(prev => [newOrder, ...prev])
    clearCart()
    return newOrder
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        removeUnavailableItems,
        cartCount,
        subtotal,
        total: grandTotal,
        deliveryFee,
        packagingFee,
        tax,
        discountAmount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addresses,
        addAddress,
        selectedAddressId,
        setSelectedAddressId,
        selectedAddress,
        orders,
        placeOrder,
        setOrders
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
