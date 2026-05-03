import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import { memo } from 'react'

function BenefitsListComponent({ benefits, title = 'Benefits' }) {
  if (!benefits?.length) return null

  return (
    <section aria-labelledby="benefits-heading">
      <h2 id="benefits-heading" className="text-lg font-semibold text-zinc-100">
        {title}
      </h2>
      <ul className="mt-4 space-y-3">
        {benefits.map((item) => (
          <li key={item} className="flex gap-3 text-sm text-zinc-300">
            <CheckBadgeIcon
              className="h-5 w-5 shrink-0 text-emerald-500"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export const BenefitsList = memo(BenefitsListComponent)
