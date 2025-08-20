interface CartItem {
  id: string
  name: string
  image: string
  size: string
  price: number
  quantity: number
  license?: string
}

interface CartSession {
  cart: CartItem[]
  deliveryOption: string
  deliveryPrice: number
  totalAmount: number
  customerData: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  timestamp: number
}

export function saveCartForCheckout(
  cart: CartItem[], 
  deliveryOption: string, 
  deliveryPrice: number, 
  totalAmount: number,
  customerData: CartSession['customerData']
): string {
  const sessionId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const cartSession: CartSession = {
    cart,
    deliveryOption,
    deliveryPrice,
    totalAmount,
    customerData,
    timestamp: Date.now()
  }
  
  try {
    localStorage.setItem(sessionId, JSON.stringify(cartSession))
    console.log('Cart data saved for checkout:', sessionId)
  } catch (error) {
    console.error('Failed to save cart data:', error)
  }
  
  return sessionId
}

export function getCartFromStorage(sessionId: string): CartSession | null {
  try {
    const storedData = localStorage.getItem(sessionId)
    if (!storedData) return null
    
    const cartSession: CartSession = JSON.parse(storedData)
    
    // Check if data is not too old (24 hours)
    const isExpired = Date.now() - cartSession.timestamp > 24 * 60 * 60 * 1000
    
    if (isExpired) {
      localStorage.removeItem(sessionId)
      return null
    }
    
    return cartSession
  } catch (error) {
    console.error('Failed to retrieve cart data:', error)
    return null
  }
}

export function removeCartFromStorage(sessionId: string): void {
  try {
    localStorage.removeItem(sessionId)
    console.log('Cart data removed from storage:', sessionId)
  } catch (error) {
    console.error('Failed to remove cart data:', error)
  }
}

export function clearExpiredCartData(): void {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('cart_')) {
        const storedData = localStorage.getItem(key)
        if (storedData) {
          const cartSession: CartSession = JSON.parse(storedData)
          const isExpired = Date.now() - cartSession.timestamp > 24 * 60 * 60 * 1000
          if (isExpired) {
            localStorage.removeItem(key)
          }
        }
      }
    })
  } catch (error) {
    console.error('Failed to clear expired cart data:', error)
  }
}