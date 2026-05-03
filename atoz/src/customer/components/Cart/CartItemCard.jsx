import React, { useMemo } from 'react'

function formatCurrency(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '₹0'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

export default function CartItemCard({ item, onIncrease, onDecrease, onRemove }) {
  const total = useMemo(() => (Number(item.price) || 0) * (Number(item.quantity) || 0), [item.price, item.quantity])

  return (
    <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">{item.name}</p>
            <p className="mt-0.5 text-xs text-gray-500">{formatCurrency(item.price)} each</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md px-2 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label={`Remove ${item.name} from cart`}
          >
            Remove
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white">
            <button
              type="button"
              onClick={onDecrease}
              className="h-9 w-9 rounded-l-lg text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Decrease quantity of ${item.name}`}
              disabled={(Number(item.quantity) || 0) <= 1}
            >
              −
            </button>
            <div className="flex h-9 min-w-10 items-center justify-center px-3 text-sm font-semibold text-gray-900">
              {item.quantity}
            </div>
            <button
              type="button"
              onClick={onIncrease}
              className="h-9 w-9 rounded-r-lg text-gray-700 transition hover:bg-gray-50"
              aria-label={`Increase quantity of ${item.name}`}
            >
              +
            </button>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500">Item total</p>
            <p className="text-sm font-bold text-gray-900">{formatCurrency(total)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

