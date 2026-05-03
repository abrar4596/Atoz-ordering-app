import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'atoz_cart_v1'

function safeParse(json) {
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

function getProductId(product) {
  return product?._id ?? product?.id ?? product?.productId ?? null
}

function getProductName(product) {
  return product?.title ?? product?.name ?? product?.productName ?? 'Product'
}

function getProductImage(product) {
  return (
    product?.imageUrl ??
    product?.image ??
    product?.thumbnail ??
    (Array.isArray(product?.images) ? product.images[0] : null) ??
    ''
  )
}

function getProductPrice(product) {
  const candidate =
    product?.price ??
    product?.discountedPrice ??
    product?.sellingPrice ??
    product?.salePrice ??
    product?.mrp
  const n = Number(candidate)
  return Number.isFinite(n) ? n : 0
}

function normalizeProduct(product) {
  const id = getProductId(product)
  if (!id) return null

  return {
    id: String(id),
    name: String(getProductName(product)),
    price: getProductPrice(product),
    image: String(getProductImage(product) ?? ''),
    raw: product, // keep original for future backend integration
  }
}

function clampQuantity(qty) {
  const n = Number(qty)
  if (!Number.isFinite(n)) return 1
  return Math.max(1, Math.floor(n))
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      const items = Array.isArray(action.payload) ? action.payload : []
      return { ...state, cartItems: items }
    }
    case 'ADD': {
      const { item, quantity = 1 } = action.payload
      const q = clampQuantity(quantity)
      const existing = state.cartItems.find((x) => x.id === item.id)
      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) => (x.id === item.id ? { ...x, quantity: x.quantity + q } : x)),
        }
      }
      return { ...state, cartItems: [...state.cartItems, { ...item, quantity: q }] }
    }
    case 'REMOVE': {
      const id = String(action.payload)
      return { ...state, cartItems: state.cartItems.filter((x) => x.id !== id) }
    }
    case 'UPDATE_QTY': {
      const { id, quantity } = action.payload
      const nextQty = Number(quantity)
      if (!Number.isFinite(nextQty)) return state
      if (nextQty <= 0) {
        return { ...state, cartItems: state.cartItems.filter((x) => x.id !== String(id)) }
      }
      return {
        ...state,
        cartItems: state.cartItems.map((x) => (x.id === String(id) ? { ...x, quantity: clampQuantity(nextQty) } : x)),
      }
    }
    case 'CLEAR': {
      return { ...state, cartItems: [] }
    }
    case 'OPEN_CART': {
      return { ...state, isCartOpen: true }
    }
    case 'CLOSE_CART': {
      return { ...state, isCartOpen: false }
    }
    case 'TOGGLE_CART': {
      return { ...state, isCartOpen: !state.isCartOpen }
    }
    default:
      return state
  }
}

const initialState = { cartItems: [], isCartOpen: false }

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (stored && Array.isArray(stored.cartItems)) {
      dispatch({ type: 'HYDRATE', payload: stored.cartItems })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cartItems: state.cartItems }))
  }, [state.cartItems])

  const api = useMemo(() => {
    const cartItems = state.cartItems
    const isCartOpen = Boolean(state.isCartOpen)

    function addToCart(product, quantity = 1) {
      const item = normalizeProduct(product)
      if (!item) return
      dispatch({ type: 'ADD', payload: { item, quantity } })
    }

    function removeFromCart(productId) {
      if (productId == null) return
      dispatch({ type: 'REMOVE', payload: productId })
    }

    function updateQuantity(productId, quantity) {
      if (productId == null) return
      dispatch({ type: 'UPDATE_QTY', payload: { id: productId, quantity } })
    }

    function clearCart() {
      dispatch({ type: 'CLEAR' })
    }

    function openCart() {
      dispatch({ type: 'OPEN_CART' })
    }

    function closeCart() {
      dispatch({ type: 'CLOSE_CART' })
    }

    function toggleCart() {
      dispatch({ type: 'TOGGLE_CART' })
    }

    const itemCount = cartItems.reduce((sum, x) => sum + (Number(x.quantity) || 0), 0)
    const subtotal = cartItems.reduce((sum, x) => sum + (Number(x.price) || 0) * (Number(x.quantity) || 0), 0)

    return {
      cartItems,
      itemCount,
      subtotal,
      isCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    }
  }, [state.cartItems, state.isCartOpen])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}

