interface PriceTableRow {
  description: string;
  price: string;
}

interface FacilitiesSectionProps {
  title: string;
  description?: string;
  badge?: string;
  regulations?: string[];
  generalInfo?: string[];
  priceTable?: PriceTableRow[];
  contactInfo?: {
    email?: string;
    phone?: string;
    hours?: string;
  };
  imageUrl?: string;
  imageAlt?: string;
}

export default function FacilitiesSection({
  title,
  description,
  badge,
  regulations,
  generalInfo,
  priceTable,
  contactInfo,
  imageUrl,
  imageAlt = title,
}: FacilitiesSectionProps) {
  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content Column */}
          <div className="flex flex-col">
            {badge && (
              <span className="mb-3 inline-flex w-fit items-center bg-utility-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 ring-1 ring-inset ring-utility-brand-200">
                {badge}
              </span>
            )}

            <h2 className="text-display-sm font-semibold text-primary md:text-display-md">
              {title}
            </h2>

            {description && (
              <p className="mt-4 text-lg text-tertiary md:mt-5 md:text-xl">
                {description}
              </p>
            )}

            {/* Price Table */}
            {priceTable && priceTable.length > 0 && (
              <div className="mt-8 border border-secondary bg-primary">
                <div className="border-b border-secondary bg-gray-50 px-6 py-3">
                  <h3 className="text-lg font-semibold text-primary">
                    Valores
                  </h3>
                </div>
                <div className="divide-y divide-secondary">
                  {priceTable.map((row, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-6 py-4"
                    >
                      <span className="text-md text-secondary">
                        {row.description}
                      </span>
                      <span className="text-lg font-semibold text-brand-secondary">
                        {row.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* General Info */}
            {generalInfo && generalInfo.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-xl font-semibold text-primary">
                  Informações Gerais
                </h3>
                <ul className="space-y-3">
                  {generalInfo.map((info, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1.5 inline-block size-1.5 shrink-0 bg-brand-secondary"></span>
                      <span className="text-md text-tertiary">{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact Info */}
            {contactInfo && (
              <div className="mt-8 border border-secondary bg-primary p-6">
                <h3 className="mb-4 text-lg font-semibold text-primary">
                  Contato e Reservas
                </h3>
                <div className="space-y-3 text-md text-tertiary">
                  {contactInfo.hours && (
                    <div>
                      <span className="font-medium text-secondary">
                        Horário:
                      </span>{" "}
                      {contactInfo.hours}
                    </div>
                  )}
                  {contactInfo.email && (
                    <div>
                      <span className="font-medium text-secondary">
                        E-mail:
                      </span>{" "}
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-brand-secondary hover:text-brand-secondary_hover"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  )}
                  {contactInfo.phone && (
                    <div>
                      <span className="font-medium text-secondary">
                        Telefone:
                      </span>{" "}
                      <a
                        href={`tel:${contactInfo.phone.replace(/\D/g, "")}`}
                        className="text-brand-secondary hover:text-brand-secondary_hover"
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Regulations Column */}
          <div className="flex flex-col">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={imageAlt}
                className="mb-8 h-70 w-full object-cover md:h-95"
              />
            )}

            {regulations && regulations.length > 0 && (
              <div className="border border-secondary bg-primary p-6">
                <h3 className="mb-6 text-xl font-semibold text-primary">
                  Regulamento
                </h3>
                <div className="space-y-4">
                  {regulations.map((rule, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center bg-brand-secondary text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      <p className="text-sm text-tertiary">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
