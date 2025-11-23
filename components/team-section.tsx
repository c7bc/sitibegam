import { NavButton } from "@/components/ui/nav";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  imageAlt: string;
}

interface TeamSectionProps {
  badge?: string;
  title: string;
  description?: string;
  members: TeamMember[];
  primaryButton?: {
    text: string;
    href: string;
  };
  secondaryButton?: {
    text: string;
    href: string;
  };
}

export default function TeamSection({
  badge,
  title,
  description,
  members,
  primaryButton,
  secondaryButton,
}: TeamSectionProps) {
  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex w-full flex-col justify-between md:flex-row">
          <div className="flex flex-1 flex-col">
            {badge && (
              <span className="text-sm font-semibold text-brand-secondary md:text-md">
                {badge}
              </span>
            )}
            <h2 className="mt-3 text-display-sm font-semibold text-primary md:text-display-md">
              {title}
            </h2>
            {description && (
              <p className="mt-4 text-lg text-tertiary md:mt-5 md:text-xl">
                {description}
              </p>
            )}
          </div>

          {(primaryButton || secondaryButton) && (
            <div className="mt-8 flex flex-col gap-3 self-stretch md:mt-0 md:flex-row-reverse md:justify-center md:self-start">
              {primaryButton && (
                <NavButton
                  label={primaryButton.text}
                  href={primaryButton.href}
                  variant="primary"
                />
              )}
              {secondaryButton && (
                <NavButton
                  label={secondaryButton.text}
                  href={secondaryButton.href}
                  variant="secondary"
                />
              )}
            </div>
          )}
        </div>

        <div className="mt-12 md:mt-16">
          <ul className="grid w-full grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {members.map((member) => (
              <li key={member.id} className="flex flex-col gap-3">
                <img
                  alt={member.imageAlt}
                  src={member.imageUrl}
                  className="aspect-square w-full object-cover"
                />
                <div>
                  <h3 className="text-md font-semibold text-primary">
                    {member.name}
                  </h3>
                  <p className="text-sm text-brand-secondary">{member.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
