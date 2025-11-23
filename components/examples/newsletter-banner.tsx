// components/NewsletterBanner.tsx
'use client';

import { useState } from 'react';

interface NewsletterBannerProps {
  title: string;
  description: string;
  onSubmit?: (email: string) => void;
  onDismiss?: () => void;
}

export default function NewsletterBanner({
  title,
  description,
  onSubmit,
  onDismiss,
}: NewsletterBannerProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(email);
      setEmail('');
    }
  };

  return (
    <div className="relative mx-2 mb-4 flex flex-col gap-4 bg-secondary_subtle p-4 shadow-lg ring-1 ring-primary ring-inset md:m-0 md:flex-row md:items-center md:gap-3 md:p-3">
      <div className="flex flex-1 items-center gap-4 md:w-0">
        <div
          className="relative hidden size-12 shrink-0 items-center justify-center bg-primary text-fg-secondary shadow-xs-skeumorphic ring-1 ring-inset ring-primary md:flex"
          data-featured-icon="true"
        >
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
            data-icon="true"
            className="z-1 size-6"
          >
            <path d="m2 7 8.165 5.715c.661.463.992.695 1.351.784a2 2 0 0 0 .968 0c.36-.09.69-.32 1.351-.784L22 7M6.8 20h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 17.72 22 16.88 22 15.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 4 18.88 4 17.2 4H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 6.28 2 7.12 2 8.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 20 5.12 20 6.8 20Z" />
          </svg>
        </div>
        <div className="flex flex-col gap-0.5 overflow-auto">
          <p className="pr-8 text-md font-semibold text-secondary md:truncate md:pr-0">
            {title} <span className="hidden md:inline">and updates</span>
          </p>
          <p className="text-md text-tertiary md:truncate">{description}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-3 md:w-100 md:flex-row md:gap-4"
        >
          <div className="group flex h-max w-full flex-col items-start justify-start gap-1.5">
            <div className="relative flex w-full flex-1 flex-row place-content-center place-items-center bg-primary shadow-xs ring-1 ring-primary ring-inset transition-shadow duration-100 ease-linear group-disabled:cursor-not-allowed group-disabled:bg-disabled_subtle group-disabled:ring-disabled group-invalid:ring-error_subtle">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="m-0 w-full bg-transparent px-3.5 py-2.5 text-md text-primary outline-hidden ring-0 placeholder:text-placeholder"
                aria-label="Enter your email"
              />
            </div>
          </div>
          <button
            type="submit"
            className="group relative inline-flex h-max cursor-pointer items-center justify-center gap-1.5 bg-primary px-4 py-2.5 text-md font-semibold text-secondary shadow-xs-skeumorphic ring-1 ring-primary ring-inset transition duration-100 ease-linear hover:bg-primary_hover hover:text-secondary_hover disabled:cursor-not-allowed disabled:text-fg-disabled disabled:shadow-xs disabled:ring-disabled_subtle"
          >
            <span className="px-0.5">Subscribe</span>
          </button>
        </form>
        <div className="absolute top-2 right-2 flex shrink-0 items-center justify-center md:static">
          <button
            onClick={onDismiss}
            className="flex size-10 cursor-pointer items-center justify-center p-2 text-fg-quaternary transition duration-100 ease-linear hover:bg-primary_hover hover:text-fg-quaternary_hover"
            aria-label="Dismiss"
          >
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
              className="size-5 shrink-0"
            >
              <path d="M17 7 7 17M7 7l10 10" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}