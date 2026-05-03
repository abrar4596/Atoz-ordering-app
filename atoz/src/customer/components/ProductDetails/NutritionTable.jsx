import { memo } from 'react'

function NutritionTableComponent({ rows, caption = 'Nutritional information per serving' }) {
  if (!rows?.length) return null

  return (
    <section aria-labelledby="nutrition-heading" className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 id="nutrition-heading" className="text-lg font-semibold text-zinc-100">
        Nutritional information
      </h2>
      <p className="mt-1 text-sm text-zinc-500">Per serving (approx.)</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[280px] text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-zinc-700 text-zinc-400">
              <th scope="col" className="py-2 pr-4 font-medium">
                Nutrient
              </th>
              <th scope="col" className="py-2 font-medium">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="text-zinc-200">
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-zinc-800/80 last:border-0">
                <th scope="row" className="py-3 pr-4 font-normal text-zinc-300">
                  {row.label}
                </th>
                <td className="py-3 font-semibold text-emerald-400/90">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export const NutritionTable = memo(NutritionTableComponent)
