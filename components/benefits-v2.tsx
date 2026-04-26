'use client'

import { useState } from 'react'
import type { PayloadServicosBenefitCategory } from '@/types/payload'

interface BenefitsV2Props {
  title?: string
  subtitle?: string
  categories: PayloadServicosBenefitCategory[]
}

export default function BenefitsV2({ title, subtitle, categories }: BenefitsV2Props) {
  const [activeId, setActiveId] = useState(categories[0]?.id || '')

  if (!categories || categories.length === 0) return null

  const active = categories.find((c) => c.id === activeId) || categories[0]

  return (
    <section className="mb-8">
      {title && (
        <div className="border-b-2 border-brand-600 mb-4">
          <h2 className="text-lg font-semibold uppercase text-gray-700 tracking-wide pb-2">{title}</h2>
        </div>
      )}
      {subtitle && <p className="mb-4 text-sm text-gray-600">{subtitle}</p>}

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveId(cat.id)}
            className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide transition ${
              activeId === cat.id
                ? 'bg-brand-600 text-white'
                : 'text-gray-500 hover:text-brand-600 hover:bg-gray-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Benefits list */}
      {active.benefits && active.benefits.length > 0 ? (
        <ul className="divide-y divide-gray-200 border border-gray-200">
          {active.benefits.map((b) => (
            <li key={b.id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{b.name}</h3>
                  <div className="mt-1 text-xs text-gray-500 space-y-0.5">
                    {b.address && <p>📍 {b.address}</p>}
                    {b.phone && <p>📞 {b.phone}</p>}
                    {b.hours && <p>🕒 {b.hours}</p>}
                    {b.observations && <p className="italic">{b.observations}</p>}
                  </div>
                </div>
                {b.discount && (
                  <span className="shrink-0 bg-brand-600 text-white text-xs font-bold px-3 py-1 uppercase">
                    {b.discount}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic">Nenhum benefício nesta categoria.</p>
      )}
    </section>
  )
}
