// components/CTACards.tsx

interface CTACard {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

interface CTACardsProps {
  ctas: CTACard[];
}

export default function CTACards({ ctas }: CTACardsProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto">
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {ctas.map((cta) => (
            <li key={cta.id}>
              <div className="flex h-full flex-col gap-5 bg-primary p-6 shadow-xs md:p-8">
                <div className="relative inline-flex size-12 shrink-0 items-center justify-center bg-primary text-brand-600 shadow-xs-skeumorphic ring-1 ring-inset ring-primary">
                  <svg
                    viewBox="0 0 24 24"
                    width={24}
                    height={24}
                    stroke="currentColor"
                    strokeWidth={2}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="size-6"
                  >
                    {cta.icon}
                  </svg>
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <h3 className="text-lg font-semibold text-brand-600">
                    {cta.title}
                  </h3>
                  <p className="text-sm text-tertiary">
                    {cta.description}
                  </p>
                </div>

                <a
                  href={cta.link}
                  className="group relative inline-flex h-max cursor-pointer items-center justify-center gap-1.5 bg-brand-solid px-4.5 py-3 text-md font-semibold text-white shadow-xs-skeumorphic ring-1 ring-transparent ring-inset transition duration-100 ease-linear hover:bg-brand-solid_hover disabled:cursor-not-allowed disabled:bg-disabled disabled:shadow-xs disabled:ring-disabled_subtle before:absolute before:inset-px before:border before:border-white/12"
                >
                  <span className="px-0.5">{cta.buttonText}</span>
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="size-5"
                  >
                    <path d="M7 17 17 7m0 0H7m10 0v10" />
                  </svg>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
