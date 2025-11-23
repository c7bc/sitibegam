interface AnnouncementCardProps {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref?: string;
}

export default function AnnouncementCard({
  imageUrl,
  imageAlt,
  title,
  description,
  primaryButtonText,
  primaryButtonHref,
}: AnnouncementCardProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden bg-primary shadow-xs sm:flex-row py-10 px-4 md:px-16">
      <div className="relative h-50 w-full sm:h-auto sm:w-60">
        <img
          alt={imageAlt}
          className="absolute inset-0 size-full object-cover"
          src={imageUrl}
        />
        <div className="absolute inset-0 size-full border border-black/10"></div>
      </div>
      
      <div className="flex-1 border border-t-0 border-secondary px-4 py-5 sm:border-t sm:border-l-0 sm:p-6">
        <div className="flex flex-col">
          <h3 className="text-md font-semibold text-primary">
            {title}
          </h3>
          <p className="mt-0.5 text-sm text-tertiary">
            {description}
          </p>
          
          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
            <a
              href={primaryButtonHref || '#'}
              className="group relative inline-flex h-max cursor-pointer items-center justify-center whitespace-nowrap outline-brand transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2 gap-1 px-3.5 py-2.5 text-sm font-semibold bg-brand-solid text-white shadow-xs-skeumorphic ring-1 ring-transparent ring-inset hover:bg-brand-solid_hover before:absolute before:inset-px before:border before:border-white/12"
            >
              <span data-text="true" className="transition-inherit-all px-0.5">
                {primaryButtonText}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}