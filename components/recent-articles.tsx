// components/RecentArticles.tsx

interface Article {
  id: string | number;
  imageUrl: string;
  imageAlt: string;
  category: string;
  date: string;
  title: string;
  link: string;
}

interface RecentArticlesProps {
  articles: Article[];
}

export default function RecentArticles({ articles }: RecentArticlesProps) {
  const featuredArticle = articles[0];
  const sideArticles = articles.slice(1, 3);

  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="mx-auto px-4 md:px-8">
        <h2 className="mb-8 text-xl font-semibold text-primary md:text-display-xs">
          Artigos Recentes
        </h2>

        <ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-8">
          {/* Featured Article - Left Side */}
          <li className="flex flex-col gap-6 md:gap-8 xl:row-span-2">
            <a href={featuredArticle.link} className="group flex flex-col gap-4">
              <div className="overflow-hidden">
                <img
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.imageAlt}
                  className="aspect-[1.5] w-full object-cover transition duration-200 ease-linear group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex bg-utility-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 ring-1 ring-inset ring-utility-brand-200">
                    {featuredArticle.category}
                  </span>
                  <span className="text-sm text-tertiary">{featuredArticle.date}</span>
                </div>

                <h3 className="text-lg font-semibold text-primary transition duration-200 ease-linear group-hover:text-brand-600">
                  {featuredArticle.title}
                </h3>
              </div>
            </a>
          </li>

          {/* Side Articles - Right Side */}
          {sideArticles.map((article) => (
            <li key={article.id} className="flex flex-col gap-6 md:gap-8 xl:flex-row xl:gap-6">
              <a href={article.link} className="group flex flex-col gap-4 xl:flex-row xl:items-start">
                <div className="shrink-0 overflow-hidden xl:w-80">
                  <img
                    src={article.imageUrl}
                    alt={article.imageAlt}
                    className="aspect-[1.5] w-full object-cover transition duration-200 ease-linear group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 xl:flex-col xl:items-start xl:gap-1">
                    <span className="inline-flex bg-utility-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 ring-1 ring-inset ring-utility-brand-200">
                      {article.category}
                    </span>
                    <span className="text-sm text-tertiary">{article.date}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-primary transition duration-200 ease-linear group-hover:text-brand-600">
                    {article.title}
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
