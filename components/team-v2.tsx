import { getImageUrl } from '@/lib/utils'
import type { PayloadTeamSection } from '@/types/payload'

interface TeamV2Props {
  sections: PayloadTeamSection[]
}

export default function TeamV2({ sections }: TeamV2Props) {
  if (!sections || sections.length === 0) return null

  return (
    <>
      {sections.map((section) => (
        <section key={section.id} className="mb-8">
          <div className="border-b-2 border-brand-600 mb-4">
            <h2 className="text-lg font-semibold uppercase text-gray-700 tracking-wide pb-2">
              {section.title}
              {section.badge && (
                <span className="ml-3 text-[10px] bg-brand-600/10 text-brand-600 px-2 py-0.5 align-middle">
                  {section.badge}
                </span>
              )}
            </h2>
          </div>

          {section.description && (
            <p className="mb-4 text-sm text-gray-600">{section.description}</p>
          )}

          {section.members && section.members.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {section.members.map((m) => (
                <div key={m.id} className="border border-gray-200 overflow-hidden">
                  {m.image ? (
                    <img
                      src={getImageUrl(m.image, 'square')}
                      alt={m.imageAlt || m.name}
                      className="w-full aspect-square object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                      <svg className="size-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{m.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </>
  )
}
