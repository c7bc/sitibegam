import { getImageUrl } from '@/lib/utils'
import type { PayloadActCct } from '@/types/payload'

interface ActsCctsListProps {
  items: PayloadActCct[]
  emptyMessage: string
}

function groupByYear(items: PayloadActCct[]): Record<number, PayloadActCct[]> {
  return items.reduce((acc, item) => {
    const year = item.year
    if (!acc[year]) acc[year] = []
    acc[year].push(item)
    return acc
  }, {} as Record<number, PayloadActCct[]>)
}

export default function ActsCctsList({ items, emptyMessage }: ActsCctsListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="border border-gray-200 p-6 text-center text-sm text-gray-500">
        {emptyMessage}
      </div>
    )
  }

  const byYear = groupByYear(items)
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a)

  return (
    <div className="space-y-8">
      {years.map((year) => (
        <section key={year}>
          <div className="border-b-2 border-brand-600 mb-3">
            <h2 className="text-lg font-semibold uppercase text-gray-700 tracking-wide pb-2">{year}</h2>
          </div>
          <ul className="divide-y divide-gray-200 border border-gray-200">
            {byYear[year].map((item) => (
              <li key={item.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                    {item.company && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.company}</p>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                  {item.file && (
                    <a
                      href={getImageUrl(item.file, 'medium')}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="shrink-0 inline-flex items-center gap-1.5 bg-brand-600 text-white text-xs font-semibold px-4 py-2 uppercase hover:bg-brand-700 transition"
                    >
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Baixar PDF
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
