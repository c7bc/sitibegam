interface PublicationsHeroProps {
  badge?: string;
  title: string;
  description?: string;
}

export default function PublicationsHero({
  badge,
  title,
  description,
}: PublicationsHeroProps) {
  return (
    <div className="flex w-full max-w-3xl flex-col items-center text-center mx-auto">
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
  );
}
