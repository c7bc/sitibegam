import { getImageUrl } from '@/lib/utils'
import type { PayloadServicosFacility } from '@/types/payload'

interface FacilitiesV2Props {
  facilities: PayloadServicosFacility[]
}

export default function FacilitiesV2({ facilities }: FacilitiesV2Props) {
  if (!facilities || facilities.length === 0) return null

  return (
    <>
      {facilities.map((f) => (
        <section key={f.id} className="mb-8">
          <div className="border-b-2 border-brand-600 mb-4">
            <h2 className="text-lg font-semibold uppercase text-gray-700 tracking-wide pb-2">
              {f.title}
              {f.badge && (
                <span className="ml-3 text-[10px] bg-brand-600/10 text-brand-600 px-2 py-0.5 align-middle">
                  {f.badge}
                </span>
              )}
            </h2>
          </div>

          {/* Image + description */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {f.image && (
              <img
                src={getImageUrl(f.image, 'medium')}
                alt={f.imageAlt || f.title}
                className="w-full md:w-1/2 aspect-[4/3] object-cover"
              />
            )}
            <div className="flex-1">
              {f.description && (
                <p className="text-sm text-gray-700 leading-relaxed mb-3">{f.description}</p>
              )}

              {/* Contact info */}
              {f.contactInfo && (f.contactInfo.hours || f.contactInfo.email || f.contactInfo.phone) && (
                <div className="text-xs text-gray-500 space-y-1">
                  {f.contactInfo.hours && <p><span className="font-semibold">Horário:</span> {f.contactInfo.hours}</p>}
                  {f.contactInfo.phone && <p><span className="font-semibold">Telefone:</span> {f.contactInfo.phone}</p>}
                  {f.contactInfo.email && <p><span className="font-semibold">Email:</span> <a href={`mailto:${f.contactInfo.email}`} className="text-brand-600 hover:underline">{f.contactInfo.email}</a></p>}
                </div>
              )}
            </div>
          </div>

          {/* Price table */}
          {f.priceTable && f.priceTable.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase text-gray-700 mb-2">Valores</h4>
              <table className="w-full border border-gray-200 text-sm">
                <tbody>
                  {f.priceTable.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 last:border-0">
                      <td className="px-3 py-2 text-gray-700">{item.description}</td>
                      <td className="px-3 py-2 text-right font-semibold text-brand-600 whitespace-nowrap">{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* General info */}
          {f.generalInfo && f.generalInfo.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase text-gray-700 mb-2">Informações</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {f.generalInfo.map((item) => (
                  <li key={item.id} className="flex items-start gap-2">
                    <span className="text-brand-600 mt-1">•</span>
                    <span>{item.info}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Regulations */}
          {f.regulations && f.regulations.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-700 mb-2">Regulamento</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {f.regulations.map((item) => (
                  <li key={item.id} className="flex items-start gap-2">
                    <span className="text-brand-600 mt-1">•</span>
                    <span>{item.rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ))}
    </>
  )
}
