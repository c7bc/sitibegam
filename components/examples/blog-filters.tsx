// components/BlogFilters.tsx
'use client';

import { useState } from 'react';

interface BlogFiltersProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function BlogFilters({
  categories,
  activeCategory,
  onCategoryChange,
}: BlogFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex w-full flex-col items-stretch md:max-w-70 md:gap-8">
      {/* Search - Desktop only */}
      <div className="group hidden w-full flex-col items-start justify-start gap-1.5 md:flex">
        <div className="relative w-full bg-primary shadow-xs ring-1 ring-primary ring-inset">
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
            className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-fg-quaternary"
          >
            <path d="m21 21-3.5-3.5m2.5-6a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent px-3.5 py-2.5 pl-10.5 text-md text-primary outline-none placeholder:text-placeholder"
          />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <p className="hidden text-sm font-semibold text-brand-600 md:block">
          Blog categories
        </p>

        {/* Mobile Select */}
        <div className="relative w-full md:hidden">
          <select
            value={activeCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full appearance-none bg-primary px-3.5 py-2.5 text-md font-medium text-primary shadow-xs ring-1 ring-primary ring-inset outline-none"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
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
            className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-fg-quaternary"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden w-full flex-col md:flex">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`flex h-max cursor-pointer items-center justify-start gap-2 whitespace-nowrap px-3 py-2.5 text-md font-semibold transition duration-100 ease-linear ${
                activeCategory === category
                  ? 'bg-active text-secondary'
                  : 'text-quaternary hover:bg-primary_hover'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}