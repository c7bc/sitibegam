// components/CTASection.tsx
interface CTASectionProps {
  title: {
    desktop: string;
    mobile: string;
  };
  description: {
    desktop: string;
    mobile: string;
  };
  imageUrl: string;
  imageAlt: string;
  primaryButton: {
    text: string;
    onClick: () => void;
  };
  secondaryButton: {
    text: string;
    onClick: () => void;
  };
}

export default function CTASection({
  title,
  description,
  imageUrl,
  imageAlt,
  primaryButton,
  secondaryButton,
}: CTASectionProps) {
  return (
    <div className="mx-auto grid w-full max-w-container grid-cols-1 gap-12 px-4 md:gap-16 md:px-8 lg:grid-cols-2 lg:items-center">
      <div className="flex max-w-3xl flex-col items-start">
        <h2 className="text-display-sm font-semibold text-primary md:text-display-md lg:text-display-lg">
          <span className="max-md:hidden">{title.desktop}</span>
          <span className="md:hidden">{title.mobile}</span>
        </h2>
        <p className="mt-4 text-lg text-tertiary md:mt-6 md:text-xl">
          <span className="md:hidden">{description.mobile}</span>
          <span className="max-md:hidden">{description.desktop}</span>
        </p>
        <div className="mt-8 flex w-full flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-start md:mt-12">
          <button
            onClick={secondaryButton.onClick}
            className="group relative inline-flex h-max cursor-pointer items-center justify-center gap-1.5 bg-primary px-4.5 py-3 text-md font-semibold text-secondary shadow-xs-skeumorphic ring-1 ring-primary ring-inset transition duration-100 ease-linear hover:bg-primary_hover hover:text-secondary_hover disabled:cursor-not-allowed disabled:text-fg-disabled disabled:shadow-xs disabled:ring-disabled_subtle"
          >
            <span className="px-0.5">{secondaryButton.text}</span>
          </button>
          <button
            onClick={primaryButton.onClick}
            className="group relative inline-flex h-max cursor-pointer items-center justify-center gap-1.5 bg-brand-solid px-4.5 py-3 text-md font-semibold text-white shadow-xs-skeumorphic ring-1 ring-transparent ring-inset transition duration-100 ease-linear hover:bg-brand-solid_hover before:absolute before:inset-px before:border before:border-white/12 disabled:bg-disabled disabled:shadow-xs disabled:ring-disabled_subtle"
          >
            <span className="px-0.5">{primaryButton.text}</span>
          </button>
        </div>
      </div>
      <img
        className="h-70 w-full object-cover md:h-95 lg:h-148"
        src={imageUrl}
        alt={imageAlt}
      />
    </div>
  );
}