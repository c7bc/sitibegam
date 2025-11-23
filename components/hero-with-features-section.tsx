interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface HeroWithFeaturesSectionProps {
  badge?: string;
  title: string;
  description: string;
  features: Feature[];
  imageUrl: string;
  imageAlt: string;
}

export default function HeroWithFeaturesSection({
  badge,
  title,
  description,
  features,
  imageUrl,
  imageAlt,
}: HeroWithFeaturesSectionProps) {
  const hasFeatures = features.length > 0;

  return (
    <section className="bg-primary">
      <div className="bg-secondary pt-16 pb-28 md:pt-24 md:pb-40">
        <div
          className={`mx-auto w-full max-w-7xl px-4 md:px-8 ${
            hasFeatures
              ? "grid grid-cols-1 gap-12 md:gap-16 lg:grid-cols-2 lg:gap-24"
              : ""
          }`}
        >
          {/* Text Content */}
          <div
            className={`flex w-full flex-col ${
              hasFeatures ? "" : "mx-auto max-w-3xl text-center"
            }`}
          >
            {badge && (
              <span
                className={`text-sm font-semibold text-brand-secondary md:text-md ${
                  hasFeatures ? "" : "mb-3"
                }`}
              >
                {badge}
              </span>
            )}
            <h2 className="mt-3 text-display-sm font-semibold text-primary md:text-display-md">
              {title}
            </h2>
            <p className="mt-4 text-lg text-tertiary md:mt-5 md:text-xl">
              {description}
            </p>
          </div>

          {/* Features List - Only render if there are features */}
          {hasFeatures && (
            <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-1">
              {features.map((feature) => (
                <li key={feature.id}>
                  <div className="flex max-w-140 gap-4">
                    {/* Icon - Desktop */}
                    <div className="relative hidden size-12 shrink-0 items-center justify-center bg-primary text-fg-secondary shadow-xs-skeumorphic ring-1 ring-inset ring-primary md:inline-flex">
                      <div className="size-6">{feature.icon}</div>
                    </div>

                    {/* Icon - Mobile */}
                    <div className="relative inline-flex size-10 shrink-0 items-center justify-center bg-primary text-fg-secondary shadow-xs-skeumorphic ring-1 ring-inset ring-primary md:hidden">
                      <div className="size-5">{feature.icon}</div>
                    </div>

                    {/* Feature Content */}
                    <div className="flex flex-col items-start gap-4">
                      <div>
                        <h3 className="mt-1.5 text-lg font-semibold text-primary md:mt-2.5">
                          {feature.title}
                        </h3>
                        <p className="mt-1 text-md text-tertiary">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Image that overlaps the section above */}
      <div className="mx-auto -mt-16 flex w-full max-w-7xl justify-center px-4 pb-16 md:-mt-24 md:px-8 md:pb-24">
        <img
          alt={imageAlt}
          src={imageUrl}
          className="h-60 w-full object-cover md:h-100 lg:h-129"
        />
      </div>
    </section>
  );
}
