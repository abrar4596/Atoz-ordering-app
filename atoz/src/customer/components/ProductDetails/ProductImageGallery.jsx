import { memo, useCallback, useState } from 'react'
import { cn } from './cn'

function ProductImageGalleryComponent({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = images[activeIndex] ?? images[0]

  const selectImage = useCallback((index) => {
    setActiveIndex(index)
  }, [])

  if (!images?.length) return null

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 ring-1 ring-white/5">
        <img
          src={active.src}
          alt={active.alt || productName}
          width={900}
          height={900}
          decoding="async"
          fetchPriority="high"
          className="aspect-square w-full object-cover"
        />
      </div>
      <ul className="grid grid-cols-4 gap-2 sm:gap-3" aria-label="Product image thumbnails">
        {images.map((img, index) => (
          <li key={img.src}>
            <button
              type="button"
              onClick={() => selectImage(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : 'false'}
              className={cn(
                'block w-full overflow-hidden rounded-lg border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
                index === activeIndex
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'border-transparent opacity-80 hover:opacity-100',
              )}
            >
              <img
                src={img.src}
                alt=""
                width={120}
                height={120}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const ProductImageGallery = memo(ProductImageGalleryComponent)
