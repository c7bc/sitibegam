// components/NewsletterSection.tsx
'use client';

import { useState } from 'react';

interface NewsletterSectionProps {
  title: string;
  description: string;
  privacyPolicyUrl?: string;
  onSubmit?: (email: string) => void;
}

export default function NewsletterSection({
  title,
  description,
  privacyPolicyUrl = '#',
  onSubmit,
}: NewsletterSectionProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(email);
      setEmail('');
    }
  };

  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-container flex-col items-start justify-between gap-8 px-4 md:px-8 lg:flex-row">
        <div>
          <h1 className="text-display-sm font-semibold text-primary md:text-display-md">
            {title}
          </h1>
          <p className="mt-4 text-lg text-tertiary md:mt-5 md:text-xl">
            {description}
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 md:max-w-120 md:flex-row"
        >
          <div className="group flex h-max w-full flex-col items-start justify-start gap-1.5">
            <div className="relative flex w-full flex-row place-content-center place-items-center bg-primary py-0.5 shadow-xs ring-1 ring-primary ring-inset transition-shadow duration-100 ease-linear group-disabled:cursor-not-allowed group-disabled:bg-disabled_subtle group-disabled:ring-disabled group-invalid:ring-error_subtle md:max-w-[345px]">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="m-0 w-full bg-transparent px-3.5 py-2.5 text-md text-primary outline-hidden ring-0 placeholder:text-placeholder"
                aria-label="Enter your email"
                name="email"
              />
            </div>
            <span className="text-sm text-tertiary group-invalid:text-error-primary">
              We care about your data in our{' '}
              <a
                href={privacyPolicyUrl}
                className="underline underline-offset-3"
              >
                privacy policy
              </a>
              .
            </span>
          </div>
          <button
            type="submit"
            className="group relative inline-flex h-max cursor-pointer items-center justify-center gap-1.5 bg-brand-solid px-4.5 py-3 text-md font-semibold text-white shadow-xs-skeumorphic ring-1 ring-transparent ring-inset transition duration-100 ease-linear hover:bg-brand-solid_hover before:absolute before:inset-px before:border before:border-white/12 disabled:bg-disabled disabled:shadow-xs disabled:ring-disabled_subtle"
          >
            <span className="px-0.5">Subscribe</span>
          </button>
        </form>
      </div>
    </section>
  );
}