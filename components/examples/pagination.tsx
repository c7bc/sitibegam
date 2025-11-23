// components/Pagination.tsx
'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination Navigation"
      className="flex w-full items-center justify-between gap-3 border-t border-secondary pt-4 md:pt-5"
    >
      <div className="flex flex-1 justify-start">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="group relative inline-flex h-max cursor-pointer items-center justify-center gap-1 bg-primary px-3 py-2 text-sm font-semibold text-secondary shadow-xs-skeumorphic ring-1 ring-primary ring-inset transition duration-100 ease-linear hover:bg-primary_hover hover:text-secondary_hover disabled:cursor-not-allowed disabled:text-fg-disabled disabled:shadow-xs disabled:ring-disabled_subtle"
          aria-label="Previous Page"
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
            <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
          </svg>
          <span className="px-0.5">Previous</span>
        </button>
      </div>

      {/* Desktop pagination */}
      <div className="hidden justify-center gap-0.5 md:flex">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex size-10 cursor-pointer items-center justify-center p-3 text-sm font-medium transition duration-100 ease-linear ${
              currentPage === page
                ? 'bg-primary_hover text-secondary'
                : 'text-quaternary hover:bg-primary_hover hover:text-secondary'
            }`}
            aria-current={currentPage === page ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        ))}
        {totalPages > 5 && (
          <>
            <span className="flex size-10 shrink-0 items-center justify-center text-tertiary">
              …
            </span>
            <button
              onClick={() => onPageChange(totalPages)}
              className="flex size-10 cursor-pointer items-center justify-center p-3 text-sm font-medium text-quaternary transition duration-100 ease-linear hover:bg-primary_hover hover:text-secondary"
              aria-label={`Page ${totalPages}`}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Mobile pagination */}
      <div className="flex justify-center whitespace-pre text-sm text-fg-secondary md:hidden">
        Page <span className="font-medium">{currentPage}</span> of{' '}
        <span className="font-medium">{totalPages}</span>
      </div>

      <div className="flex flex-1 justify-end">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="group relative inline-flex h-max cursor-pointer items-center justify-center gap-1 bg-primary px-3 py-2 text-sm font-semibold text-secondary shadow-xs-skeumorphic ring-1 ring-primary ring-inset transition duration-100 ease-linear hover:bg-primary_hover hover:text-secondary_hover disabled:cursor-not-allowed disabled:text-fg-disabled disabled:shadow-xs disabled:ring-disabled_subtle"
          aria-label="Next Page"
        >
          <span className="px-0.5">Next</span>
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
            <path d="M5 12h14m0 0-7-7m7 7-7 7" />
          </svg>
        </button>
      </div>
    </nav>
  );
}