interface ContactInfo {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

interface ContactInfoSectionProps {
  badge?: string;
  title: string;
  description?: string;
  contacts: ContactInfo[];
}

export default function ContactInfoSection({
  badge,
  title,
  description,
  contacts,
}: ContactInfoSectionProps) {
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

        <div className="mt-16 md:mt-24">
          <ul className="grid w-full grid-cols-1 justify-items-center gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <li
                key={contact.id}
                className="flex max-w-sm flex-col items-center text-center"
              >
                {/* Desktop Icon */}
                <div className="relative hidden size-12 shrink-0 items-center justify-center bg-brand-secondary text-featured-icon-light-fg-brand md:flex">
                  <div className="size-6">{contact.icon}</div>
                </div>

                {/* Mobile Icon */}
                <div className="relative flex size-10 shrink-0 items-center justify-center bg-brand-secondary text-featured-icon-light-fg-brand md:hidden">
                  <div className="size-5">{contact.icon}</div>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-primary md:mt-5">
                  {contact.title}
                </h3>
                <p className="mt-1 text-md text-tertiary">{contact.description}</p>
                <a
                  href={contact.linkHref}
                  className="group relative mt-4 inline-flex h-max cursor-pointer items-center justify-normal whitespace-pre p-0 px-4 py-2.5 text-md font-semibold text-brand-secondary outline-brand transition duration-100 ease-linear hover:text-brand-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2 md:mt-5"
                >
                  <span className="underline decoration-transparent underline-offset-2 transition-inherit-all group-hover:decoration-current">
                    {contact.linkText}
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
