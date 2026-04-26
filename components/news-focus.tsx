'use client'

import { useState } from 'react'

interface NewsItem {
  id: string | number
  imageUrl: string
  imageAlt: string
  category: string
  date: string
  title: string
  link: string
  excerpt?: string
}

interface NewsFocusProps {
  title: string
  tabs?: Array<{ label: string; id: string }>
  news: { [tabId: string]: NewsItem[] }
}

export default function NewsFocus({ title, tabs, news }: NewsFocusProps) {
  const tabKeys = tabs && tabs.length > 0 ? tabs.map(t => t.id) : Object.keys(news)
  const tabLabels = tabs && tabs.length > 0 ? tabs : tabKeys.map(k => ({ label: k, id: k }))
  const [activeTab, setActiveTab] = useState(tabKeys[0] || '')

  const items = news[activeTab] || []
  if (items.length === 0) return null

  const featured = items[0]
  const list = items.slice(1, 5)

  return (
    <section className="bg-white border-b border-gray-100 pb-8">
        {/* Section header with tabs */}
        <div className="flex items-center gap-6 border-b-2 border-brand-600 pb-0 mb-6">
          <h2 className="text-lg font-semibold text-brand-600 uppercase pb-2 tracking-wide">{title}</h2>
          {tabLabels.length > 1 && (
            <ul className="flex gap-1">
              {tabLabels.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 text-sm transition ${
                      activeTab === tab.id
                        ? 'bg-brand-600 text-white font-semibold'
                        : 'text-gray-500 hover:text-brand-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Featured article - left half */}
          <div className="md:w-1/2">
            <a href={featured.link} className="group block">
              <img
                src={featured.imageUrl}
                alt={featured.imageAlt}
                className="w-full aspect-[351/185] object-cover transition group-hover:opacity-80"
              />
              <div className="mt-3">
                <time className="text-xs text-gray-400">{featured.date}</time>
                <h3 className="mt-1 text-lg font-semibold text-gray-900 leading-snug group-hover:text-brand-600 transition">
                  {featured.title}
                </h3>
                {featured.excerpt && (
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-6">{featured.excerpt}</p>
                )}
              </div>
            </a>
          </div>

          {/* Posts list - right half */}
          <ul className="md:w-1/2 flex flex-col divide-y divide-gray-100">
            {list.map((item) => (
              <li key={item.id} className="py-3 first:pt-0">
                <a href={item.link} className="group flex gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    className="w-[110px] h-[80px] object-cover shrink-0 transition group-hover:opacity-80"
                  />
                  <div className="flex flex-col justify-center">
                    <time className="text-xs text-gray-400">{item.date}</time>
                    <h4 className="mt-0.5 text-sm font-semibold text-gray-900 leading-snug group-hover:text-brand-600 transition line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
    </section>
  )
}
