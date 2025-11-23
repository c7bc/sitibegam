'use client';

import { useRef } from 'react';
import ShareButtons from './share-buttons';
import TableOfContents from './table-of-contents';

interface TableOfContentsClientProps {
  content: string;
  slug: string;
  title: string;
}

export default function TableOfContentsClient({
  content,
  slug,
  title,
}: TableOfContentsClientProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Main Content */}
      <div className="min-w-0">
        <article
          ref={contentRef}
          className="prose md:prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Share Section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <ShareButtons url={`/publicacoes/${slug}`} title={title} />
        </div>
      </div>

      {/* Sidebar - Table of Contents */}
      <TableOfContents contentRef={contentRef} />
    </>
  );
}
