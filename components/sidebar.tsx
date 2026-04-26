import type { CTAContent, AnnouncementContent, NewsItem } from '@/types/payload'

interface SidebarProps {
  ctaContent?: CTAContent
  announcementContent?: AnnouncementContent
  recentPosts?: NewsItem[]
}

export default function Sidebar({ ctaContent, announcementContent, recentPosts = [] }: SidebarProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* CTA Banner Card */}
      {ctaContent && (
        <div className="bg-white border border-gray-200 overflow-hidden">
          {ctaContent.imageUrl && (
            <a href={ctaContent.primaryButtonHref}>
              <img
                src={ctaContent.imageUrl}
                alt={ctaContent.imageAlt}
                className="w-full aspect-square object-cover hover:opacity-90 transition"
              />
            </a>
          )}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-800 leading-snug">{ctaContent.title}</h3>
            <p className="mt-1 text-xs text-gray-500 line-clamp-3">{ctaContent.description}</p>
            <a
              href={ctaContent.primaryButtonHref}
              className="mt-3 inline-block bg-brand-600 text-white text-xs font-semibold px-4 py-2 hover:bg-brand-700 transition"
            >
              {ctaContent.primaryButtonText}
            </a>
          </div>
        </div>
      )}

      {/* Announcement Banner */}
      {announcementContent && (
        <div className="bg-white border border-gray-200 overflow-hidden">
          {announcementContent.imageUrl && (
            <a href={announcementContent.primaryButtonHref || '#'}>
              <img
                src={announcementContent.imageUrl}
                alt={announcementContent.imageAlt}
                className="w-full object-cover hover:opacity-90 transition"
              />
            </a>
          )}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-800 leading-snug">{announcementContent.title}</h3>
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">{announcementContent.description}</p>
            <a
              href={announcementContent.primaryButtonHref || '#'}
              className="mt-3 inline-block bg-brand-600 text-white text-xs font-semibold px-4 py-2 hover:bg-brand-700 transition"
            >
              {announcementContent.primaryButtonText}
            </a>
          </div>
        </div>
      )}

      {/* Recent Posts Widget */}
      {recentPosts.length > 0 && (
        <div className="bg-white border border-gray-200">
          <div className="border-b-2 border-brand-600 px-4 py-2">
            <h3 className="text-sm font-semibold uppercase text-gray-700 tracking-wide">Recentes</h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentPosts.map((post, idx) => (
              <li key={post.id ?? `recent-${idx}`} className="px-4 py-3">
                <a href={post.link} className="group flex gap-3">
                  <img
                    src={post.imageUrl}
                    alt={post.imageAlt}
                    className="w-[80px] h-[60px] object-cover shrink-0 transition group-hover:opacity-80"
                  />
                  <div className="flex flex-col justify-center min-w-0">
                    <time className="text-[11px] text-gray-400">{post.date}</time>
                    <h4 className="mt-0.5 text-xs font-semibold text-gray-900 leading-snug group-hover:text-brand-600 transition line-clamp-2">
                      {post.title}
                    </h4>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
