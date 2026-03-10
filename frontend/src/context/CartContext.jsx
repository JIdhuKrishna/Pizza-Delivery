import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (pizza) => {
    setCart(prev => {
      // Check if item already exists in cart (based on ID and if it's not a unique custom build)
      const existingItemIndex = prev.findIndex(item => item._id === pizza._id && !item.isCustom)
      
      if (existingItemIndex > -1) {
        const newCart = [...prev]
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: (newCart[existingItemIndex].quantity || 1) + 1
        }
        return newCart
      }
      
      return [...prev, { ...pizza, quantity: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id))
  }

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item._id === id) {
        const newQty = Math.max(1, (item.quantity || 1) + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0)
  const cartCount = cart.reduce((count, item) => count + (item.quantity || 1), 0)

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartTotal, 
      cartCount 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
