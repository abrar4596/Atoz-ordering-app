import { StarIcon } from '@heroicons/react/20/solid'
import { memo } from 'react'
import { cn } from './cn'

function ReviewsSectionComponent({ reviews }) {
  const { average, totalCount, href } = reviews
  const fullStars = Math.floor(average)
  const hasHalf = average - fullStars >= 0.5

  return (
    <section aria-labelledby="reviews-heading">
      <h3 id="reviews-heading" className="sr-only">
        Customer reviews
      </h3>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-0.5" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => {
            const filled = i < fullStars || (i === fullStars && hasHalf)
            return (
              <StarIcon
                key={i}
                className={cn('h-5 w-5 shrink-0', filled ? 'text-orange-400' : 'text-zinc-600')}
              />
            )
          })}
        </div>
        <span className="text-sm font-semibold text-zinc-200" aria-hidden="true">
          {average.toFixed(1)}
        </span>
        <p className="sr-only">
          {average} out of 5 stars
        </p>
        <a
          href={href}
          className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
        >
          {totalCount} reviews
        </a>
      </div>
    </section>
  )
}

export const ReviewsSection = memo(ReviewsSectionComponent)
