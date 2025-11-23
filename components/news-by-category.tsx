'use client';

import { useState } from 'react';

interface CategoryNews {
  id: string | number;
  imageUrl: string;
  imageAlt: string;
  date: string;
  title: string;
  link: string;
}

interface NewsByCategoryProps {
  categories: {
    [key: string]: CategoryNews[];
  };
}

export default function NewsByCategory({ categories }: NewsByCategoryProps) {
  const categoryNames = Object.keys(categories);
  const [activeCategory, setActiveCategory] = useState(categoryNames[0] || '');

  // Don't render if no categories
  if (categoryNames.length === 0) {
    return null;
  }

  const activeCategoryNews = categories[activeCategory] || [];

  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="mx-auto px-4 md:px-8">
        <div className="mb-8 md:mb-12">
          <h2 className="text-display-sm font-semibold text-primary md:text-display-md">
            Notícias por Categoria
          </h2>
        </div>

        {/* Tabs */}
        <div className="border-b border-secondary">
          <nav className="-mb-px flex gap-8 overflow-x-auto">
            {categoryNames.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-md font-semibold transition duration-200 ease-linear ${
                  activeCategory === category
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-tertiary hover:border-secondary hover:text-secondary'
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>

        {/* News List - 2 columns */}
        <ul className="mt-8 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-2 md:gap-x-8 md:gap-y-6">
          {activeCategoryNews.map((news) => (
            <li key={news.id}>
              <a
                href={news.link}
                className="group flex gap-4"
              >
                <div className="shrink-0 overflow-hidden">
                  <img
                    src={news.imageUrl}
                    alt={news.imageAlt}
                    className="h-24 w-28 object-cover transition duration-200 ease-linear group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-center gap-2">
                  <time className="text-sm text-tertiary">{news.date}</time>
                  <h3 className="text-md font-semibold text-primary transition duration-200 ease-linear group-hover:text-brand-600">
                    {news.title}
                  </h3>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
