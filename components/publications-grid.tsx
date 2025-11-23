"use client";

import { useState } from "react";
import PublicationCard from "./publication-card";
import Pagination from "./pagination";

interface Publication {
  id: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  title: string;
  date: string;
  link: string;
}

interface PublicationsGridProps {
  publications: Publication[];
  categories?: {
    id: string;
    label: string;
  }[];
  defaultCategory?: string;
  showSorting?: boolean;
  itemsPerPage?: number;
}

export default function PublicationsGrid({
  publications,
  categories = [
    { id: "all", label: "Ver todas" },
  ],
  defaultCategory = "all",
  showSorting = true,
  itemsPerPage = 6,
}: PublicationsGridProps) {
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter publications by category and search query
  let filteredPublications = activeCategory === "all"
    ? publications
    : publications.filter((pub) => {
        // Find the category label for the active category id
        const activeCategoryData = categories.find(cat => cat.id === activeCategory);
        if (!activeCategoryData) return false;

        // Compare publication category with the category label (case-insensitive)
        return pub.category.toLowerCase() === activeCategoryData.label.toLowerCase();
      });

  // Apply search filter
  if (searchQuery.trim()) {
    filteredPublications = filteredPublications.filter((pub) =>
      pub.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort publications
  const sortedPublications = [...filteredPublications].sort((a, b) => {
    if (sortBy === "recent") {
      return b.date.localeCompare(a.date);
    }
    // Add other sorting logic here (popular, most viewed, etc.)
    return 0;
  });

  // Paginate
  const totalPages = Math.ceil(sortedPublications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPublications = sortedPublications.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to page 1 when category changes
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Search Input */}
        <div className="mb-8 relative">
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
            className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-fg-quaternary"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            aria-label="Pesquisar"
            type="text"
            placeholder="Pesquisar publicações..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="m-0 w-full bg-primary text-md text-primary outline-hidden placeholder:text-placeholder px-3.5 py-2.5 pl-10.5 shadow-xs ring-1 ring-primary ring-inset focus:ring-2 focus:ring-brand"
          />
        </div>

        {/* Tabs and Sorting */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Mobile Category Select */}
          <div className="w-full md:hidden">
            <div className="relative grid w-full items-center">
              <select
                aria-label="Categorias"
                value={activeCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="appearance-none bg-primary px-3.5 py-2.5 text-md font-medium text-primary shadow-xs ring-1 ring-primary outline-hidden transition duration-100 ease-linear ring-inset placeholder:text-fg-quaternary focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:bg-disabled_subtle disabled:text-disabled"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
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
                className="pointer-events-none absolute right-3.5 size-5 text-fg-quaternary"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden w-full md:block">
            <div className="relative flex gap-3 border-b border-border-secondary">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`z-10 flex h-max cursor-pointer items-center justify-center gap-2 whitespace-nowrap transition duration-100 ease-linear text-sm font-semibold px-1 pb-2.5 pt-0 border-b-2 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    activeCategory === category.id
                      ? "border-fg-brand-primary_alt text-brand-secondary"
                      : "border-transparent text-quaternary hover:text-secondary"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting Dropdown */}
          {showSorting && (
            <div className="w-full md:w-auto md:min-w-64">
              <div className="relative grid items-center">
                <select
                  aria-label="Ordenar por"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-primary px-3.5 py-2.5 text-md font-medium text-primary shadow-xs ring-1 ring-primary outline-hidden transition duration-100 ease-linear ring-inset placeholder:text-fg-quaternary focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:bg-disabled_subtle disabled:text-disabled"
                >
                  <option value="recent">Mais recentes</option>
                  <option value="popular">Mais populares</option>
                  <option value="views">Mais visualizados</option>
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
                  className="pointer-events-none absolute right-3.5 size-5 text-fg-quaternary"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Publications Grid */}
        {paginatedPublications.length > 0 ? (
          <>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedPublications.map((publication) => (
                <PublicationCard key={publication.id} {...publication} />
              ))}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 md:mt-16">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex min-h-64 items-center justify-center">
            <p className="text-lg text-tertiary">
              Nenhuma publicação encontrada nesta categoria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
