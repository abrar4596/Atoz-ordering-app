import React, { useCallback, useEffect, useMemo } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useCart } from '../../context/CartContext'
import CartItemCard from './CartItemCard'
import { useNavigate } from 'react-router-dom'

function formatCurrency(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '₹0'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

export default function CartItems({ isOpen, onClose }) {
  const { cartItems, subtotal, updateQuantity, removeFromCart } = useCart()
  const navigate = useNavigate()

  const hasItems = cartItems.length > 0
  const handleClose = useCallback(() => {
    if (typeof onClose === 'function') onClose()
  }, [onClose])

  const subtotalLabel = useMemo(() => formatCurrency(subtotal), [subtotal])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, handleClose])

  // Prevent background scrolling while open
  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  return (
    <div
      className={`fixed inset-0 z-[70] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      {/* Overlay */}
      <button
        type="button"
        onClick={handleClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Close cart overlay"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
            <div>
              <p className="text-base font-bold text-gray-900">Your Cart</p>
              <p className="text-xs text-gray-500">Review items and proceed to checkout</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close cart"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {!hasItems ? (
              <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                <p className="text-sm font-semibold text-gray-900">Cart is empty</p>
                <p className="mt-1 text-xs text-gray-600">Add some products to see them here.</p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onIncrease={() => updateQuantity(item.id, (Number(item.quantity) || 1) + 1)}
                    onDecrease={() => updateQuantity(item.id, (Number(item.quantity) || 1) - 1)}
                    onRemove={() => removeFromCart(item.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Subtotal</p>
              <p className="text-sm font-bold text-gray-900">{subtotalLabel}</p>
            </div>
            <p className="mt-1 text-xs text-gray-500">Shipping and taxes are calculated at checkout.</p>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                disabled={!hasItems}
                onClick={() => {
                  navigate('/checkout')
                  handleClose()
                }}
                className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Checkout
              </button>
              <button
                type="button"
                disabled={!hasItems}
                onClick={() => {
                  navigate('/cart')
                  handleClose()
                }}
                className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                View full cart
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

