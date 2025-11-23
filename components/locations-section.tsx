interface Location {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  address: string;
  mapUrl: string;
}

interface LocationsSectionProps {
  badge?: string;
  title: string;
  description?: string;
  mapEmbedUrl?: string;
  locations: Location[];
}

export default function LocationsSection({
  badge,
  title,
  description,
  mapEmbedUrl,
  locations,
}: LocationsSectionProps) {
  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          {badge && (
            <span className="text-sm font-semibold text-brand-secondary md:text-md">
              {badge}
            </span>
          )}
          <h2 className="mt-3 text-display-md font-semibold text-primary md:text-display-lg">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-tertiary md:mt-6 md:text-xl">
              {description}
            </p>
          )}
        </div>

        <div className="mt-16 flex flex-col gap-12 md:mt-24 md:gap-16">
          {mapEmbedUrl && (
            <iframe
              title="Localização do sindicato"
              src={mapEmbedUrl}
              className="h-80 w-full border-none md:h-100"
              loading="lazy"
            />
          )}

          <ul className={`grid w-full justify-items-center gap-x-8 gap-y-10 ${
            locations.length === 1
              ? 'grid-cols-1'
              : locations.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {locations.map((location) => (
              <li
                key={location.id}
                className="flex max-w-sm flex-col items-center text-center"
              >
                <div className="size-6 text-icon-fg-brand">
                  {location.icon}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-primary md:mt-4 md:text-xl">
                  {location.title}
                </h3>
                <p className="mt-1 text-md text-tertiary md:mt-2">
                  {location.description}
                </p>
                <a
                  href={location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative mt-3 inline-flex h-max cursor-pointer items-center justify-normal whitespace-pre p-0 px-4 py-2.5 text-md font-semibold text-brand-secondary outline-brand transition duration-100 ease-linear hover:text-brand-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2 md:mt-4"
                >
                  <span className="underline decoration-transparent underline-offset-2 transition-inherit-all group-hover:decoration-current">
                    {location.address}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
