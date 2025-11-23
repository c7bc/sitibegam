// components/BlogHero.tsx
interface BlogHeroProps {
  tag: string;
  title: string;
  description: string;
}

export default function BlogHero({ tag, title, description }: BlogHeroProps) {
  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="mx-auto max-w-container px-4 md:px-8">
        <div className="flex w-full max-w-3xl flex-col">
          <span className="text-sm font-semibold text-brand-600 md:text-md">
            {tag}
          </span>
          <h2 className="mt-3 text-display-md font-semibold text-primary md:text-display-lg">
            {title}
          </h2>
          <p className="mt-4 text-lg text-tertiary md:mt-6 md:text-xl">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}