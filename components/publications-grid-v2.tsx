'use client'

import { useState, useMemo } from 'react'
import type { NewsItem } from '@/types/payload'

interface PublicationsGridV2Props {
  publications: NewsItem[]
  categories?: string[]
  itemsPerPage?: number
  showSearch?: boolean
  showFilters?: boolean
}

export default function PublicationsGridV2({
  publications,
  categories = [],
  itemsPerPage = 8,
  showSearch = true,
  showFilters = true,
}: PublicationsGridV2Props) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return publications.filter((p) => {
      const matchCategory = activeCategory === 'all' || p.category === activeCategory
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [publications, activeCategory, search])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <section>
      {/* Filters + Search */}
      {(showFilters && categories.length > 0) || showSearch ? (
        <div className="mb-6 space-y-3">
          {showFilters && categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => { setActiveCategory('all'); setPage(1); }}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  activeCategory === 'all'
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setPage(1); }}
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                    activeCategory === cat
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
          {showSearch && (
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Buscar publicações..."
                className="w-full h-9 bg-[#f2f2f2] border border-gray-200 px-3 text-sm text-gray-700 outline-none focus:border-brand-600 transition"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          )}
        </div>
      ) : null}

      {/* Grid */}
      {paginated.length === 0 ? (
        <p className="text-sm text-gray-500 italic py-8 text-center">Nenhuma publicação encontrada.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {paginated.map((item) => (
            <li key={item.id}>
              <a href={item.link} className="group block">
                <div className="relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    className="w-full aspect-[16/9] object-cover transition group-hover:opacity-80"
                  />
                  {item.category && (
                    <span className="absolute top-2 left-2 bg-brand-600 text-white text-[10px] font-semibold px-2 py-0.5 uppercase">
                      {item.category}
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <time className="text-xs text-gray-400">{item.date}</time>
                  <h3 className="mt-1 text-sm font-semibold text-gray-900 leading-snug group-hover:text-brand-600 transition line-clamp-2">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{item.excerpt}</p>
                  )}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-1">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1.5 text-sm border transition ${
                p === page
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
          >
            ›
          </button>
        </div>
      )}
    </section>
  )
}
