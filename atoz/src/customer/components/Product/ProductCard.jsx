import React from 'react'
import './ProductCard.css'
import { useCart } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'

function formatINR(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '₹0'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

function ProductCard({ product }) {
  const { addToCart, openCart } = useCart()
  const navigate = useNavigate()

  const imageSrc = product?.image ?? ''
  const name = product?.name ?? 'Product'
  const brand = product?.brand ?? ''
  const price = Number(product?.price) || 0
  const inStock = (Number(product?.stock) || 0) > 0

  const handleAdd = (e) => {
    // prevent parent click navigation
    e?.preventDefault?.()
    e?.stopPropagation?.()
    addToCart(
      {
        id: product?.id,
        name,
        brand,
        price,
        image: imageSrc,
      },
      1,
    )
    openCart()
  }

  return (
    <div 
      onClick={() => navigate(`/product/${product?.id || product?._id}`)}
      className="ProductCard m-3 w-[15rem] cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="h-[14rem] bg-gray-100">
        {imageSrc ? (
          <img className="h-full w-full object-cover object-center" src={imageSrc} alt={name} />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-400">No image</div>
        )}
      </div>

      <div className="textPart space-y-3 p-4">
        <div className="min-h-[3.25rem]">
          {brand ? <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{brand}</p> : null}
          <p className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900">{name}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-base font-bold text-gray-900">{formatINR(price)}</p>
          
        </div>
        {!inStock ? <p className="text-xs font-semibold text-rose-600">Out of stock</p> : null}
      </div>

    </div>
  )
}

export default ProductCard;