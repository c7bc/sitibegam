interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  baseUrl?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  baseUrl,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const getHref = (page: number) => {
    if (baseUrl) {
      return `${baseUrl}?page=${page}`;
    }
    return undefined;
  };

  return (
    <nav
      aria-label="Paginação"
      className="flex w-full items-center justify-between gap-3 border-t border-border-secondary pt-4 md:pt-5"
    >
      {/* Desktop Previous Button */}
      <div className="hidden flex-1 justify-start md:flex">
        {currentPage > 1 ? (
          <button
            onClick={(e) => handleClick(e, currentPage - 1)}
            className="group relative inline-flex h-max cursor-pointer items-center whitespace-nowrap outline-brand transition duration-100 ease-linear px-3 py-2 text-sm font-semibold text-tertiary hover:text-tertiary_hover gap-1"
            aria-label="Página anterior"
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
              className="size-5 text-brand-secondary group-hover:text-brand-solid"
            >
              <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
            </svg>
            <span className="underline decoration-transparent underline-offset-2 group-hover:decoration-current">
              Previous
            </span>
          </button>
        ) : (
          <button
            disabled
            className="relative inline-flex h-max items-center whitespace-nowrap px-3 py-2 text-sm font-semibold text-fg-disabled gap-1 cursor-not-allowed"
            aria-label="Página anterior"
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
              className="size-5 text-fg-disabled_subtle"
            >
              <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
            </svg>
            <span className="underline decoration-transparent underline-offset-2">
              Previous
            </span>
          </button>
        )}
      </div>

      {/* Mobile Previous Button */}
      {currentPage > 1 ? (
        <button
          onClick={(e) => handleClick(e, currentPage - 1)}
          className="group relative inline-flex h-max cursor-pointer items-center justify-center whitespace-nowrap outline-brand transition duration-100 ease-linear gap-1 px-3 py-2 text-sm font-semibold bg-primary text-secondary shadow-xs-skeumorphic ring-1 ring-primary ring-inset hover:bg-primary_hover hover:text-secondary_hover md:hidden"
          aria-label="Página anterior"
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
            className="size-5 text-brand-secondary group-hover:text-brand-solid"
          >
            <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
          </svg>
          <span className="px-0.5">Previous</span>
        </button>
      ) : (
        <button
          disabled
          className="relative inline-flex h-max items-center justify-center whitespace-nowrap gap-1 px-3 py-2 text-sm font-semibold bg-primary text-fg-disabled shadow-xs ring-1 ring-disabled_subtle ring-inset cursor-not-allowed md:hidden"
          aria-label="Página anterior"
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
            className="size-5 text-fg-disabled_subtle"
          >
            <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
          </svg>
          <span className="px-0.5">Previous</span>
        </button>
      )}

      {/* Desktop Page Numbers */}
      <div className="hidden justify-center gap-0.5 md:flex">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex size-10 shrink-0 items-center justify-center text-tertiary"
                aria-hidden="true"
              >
                …
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={(e) => handleClick(e, pageNumber)}
              aria-label={`Página ${pageNumber}`}
              aria-current={isActive ? "page" : undefined}
              className={`flex size-10 cursor-pointer items-center justify-center p-3 text-md font-semibold outline-focus-ring transition duration-100 ease-linear hover:bg-primary_hover hover:text-secondary focus-visible:z-10 focus-visible:bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isActive ? "bg-brand-secondary text-white" : "text-quaternary"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Mobile Page Counter */}
      <div className="flex justify-center text-sm whitespace-pre text-fg-secondary md:hidden">
        Page <span className="font-medium">{currentPage}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </div>

      {/* Desktop Next Button */}
      <div className="hidden flex-1 justify-end md:flex">
        {currentPage < totalPages ? (
          <button
            onClick={(e) => handleClick(e, currentPage + 1)}
            className="group relative inline-flex h-max cursor-pointer items-center whitespace-nowrap outline-brand transition duration-100 ease-linear px-3 py-2 text-sm font-semibold text-tertiary hover:text-tertiary_hover gap-1"
            aria-label="Próxima página"
          >
            <span className="underline decoration-transparent underline-offset-2 group-hover:decoration-current">
              Next
            </span>
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
              className="size-5 text-brand-secondary group-hover:text-brand-solid"
            >
              <path d="M5 12h14m0 0-7-7m7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button
            disabled
            className="relative inline-flex h-max items-center whitespace-nowrap px-3 py-2 text-sm font-semibold text-fg-disabled gap-1 cursor-not-allowed"
            aria-label="Próxima página"
          >
            <span className="underline decoration-transparent underline-offset-2">
              Next
            </span>
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
              className="size-5 text-fg-disabled_subtle"
            >
              <path d="M5 12h14m0 0-7-7m7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile Next Button */}
      {currentPage < totalPages ? (
        <button
          onClick={(e) => handleClick(e, currentPage + 1)}
          className="group relative inline-flex h-max cursor-pointer items-center justify-center whitespace-nowrap outline-brand transition duration-100 ease-linear gap-1 px-3 py-2 text-sm font-semibold bg-primary text-secondary shadow-xs-skeumorphic ring-1 ring-primary ring-inset hover:bg-primary_hover hover:text-secondary_hover md:hidden"
          aria-label="Próxima página"
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
            className="size-5 text-brand-secondary group-hover:text-brand-solid"
          >
            <path d="M5 12h14m0 0-7-7m7 7-7 7" />
          </svg>
        </button>
      ) : (
        <button
          disabled
          className="relative inline-flex h-max items-center justify-center whitespace-nowrap gap-1 px-3 py-2 text-sm font-semibold bg-primary text-fg-disabled shadow-xs ring-1 ring-disabled_subtle ring-inset cursor-not-allowed md:hidden"
          aria-label="Próxima página"
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
            className="size-5 text-fg-disabled_subtle"
          >
            <path d="M5 12h14m0 0-7-7m7 7-7 7" />
          </svg>
        </button>
      )}
    </nav>
  );
}
