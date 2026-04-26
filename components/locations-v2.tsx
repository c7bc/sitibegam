import { lexicalToHtml } from '@/lib/lexical-to-html'
import type { PayloadLocation } from '@/types/payload'

interface LocationsV2Props {
  title?: string
  description?: string
  mapEmbedUrl?: string
  locations: PayloadLocation[]
}

const iconMap = {
  'map-pin': (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  building: (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  office: (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 7v14M21 7v14M6 11h2m-2 4h2m4-4h2m-2 4h2m-2-8h2m-2 0V3m-4 8V3m4 8h2m0 0h2m-2 0V7m2 4V7M6 7h12" />
    </svg>
  ),
}

export default function LocationsV2({ title, description, mapEmbedUrl, locations }: LocationsV2Props) {
  if (!locations || locations.length === 0) return null

  return (
    <section className="mb-8">
      {title && (
        <div className="border-b-2 border-brand-600 mb-4">
          <h2 className="text-lg font-semibold uppercase text-gray-700 tracking-wide pb-2">{title}</h2>
        </div>
      )}
      {description && <p className="mb-4 text-sm text-gray-600">{description}</p>}

      {mapEmbedUrl && (
        <div
          className="mb-6 overflow-hidden border border-gray-200 aspect-[16/9]"
          dangerouslySetInnerHTML={{ __html: mapEmbedUrl }}
        />
      )}

      <ul className="divide-y divide-gray-200 border border-gray-200">
        {locations.map((loc) => {
          const addressHtml = lexicalToHtml(loc.address)
          return (
            <li key={loc.id} className="p-4">
              <div className="flex gap-3 items-start">
                <div className="shrink-0 flex items-center justify-center size-10 bg-brand-600 text-white rounded">
                  {iconMap[loc.icon] || iconMap['map-pin']}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{loc.title}</h3>
                  {loc.description && (
                    <p className="text-sm text-gray-600 mt-0.5">{loc.description}</p>
                  )}
                  <div
                    className="mt-2 text-sm text-gray-700 [&_p]:m-0 [&_p]:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: addressHtml }}
                  />
                  {loc.mapUrl && (
                    <a
                      href={loc.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700 transition"
                    >
                      Ver no mapa →
                    </a>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
