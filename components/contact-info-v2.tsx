import type { PayloadJuridicoContact } from '@/types/payload'

interface ContactInfoV2Props {
  title?: string
  description?: string
  contacts: PayloadJuridicoContact[]
}

const iconMap = {
  mail: (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  phone: (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  'map-pin': (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
}

export default function ContactInfoV2({ title, description, contacts }: ContactInfoV2Props) {
  if (!contacts || contacts.length === 0) return null

  return (
    <section className="mb-8">
      {title && (
        <div className="border-b-2 border-brand-600 mb-4">
          <h2 className="text-lg font-semibold uppercase text-gray-700 tracking-wide pb-2">{title}</h2>
        </div>
      )}
      {description && <p className="mb-4 text-sm text-gray-600">{description}</p>}
      <ul className="divide-y divide-gray-200 border border-gray-200">
        {contacts.map((c) => (
          <li key={c.id} className="flex gap-4 items-start p-4 hover:bg-gray-50 transition">
            <div className="shrink-0 flex items-center justify-center size-10 bg-brand-600 text-white rounded">
              {iconMap[c.icon]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm">{c.title}</h3>
              <p className="text-sm text-gray-600 mt-0.5">{c.description}</p>
              {c.linkHref && c.linkText && (
                <a href={c.linkHref} className="mt-1 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700 transition">
                  {c.linkText} →
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
