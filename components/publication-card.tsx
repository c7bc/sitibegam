interface PublicationCardProps {
  imageUrl: string;
  imageAlt: string;
  category: string;
  title: string;
  date: string;
  link: string;
}

export default function PublicationCard({
  imageUrl,
  imageAlt,
  category,
  title,
  date,
  link,
}: PublicationCardProps) {
  return (
    <li className="flex flex-col">
      <a href={link} className="group flex flex-col gap-5">
        <div className="overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="aspect-video w-full object-cover transition duration-200 ease-linear group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex bg-utility-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 ring-1 ring-inset ring-utility-brand-200">
              {category}
            </span>
            <span className="text-sm text-tertiary">{date}</span>
          </div>

          <h3 className="text-lg font-semibold text-primary transition duration-200 ease-linear group-hover:text-brand-600 truncate">
            {title}
          </h3>
        </div>
      </a>
    </li>
  );
}
