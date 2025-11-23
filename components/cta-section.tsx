import { NavButton } from "@/components/ui/nav";

interface CTASectionProps {
  title: string;
  titleMobile?: string;
  description: string;
  descriptionMobile?: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
  imageUrl: string;
  imageAlt: string;
}

export default function CTASection({
  title,
  titleMobile,
  description,
  descriptionMobile,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
  imageUrl,
  imageAlt,
}: CTASectionProps) {
  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-4 md:gap-16 md:px-8 lg:grid-cols-2 lg:items-center">
        <div className="flex max-w-3xl flex-col items-start">
          <h2 className="text-display-sm font-semibold text-primary md:text-display-md lg:text-display-lg">
            {titleMobile && (
              <span className="md:hidden">{titleMobile}</span>
            )}
            <span className={titleMobile ? "max-md:hidden" : ""}>
              {title}
            </span>
          </h2>
          <p className="mt-4 text-lg text-secondary md:mt-6 md:text-xl">
            {descriptionMobile && (
              <span className="md:hidden">{descriptionMobile}</span>
            )}
            <span className={descriptionMobile ? "max-md:hidden" : ""}>
              {description}
            </span>
          </p>
          <div className="mt-8 flex w-full flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-start md:mt-12">
            <NavButton
              label={secondaryButtonText}
              href={secondaryButtonHref}
              variant="secondary"
            />
            <NavButton
              label={primaryButtonText}
              href={primaryButtonHref}
              variant="primary"
            />
          </div>
        </div>
        <img
          className="h-70 w-full object-cover md:h-95 lg:h-148"
          src={imageUrl}
          alt={imageAlt}
        />
      </div>
    </section>
  );
}
