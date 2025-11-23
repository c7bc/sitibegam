import PublicationCard from '@/components/publication-card';

interface Publication {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
}

interface RelatedPublicationsProps {
  publications: Publication[];
}

export default function RelatedPublications({ publications }: RelatedPublicationsProps) {
  if (publications.length === 0) return null;

  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-12">
          <h2 className="text-display-sm font-semibold text-primary md:text-display-md">
            Publicações relacionadas
          </h2>
          <p className="mt-4 text-lg text-tertiary md:text-xl">
            Continue lendo sobre temas relacionados
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {publications.slice(0, 3).map((publication) => (
            <PublicationCard
              key={publication.slug}
              link={`/publicacoes/${publication.slug}`}
              title={publication.title}
              imageUrl={publication.image}
              imageAlt={publication.title}
              category={publication.category}
              date={publication.date}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
