'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export default function TableOfContents({ contentRef }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!contentRef.current) return;

    // Extract headings from content
    const headings = contentRef.current.querySelectorAll('h2, h3');
    const tocItems: TocItem[] = Array.from(headings).map((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      const text = heading.textContent || '';

      // Generate ID if not present
      let id = heading.id;
      if (!id) {
        id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        heading.id = id;
      }

      return { id, text, level };
    });

    setToc(tocItems);

    // Intersection Observer for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
      }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [contentRef]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (toc.length === 0) return null;

  return (
    <nav className="hidden xl:block">
      <div className="sticky top-24 max-w-xs">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-quaternary">
          Neste artigo
        </h3>
        <ul className="space-y-2">
          {toc.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
            >
              <button
                onClick={() => handleClick(item.id)}
                className={`text-left text-sm transition duration-200 hover:text-brand-600 ${
                  activeId === item.id
                    ? 'font-semibold text-brand-600'
                    : 'text-tertiary'
                }`}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
