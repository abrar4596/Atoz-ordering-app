import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BenefitsList } from './BenefitsList'
import { NutritionTable } from './NutritionTable'
import { ProductImageGallery } from './ProductImageGallery'
import { ProductInfo } from './ProductInfo'
import { sampleReviews, sampleSupplementProduct } from './productSampleData'
import { useCart } from '../../context/CartContext'

/**
 * Supplement product details page — pass `product` and `reviews` from API when wiring MERN.
 */
export default function ProductDetails({
  product: productProp,
  reviews: reviewsProp,
  onAddToCart: onAddToCartProp,
  onBuyNow: onBuyNowProp,
}) {
  const { id } = useParams()
  const product = productProp ?? sampleSupplementProduct
  const reviews = reviewsProp ?? sampleReviews
  const { addToCart, openCart } = useCart()

  // In a real app, you would fetch the product by id here
  useEffect(() => {
    if (id) {
      console.log('Fetching product with id:', id)
    }
  }, [id])

  const [selectedFlavor, setSelectedFlavor] = useState(() => product.flavors[0] ?? '')
  const [selectedWeight, setSelectedWeight] = useState(() => {
    const first = product.weightOptions.find((w) => w.inStock)
    return (first ?? product.weightOptions[0])?.value ?? ''
  })
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    document.title = `${product.name} — ${product.brand}`
  }, [product.brand, product.name])

  useEffect(() => {
    const firstW = product.weightOptions.find((w) => w.inStock)
    setSelectedFlavor(product.flavors[0] ?? '')
    setSelectedWeight((firstW ?? product.weightOptions[0])?.value ?? '')
    setQuantity(1)
  }, [product.id]) // eslint-disable-line react-hooks/exhaustive-deps -- reset only when product.id changes

  const handleAddToCart = useCallback(() => {
    const payload = {
      productId: product.id,
      name: product.name,
      image: product.images?.[0] ?? '',
      flavor: selectedFlavor,
      weight: selectedWeight,
      quantity,
      price: product.price,
    }
    if (onAddToCartProp) {
      onAddToCartProp(payload)
      return
    }

    // Default behavior: use global cart context (localStorage persisted).
    addToCart(payload, quantity)
    openCart()
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.info('[ProductDetails] Add to cart', payload)
    }
  }, [
    addToCart,
    onAddToCartProp,
    openCart,
    product.id,
    product.images,
    product.name,
    product.price,
    quantity,
    selectedFlavor,
    selectedWeight,
  ])

  const handleBuyNow = useCallback(() => {
    const payload = {
      productId: product.id,
      name: product.name,
      flavor: selectedFlavor,
      weight: selectedWeight,
      quantity,
      price: product.price,
    }
    if (onBuyNowProp) {
      onBuyNowProp(payload)
      return
    }

    // Default: "Buy now" adds to cart then opens drawer (safe UX until checkout route exists).
    addToCart(payload, quantity)
    openCart()
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.info('[ProductDetails] Buy now', payload)
    }
  }, [addToCart, onBuyNowProp, openCart, product.id, product.name, product.price, quantity, selectedFlavor, selectedWeight])

  const selectedWeightMeta = product.weightOptions.find((w) => w.value === selectedWeight)
  const globallyAvailable = product.stockStatus !== 'out_of_stock'
  const inStock = globallyAvailable && selectedWeightMeta?.inStock !== false

  return (
    <article className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-16">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            {product.breadcrumbs.map((crumb, i) => (
              <li key={crumb.id} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="text-zinc-600" aria-hidden="true">
                    /
                  </span>
                )}
                <a href={crumb.href} className="transition hover:text-emerald-400">
                  {crumb.name}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <span className="text-zinc-600" aria-hidden="true">
                /
              </span>
              <span className="font-medium text-zinc-300" aria-current="page">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <ProductImageGallery images={product.images} productName={product.name} />
          </div>

          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-6 lg:self-start">
              <ProductInfo
                product={product}
                reviews={reviews}
                selectedFlavor={selectedFlavor}
                onFlavorChange={setSelectedFlavor}
                selectedWeight={selectedWeight}
                onWeightChange={setSelectedWeight}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-12 border-t border-zinc-800 pt-16 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-7">
            <NutritionTable rows={product.nutritionalFacts} />

            <BenefitsList benefits={product.benefits} />

            <section aria-labelledby="ingredients-heading">
              <h2 id="ingredients-heading" className="text-lg font-semibold text-zinc-100">
                Ingredients
              </h2>
              <ul className="mt-4 list-inside list-disc space-y-2 text-sm leading-relaxed text-zinc-400">
                {product.ingredients.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="usage-heading">
              <h2 id="usage-heading" className="text-lg font-semibold text-zinc-100">
                How to use
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">{product.usageInstructions}</p>
            </section>

            {product.warnings ? (
              <aside
                aria-labelledby="warnings-heading"
                className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-6"
              >
                <h2 id="warnings-heading" className="flex items-center gap-2 text-lg font-semibold text-orange-400">
                  <ExclamationTriangleIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                  Warnings
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{product.warnings}</p>
              </aside>
            ) : null}
          </div>

          <div className="lg:col-span-5 lg:pl-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
              <h2 className="text-base font-semibold text-zinc-200">Why this product</h2>
              <p className="mt-3 text-sm text-zinc-500">
                Lab-tested quality, transparent macros, and flavors chosen for everyday training. Pair with
                consistent workouts and balanced nutrition for best results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile / small tablet CTA */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-zinc-950/95 p-4 backdrop-blur-md sm:hidden"
        role="region"
        aria-label="Purchase actions"
      >
        <div className="mx-auto flex max-w-lg gap-3">
          <button
            type="button"
            disabled={!inStock}
            onClick={handleAddToCart}
            className="flex-1 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/40 disabled:opacity-50"
          >
            Add to cart
          </button>
          <button
            type="button"
            disabled={!inStock}
            onClick={handleBuyNow}
            className="flex-1 rounded-xl border-2 border-orange-500 bg-orange-500/10 py-3.5 text-sm font-semibold text-orange-400 disabled:opacity-50"
          >
            Buy now
          </button>
        </div>
      </div>
    </article>
  )
}
