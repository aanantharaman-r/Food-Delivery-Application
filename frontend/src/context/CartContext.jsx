import React, { createContext, useContext, useState, useEffect } from 'react'
import { USER_ADDRESSES } from '../data/mockData'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

const DELIVERY_BASE_FEE = 2.99
const TAX_RATE = 0.08 // 8% sales & service tax
const PACKAGING_FEE = 1.25

const INITIAL_ORDERS = [
  {
    id: 'ORD-98214',
    date: 'Today, 12:45 PM',
    restaurant: 'The Burger Barn & Grill',
    restaurantImage: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80',
    items: [
      { name: 'Truffle Smash Cheeseburger', quantity: 2, price: 13.99 },
      { name: 'Loaded Truffle & Bacon Fries', quantity: 1, price: 6.99 }
    ],
    itemTotal: 34.97,
    discount: 5.00,
    deliveryFee: 0,
    tax: 2.40,
    total: 32.37,
    status: 'Out for Delivery',
    stepIndex: 3, // 0: Placed, 1: Confirmed, 2: Preparing, 3: Out for delivery, 4: Delivered
    deliveryPartner: {
      name: 'Michael Davis',
      rating: 4.9,
      phone: '+1 (555) 789-0123',
      vehicle: 'Honda Activa • NY 4829'
    },
    address: 'Apt 4B, Emerald Green Residency, 74 Elm Street',
    eta: '10-15 mins'
  },
  {
    id: 'ORD-84192',
    date: 'Yesterday, 8:15 PM',
    restaurant: 'Artisan Woodfire Pizza Co.',
    restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    items: [
      { name: 'Diavola Pepperoni & Hot Honey', quantity: 1, price: 17.49 },
      { name: 'Creamy Truffle Wild Mushroom Pasta', quantity: 1, price: 16.99 }
    ],
    itemTotal: 34.48,
    discount: 8.00,
    deliveryFee: 2.99,
    tax: 2.36,
    total: 31.83,
    status: 'Delivered',
    stepIndex: 4,
    deliveryPartner: {
      name: 'Carlos Ruiz',
      rating: 4.8,
      phone: '+1 (555) 321-9876',
      vehicle: 'E-Bike Delivery'
    },
    address: 'Apt 4B, Emerald Green Residency, 74 Elm Street',
    eta: 'Delivered'
  }
]

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('foodie_cart')
    return saved ? JSON.parse(saved) : []
  })

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem('foodie_coupon')
    return saved ? JSON.parse(saved) : null
  })

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('foodie_addresses')
    return saved ? JSON.parse(saved) : USER_ADDRESSES
  })

  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const defaultAddr = USER_ADDRESSES.find(a => a.isDefault)
    return defaultAddr ? defaultAddr.id : USER_ADDRESSES[0]?.id
  })

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('foodie_orders')
    return saved ? JSON.parse(saved) : INITIAL_ORDERS
  })

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
    setItems(prev => {
      const existing = prev.find(item => item.food.id === food.id)
      if (existing) {
        return prev.map(item =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { food, quantity }]
    })
  }

  const removeItem = (foodId) => {
    setItems(prev => prev.filter(item => item.food.id !== foodId))
  }

  const decreaseQuantity = (foodId) => {
    setItems(prev => prev.map(item => {
      if (item.food.id === foodId) {
        return item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : null
      }
      return item
    }).filter(Boolean))
  }

  const increaseQuantity = (foodId) => {
    setItems(prev => prev.map(item =>
      item.food.id === foodId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ))
  }

  const clearCart = () => {
    setItems([])
    setAppliedCoupon(null)
  }

  // Financial Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + (item.food.price * item.quantity),
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

  const deliveryFee = subtotal === 0 ? 0 : (isFreeDelivery || subtotal > 40 ? 0 : DELIVERY_BASE_FEE)
  const packagingFee = subtotal === 0 ? 0 : PACKAGING_FEE
  const taxableAmount = Math.max(0, subtotal - discountAmount)
  const tax = subtotal === 0 ? 0 : (taxableAmount * TAX_RATE)
  const grandTotal = Math.max(0, taxableAmount + deliveryFee + packagingFee + tax)

  const applyCoupon = (coupon) => {
    if (subtotal < (coupon.minOrder || 0)) {
      return { success: false, message: `Minimum order of $${coupon.minOrder} required for this coupon.` }
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

  const placeOrder = ({ paymentMethod, deliveryNotes }) => {
    const newOrderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000)
    const restaurantName = items[0]?.food?.restaurantName || 'Foodie Partner Restaurant'
    const newOrder = {
      id: newOrderId,
      date: 'Just now',
      restaurant: restaurantName,
      restaurantImage: items[0]?.food?.image || 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
      items: items.map(i => ({
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
      status: 'Order Placed',
      stepIndex: 0,
      paymentMethod: paymentMethod || 'Credit Card (••• 4242)',
      deliveryNotes: deliveryNotes || '',
      deliveryPartner: {
        name: 'David Reynolds',
        rating: 4.95,
        phone: '+1 (555) 432-1098',
        vehicle: 'Yamaha Scooter • NY 7721'
      },
      address: selectedAddress?.street + ', ' + selectedAddress?.city,
      eta: '25-35 mins'
    }

    setOrders(prev => [newOrder, ...prev])
    clearCart()
    return newOrder
  }

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      decreaseQuantity,
      increaseQuantity,
      clearCart,
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
    }}>
      {children}
    </CartContext.Provider>
  )
}
export default CartContext