import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { useCallback, useEffect, useMemo, useState } from 'react'

function formatDate(dateLike) {
  if (!dateLike) return ''
  const d = new Date(dateLike)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: '2-digit' })
}

function RatingStars({ value, sizeClass = 'h-4 w-4', showValue = false }) {
  const clamped = Math.max(0, Math.min(5, Number(value) || 0))
  const full = Math.floor(clamped)
  const half = clamped - full >= 0.5

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = i < full || (i === full && half)
          const Icon = filled ? StarIconSolid : StarIconOutline
          return <Icon key={i} className={`${sizeClass} ${filled ? 'text-orange-400' : 'text-zinc-600'}`} />
        })}
      </div>
      <span className="sr-only">{clamped} out of 5 stars</span>
      {showValue ? <span className="text-sm font-semibold text-zinc-200">{clamped.toFixed(1)}</span> : null}
    </div>
  )
}

export default function ProductReview({ productId }) {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
    return sum / reviews.length
  }, [reviews])

  const fetchReviews = useCallback(async () => {
    if (!productId) return
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/reviews/${encodeURIComponent(productId)}`, {
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) {
        throw new Error(`Failed to load reviews (${res.status})`)
      }
      const data = await res.json()
      const list = Array.isArray(data) ? data : Array.isArray(data?.reviews) ? data.reviews : []
      setReviews(
        list.map((r, idx) => ({
          id: r.id ?? r._id ?? `${productId}-${idx}`,
          name: r.name ?? r.userName ?? 'Anonymous',
          rating: Number(r.rating) || 0,
          comment: r.comment ?? r.review ?? '',
          date: r.createdAt ?? r.date ?? '',
        })),
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load reviews')
    } finally {
      setIsLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const validate = useCallback(() => {
    const trimmedName = name.trim()
    const trimmedComment = comment.trim()
    const ratingNum = Number(rating)

    if (!productId) return 'Missing product id.'
    if (!trimmedName) return 'Please enter your name.'
    if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) return 'Please select a rating (1–5).'
    if (!trimmedComment) return 'Please write a comment.'
    if (trimmedComment.length < 10) return 'Comment should be at least 10 characters.'

    return ''
  }, [comment, name, productId, rating])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setSuccess('')
      setError('')

      const validationMessage = validate()
      if (validationMessage) {
        setError(validationMessage)
        return
      }

      setIsSubmitting(true)
      try {
        const payload = {
          name: name.trim(),
          rating: Number(rating),
          comment: comment.trim(),
        }

        const res = await fetch(`/api/reviews/${encodeURIComponent(productId)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const maybeJson = await res.json().catch(() => null)
          const message = maybeJson?.message || `Failed to submit review (${res.status})`
          throw new Error(message)
        }

        const created = await res.json().catch(() => null)
        const normalized = created
          ? {
              id: created.id ?? created._id ?? `${productId}-${Date.now()}`,
              name: created.name ?? payload.name,
              rating: Number(created.rating ?? payload.rating) || payload.rating,
              comment: created.comment ?? payload.comment,
              date: created.createdAt ?? new Date().toISOString(),
            }
          : {
              id: `${productId}-${Date.now()}`,
              name: payload.name,
              rating: payload.rating,
              comment: payload.comment,
              date: new Date().toISOString(),
            }

        setReviews((prev) => [normalized, ...prev])
        setName('')
        setRating(5)
        setComment('')
        setSuccess('Thanks! Your review has been submitted.')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to submit review')
      } finally {
        setIsSubmitting(false)
      }
    },
    [comment, name, productId, rating, validate],
  )

  return (
    <section aria-labelledby="product-reviews-heading" className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="product-reviews-heading" className="text-lg font-semibold text-zinc-100">
            Ratings & Reviews
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {reviews.length ? `${reviews.length} review${reviews.length === 1 ? '' : 's'}` : 'No reviews yet'}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2">
          <RatingStars value={averageRating} sizeClass="h-5 w-5" showValue />
        </div>
      </header>

      {(error || success) && (
        <div className="space-y-2">
          {error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {success}
            </div>
          ) : null}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="space-y-4">
            {isLoading ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
                <p className="text-sm text-zinc-400">Loading reviews…</p>
              </div>
            ) : null}

            {!isLoading && reviews.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
                <p className="text-sm text-zinc-400">Be the first to review this supplement.</p>
              </div>
            ) : null}

            {!isLoading &&
              reviews.map((r) => (
                <article
                  key={r.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6"
                  aria-label={`Review by ${r.name}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{r.name}</p>
                      <p className="mt-1 text-xs text-zinc-500">{formatDate(r.date)}</p>
                    </div>
                    <RatingStars value={r.rating} />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-300">{r.comment}</p>
                </article>
              ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h3 className="text-base font-semibold text-zinc-100">Write a review</h3>
            <p className="mt-1 text-sm text-zinc-500">Share your experience to help others choose better.</p>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="review-name" className="text-sm font-medium text-zinc-200">
                  Name
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="review-rating" className="text-sm font-medium text-zinc-200">
                  Rating
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <select
                    id="review-rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-28 rounded-xl border border-zinc-700 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <RatingStars value={rating} sizeClass="h-5 w-5" />
                </div>
              </div>

              <div>
                <label htmlFor="review-comment" className="text-sm font-medium text-zinc-200">
                  Comment
                </label>
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="How did it taste? Mixability? Recovery? Results?"
                  className="mt-2 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                <p className="mt-2 text-xs text-zinc-500">Minimum 10 characters.</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !productId}
                className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting…' : 'Submit review'}
              </button>

              {!productId ? (
                <p className="text-xs text-orange-300/90">Provide a valid `productId` to load and submit reviews.</p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

