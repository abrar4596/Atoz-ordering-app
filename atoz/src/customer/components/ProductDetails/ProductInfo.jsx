import { memo, useMemo } from 'react'
import { ReviewsSection } from './ReviewsSection'
import { cn } from './cn'

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function ProductInfoComponent({
  product,
  reviews,
  selectedFlavor,
  onFlavorChange,
  selectedWeight,
  onWeightChange,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
}) {
  const selectedWeightMeta = useMemo(
    () => product.weightOptions.find((w) => w.value === selectedWeight),
    [product.weightOptions, selectedWeight],
  )
  const globallyAvailable = product.stockStatus !== 'out_of_stock'
  const inStock = globallyAvailable && selectedWeightMeta?.inStock !== false
  const discountPct =
    product.mrp && product.price < product.mrp
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0

  const stockLabel =
    product.stockStatus === 'out_of_stock' || !inStock
      ? 'Out of stock'
      : product.stockStatus === 'low_stock'
        ? 'Low stock'
        : 'In stock'

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-500">
          {product.brand}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{product.description}</p>
      </header>

      <ReviewsSection reviews={reviews} />

      <div className="flex flex-wrap items-end gap-3 border-b border-zinc-800 pb-6">
        <div>
          <p className="text-3xl font-bold text-zinc-50">{formatINR(product.price)}</p>
          {product.mrp && product.mrp > product.price && (
            <p className="mt-1 text-sm text-zinc-500">
              <span className="line-through">{formatINR(product.mrp)}</span>
              {discountPct > 0 && (
                <span className="ml-2 font-semibold text-orange-400">{discountPct}% off</span>
              )}
            </p>
          )}
        </div>
        <span
          className={cn(
            'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
            stockLabel === 'In stock' && 'bg-emerald-500/15 text-emerald-400',
            stockLabel === 'Low stock' && 'bg-orange-500/15 text-orange-400',
            stockLabel === 'Out of stock' && 'bg-red-500/15 text-red-400',
          )}
        >
          {stockLabel}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2">
          <dt className="text-zinc-500">Protein / serving</dt>
          <dd className="font-semibold text-zinc-100">{product.proteinPerServing}</dd>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2">
          <dt className="text-zinc-500">Serving size</dt>
          <dd className="font-semibold text-zinc-100">{product.servingSize}</dd>
        </div>
        <div className="col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 sm:col-span-1">
          <dt className="text-zinc-500">Servings / container</dt>
          <dd className="font-semibold text-zinc-100">{product.servingsPerContainer}</dd>
        </div>
      </dl>

      <div className="space-y-6">
        <fieldset>
          <legend className="text-sm font-semibold text-zinc-200">Flavor</legend>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Select flavor">
            {product.flavors.map((flavor) => (
              <label
                key={flavor}
                className={cn(
                  'cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 focus-within:ring-offset-zinc-950',
                  selectedFlavor === flavor
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                    : 'border-zinc-700 text-zinc-300 hover:border-zinc-500',
                )}
              >
                <input
                  type="radio"
                  name="flavor"
                  value={flavor}
                  checked={selectedFlavor === flavor}
                  onChange={() => onFlavorChange(flavor)}
                  className="sr-only"
                />
                {flavor}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-zinc-200">Weight</legend>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Select weight">
            {product.weightOptions.map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  'rounded-lg border px-4 py-2 text-sm font-medium transition focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 focus-within:ring-offset-zinc-950',
                  !opt.inStock && 'cursor-not-allowed opacity-40',
                  opt.inStock && 'cursor-pointer',
                  selectedWeight === opt.value && opt.inStock
                    ? 'border-orange-500 bg-orange-500/10 text-orange-200'
                    : opt.inStock
                      ? 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
                      : 'border-zinc-800 text-zinc-600',
                )}
              >
                <input
                  type="radio"
                  name="weight"
                  value={opt.value}
                  checked={selectedWeight === opt.value}
                  disabled={!opt.inStock}
                  onChange={() => onWeightChange(opt.value)}
                  className="sr-only"
                />
                {opt.value}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="product-qty" className="text-sm font-semibold text-zinc-200">
            Quantity
          </label>
          <div className="mt-3 flex max-w-[200px] items-center rounded-lg border border-zinc-700 bg-zinc-900/50">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="px-4 py-2.5 text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-40"
            >
              −
            </button>
            <input
              id="product-qty"
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e) => {
                const n = parseInt(e.target.value, 10)
                if (!Number.isNaN(n)) onQuantityChange(Math.min(99, Math.max(1, n)))
              }}
              className="w-full border-x border-zinc-700 bg-transparent py-2.5 text-center text-sm font-semibold text-zinc-100 focus:outline-none"
            />
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= 99}
              onClick={() => onQuantityChange(Math.min(99, quantity + 1))}
              className="px-4 py-2.5 text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Desktop inline CTAs */}
      <div className="hidden gap-3 sm:flex">
        <button
          type="button"
          disabled={!inStock}
          onClick={onAddToCart}
          className="flex-1 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add to cart
        </button>
        <button
          type="button"
          disabled={!inStock}
          onClick={onBuyNow}
          className="flex-1 rounded-xl border-2 border-orange-500 bg-orange-500/10 px-6 py-3.5 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buy now
        </button>
      </div>
    </div>
  )
}

export const ProductInfo = memo(ProductInfoComponent)
