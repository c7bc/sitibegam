import { NavButton } from "@/components/ui/nav";

interface ContentItem {
  id: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  date: string;
  title: string;
  description: string;
  link: string;
}

interface ContentShowcaseProps {
  title?: string;
  description?: string;
  items?: ContentItem[];
  buttonText?: string;
  buttonHref?: string;
}

const defaultItems: ContentItem[] = [
  {
    id: "1",
    imageUrl: "/hero.jpeg",
    imageAlt: "Conteúdo em destaque",
    category: "Notícia",
    date: "3 de novembro de 2025",
    title: "Sindicato conquista direitos importantes para a categoria",
    description: "Confira as últimas conquistas do SITIBEGAM",
    link: "#",
  },
  {
    id: "2",
    imageUrl: "/hero.jpeg",
    imageAlt: "Conteúdo em destaque",
    category: "Artigo",
    date: "1 de novembro de 2025",
    title: "Entenda seus direitos trabalhistas",
    description: "Saiba mais sobre os direitos dos trabalhadores de bebidas",
    link: "#",
  },
  {
    id: "3",
    imageUrl: "/hero.jpeg",
    imageAlt: "Conteúdo em destaque",
    category: "Evento",
    date: "30 de outubro de 2025",
    title: "Próximos eventos do sindicato",
    description: "Participe das atividades do SITIBEGAM",
    link: "#",
  },
];

export default function ContentShowcase({
  title = "Fique por dentro",
  description = "Acompanhe as últimas novidades e conquistas do SITIBEGAM",
  items = defaultItems,
  buttonText = "Ver mais",
  buttonHref = "#",
}: ContentShowcaseProps) {
  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-x-16 gap-y-12 px-4 md:px-8 lg:flex-row">
        {/* Header Section */}
        <div className="w-full max-w-100">
          <h2 className="text-display-sm font-semibold text-primary md:text-display-md">
            {title}
          </h2>
          <p className="mt-4 text-lg text-tertiary md:mt-5">{description}</p>

          {/* Desktop Button */}
          <div className="mt-12 hidden md:mt-8 md:flex">
            <NavButton
              label={buttonText}
              href={buttonHref}
              variant="primary"
            />
          </div>
        </div>

        {/* Content List */}
        <ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-12 lg:col-span-3 lg:grid-cols-1">
          {items.map((item) => (
            <li key={item.id}>
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
                {/* Image */}
                <a
                  href={item.link}
                  className="shrink-0 overflow-hidden transition duration-100 ease-linear hover:shadow-2xl"
                  tabIndex={-1}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    className="h-60 w-full object-cover xl:h-50 xl:w-91.5"
                  />
                </a>

                {/* Content */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-start gap-3">
                    {/* Category Badge and Date */}
                    <div className="flex items-center gap-2">
                      <span className="inline-flex bg-utility-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 ring-1 ring-inset ring-utility-brand-200">
                        {item.category}
                      </span>
                      <span className="text-sm text-tertiary">{item.date}</span>
                    </div>

                    {/* Title */}
                    <a
                      href={item.link}
                      className="text-xl font-semibold text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 xl:text-lg"
                    >
                      {item.title}
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Mobile Button */}
        <div className="flex flex-col gap-3 md:hidden">
          <NavButton
            label={buttonText}
            href={buttonHref}
            variant="primary"
          />
        </div>
      </div>
    </section>
  );
}
