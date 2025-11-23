// components/RecentNews.tsx

interface NewsItem {
  id: string | number;
  imageUrl: string;
  imageAlt: string;
  category: string;
  date: string;
  title: string;
  link: string;
}

interface RecentNewsProps {
  news: NewsItem[];
}

export default function RecentNews({ news }: RecentNewsProps) {
  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="mx-auto px-4 md:px-8">
        <div className="mb-12 md:mb-16">
          <h2 className="text-display-sm font-semibold text-primary md:text-display-md">
            Notícias Recentes
          </h2>
          {/* <p className="mt-4 text-lg text-tertiary md:text-xl">
            Acompanhe as últimas novidades do sindicato e da categoria
          </p> */}
        </div>

        <ul className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <li key={item.id} className="flex flex-col">
              <a href={item.link} className="group flex flex-col gap-5">
                <div className="overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    className="aspect-video w-full object-cover transition duration-200 ease-linear group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex bg-utility-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 ring-1 ring-inset ring-utility-brand-200">
                      {item.category}
                    </span>
                    <span className="text-sm text-tertiary">{item.date}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-primary transition duration-200 ease-linear group-hover:text-brand-600">
                    {item.title}
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
