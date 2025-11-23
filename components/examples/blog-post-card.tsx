// components/BlogPostCard.tsx
interface BlogPost {
  id: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  readTime: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  link: string;
}

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  if (featured) {
    return (
      <li className="flex flex-col gap-6 md:gap-8 lg:col-span-2 lg:flex-row">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start xl:gap-8">
          <a href={post.link} className="shrink-0 overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.imageAlt}
              className="aspect-[1.5] w-full object-cover lg:w-105 xl:w-140"
            />
          </a>
          <div className="flex flex-col gap-5 lg:gap-6">
            <div className="flex flex-col gap-3 lg:gap-4">
              <div className="inline-flex w-max cursor-pointer items-center bg-utility-brand-50 py-1 pl-1 pr-2 text-xs font-medium text-utility-brand-700 ring-1 ring-inset ring-utility-brand-200 transition duration-100 ease-linear hover:bg-utility-brand-100">
                <span className="mr-2 inline-flex items-center bg-primary px-2 py-0.5 text-current ring-1 ring-inset ring-utility-brand-200">
                  {post.category}
                </span>
                {post.readTime}
              </div>
              <div className="flex flex-col gap-1 xl:gap-3">
                <a
                  href={post.link}
                  className="flex justify-between gap-x-4 text-lg font-semibold text-primary md:text-display-xs"
                >
                  {post.title}
                </a>
                <p className="line-clamp-2 text-md text-tertiary xl:line-clamp-4">
                  {post.description}
                </p>
              </div>
            </div>
            <div className="flex max-h-10 gap-2">
              <a href={post.link}>
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="size-10 object-cover"
                />
              </a>
              <div>
                <p className="text-sm font-semibold">
                  <a href={post.link} className="text-primary hover:text-tertiary_hover">
                    {post.author.name}
                  </a>
                </p>
                <p className="text-sm text-tertiary">{post.date}</p>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-6 md:gap-8">
      <article className="flex flex-col gap-4">
        <a href={post.link} className="overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.imageAlt}
            className="aspect-[1.5] w-full object-cover"
          />
        </a>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-start gap-3">
            <div className="inline-flex w-max cursor-pointer items-center bg-utility-brand-50 py-1 pl-1 pr-3 text-xs font-medium text-utility-brand-700 ring-1 ring-inset ring-utility-brand-200 transition duration-100 ease-linear hover:bg-utility-brand-100">
              <span className="mr-2 inline-flex items-center bg-primary px-2 py-0.5 text-current ring-1 ring-inset ring-utility-brand-200">
                {post.category}
              </span>
              {post.readTime}
            </div>
            <div className="flex flex-col gap-1">
              <a
                href={post.link}
                className="flex justify-between gap-x-4 text-lg font-semibold text-primary"
              >
                {post.title}
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="mt-0.5 size-6 shrink-0 text-fg-quaternary"
                >
                  <path d="M7 17 17 7m0 0H7m10 0v10" />
                </svg>
              </a>
              <p className="line-clamp-2 text-md text-tertiary md:line-clamp-none">
                {post.description}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <a href={post.link} className="flex">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="size-10 object-cover"
              />
            </a>
            <div>
              <a
                href={post.link}
                className="block text-sm font-semibold text-primary"
              >
                {post.author.name}
              </a>
              <time className="block text-sm text-tertiary">{post.date}</time>
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}