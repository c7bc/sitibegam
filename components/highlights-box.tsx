interface HighlightArticle {
  id: string | number
  imageUrl: string
  imageAlt: string
  date: string
  title: string
  link: string
}

interface HighlightCategory {
  name: string
  href: string
  featured: HighlightArticle
  posts: Array<{ title: string; link: string }>
}

interface HighlightsBoxProps {
  categories: HighlightCategory[]
}

export default function HighlightsBox({ categories }: HighlightsBoxProps) {
  if (categories.length === 0) return null

  return (
    <section className="bg-white py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div key={cat.name}>
              {/* Category header */}
              <div className="border-b-2 border-brand-600 mb-4">
                <a
                  href={cat.href}
                  className="inline-block text-sm font-semibold uppercase text-gray-700 pb-2 hover:text-brand-600 transition tracking-wide"
                >
                  {cat.name}
                </a>
              </div>

              {/* Featured article */}
              <a href={cat.featured.link} className="group block">
                <img
                  src={cat.featured.imageUrl}
                  alt={cat.featured.imageAlt}
                  className="w-full aspect-[214/140] object-cover transition group-hover:opacity-80"
                />
                <div className="mt-2">
                  <time className="text-xs text-gray-400">{cat.featured.date}</time>
                  <h3 className="mt-0.5 text-sm font-semibold text-gray-900 leading-snug group-hover:text-brand-600 transition line-clamp-2">
                    {cat.featured.title}
                  </h3>
                </div>
              </a>

              {/* Post links */}
              <ul className="mt-3 flex flex-col">
                {cat.posts.map((post, i) => (
                  <li key={i} className="border-t border-gray-100 py-2">
                    <a
                      href={post.link}
                      className="flex items-start gap-2 text-sm text-gray-700 hover:text-brand-600 transition"
                    >
                      <svg className="size-3 mt-1 shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="line-clamp-2">{post.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
    </section>
  )
}
