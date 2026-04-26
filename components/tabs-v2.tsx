'use client'

import { useState } from 'react'
import { lexicalToHtml } from '@/lib/lexical-to-html'
import type { PayloadJuridicoTab } from '@/types/payload'

interface TabsV2Props {
  tabs: PayloadJuridicoTab[]
  title?: string
}

export default function TabsV2({ tabs, title }: TabsV2Props) {
  const [activeId, setActiveId] = useState(tabs[0]?.id || '')

  if (!tabs || tabs.length === 0) return null

  const active = tabs.find((t) => t.id === activeId) || tabs[0]
  const contentHtml = lexicalToHtml(active.content)

  return (
    <section className="mb-8">
      {title && (
        <div className="border-b-2 border-brand-600 mb-4">
          <h2 className="text-lg font-semibold uppercase text-gray-700 tracking-wide pb-2">{title}</h2>
        </div>
      )}

      {/* Tab buttons */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide transition ${
              activeId === tab.id
                ? 'bg-brand-600 text-white'
                : 'text-gray-500 hover:text-brand-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span className={`ml-2 text-[10px] px-1.5 py-0.5 ${
                activeId === tab.id ? 'bg-white/20' : 'bg-brand-600/10 text-brand-600'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-brand-600 prose-strong:text-gray-800"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </section>
  )
}
