import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Sidebar from '@/components/sidebar';

import {
  getSiteData,
  getPostBySlug,
  getLatestPosts,
  getCTASections,
  getAnnouncementCards,
} from '@/lib/api';

import {
  getNavItems,
  transformSiteToFooterContent,
  transformPostToNewsItem,
  transformCTAToContent,
  transformAnnouncementToContent,
  getImageUrl,
  formatDate,
  getCategoryName,
} from '@/lib/utils';

import { lexicalToHtml } from '@/lib/lexical-to-html';

import type {
  NavItem,
  FooterContent,
  CTAContent,
  AnnouncementContent,
  NewsItem,
  PayloadPost,
  PayloadCategory,
} from '@/types/payload';

const defaultCTAContent: CTAContent = {
  title: "Junte-se à luta pelos direitos dos trabalhadores SITIBEGAM",
  description: "Faça parte do maior SITIBEGAM.",
  primaryButtonText: "Quero me sindicalizar",
  primaryButtonHref: "/sindicalize-se",
  secondaryButtonText: "Saiba mais",
  secondaryButtonHref: "/sindicato",
  imageUrl: "/category.jpg",
  imageAlt: "Trabalhador SITIBEGAM",
};

const defaultAnnouncementContent: AnnouncementContent = {
  imageUrl: "/cta.jpg",
  imageAlt: "Trabalhador SITIBEGAM",
  title: "A voz dos trabalhadores SITIBEGAM não para!",
  description: "Receba notícias e atualizações direto no seu e-mail.",
  primaryButtonText: "Quero receber as novidades",
  primaryButtonHref: "/newsletter",
};

const defaultNavItems: NavItem[] = [
  { label: "INÍCIO", href: "/" },
  { label: "SINDICATO", href: "/sindicato" },
  { label: "JURÍDICO", href: "/juridico" },
  { label: "PUBLICAÇÕES", href: "/publicacoes" },
  { label: "SERVIÇOS", href: "/servicos" },
  { label: "NEWSLETTER", href: "/newsletter" },
  { label: "CONTATO", href: "/contato" },
];

export async function generateStaticParams() {
  try {
    const site = await getSiteData();
    if (!site) return [{ slug: 'placeholder' }];
    const posts = await getLatestPosts(site.id, 100);
    if (posts.length === 0) return [{ slug: 'placeholder' }];
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [{ slug: 'placeholder' }];
  }
}

export default async function PublicationPage({ params }: { params: Promise<{ slug: string }> }) {
  'use cache';
  cacheLife('days');
  cacheTag('publication-page');

  const { slug } = await params;

  const site = await getSiteData();
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  let navItems: NavItem[] = defaultNavItems;
  let footerContent: FooterContent | undefined;
  let relatedPosts: PayloadPost[] = [];
  let ctaContent: CTAContent = defaultCTAContent;
  let announcementContent: AnnouncementContent = defaultAnnouncementContent;
  let recentNewsItems: NewsItem[] = [];

  if (site) {
    navItems = getNavItems(site);
    footerContent = transformSiteToFooterContent(site);

    const allPosts = await getLatestPosts(site.id, 20);
    relatedPosts = allPosts.filter(p => p.slug !== slug).slice(0, 3);
    recentNewsItems = allPosts.filter(p => p.slug !== slug).slice(0, 5).map(transformPostToNewsItem);

    const ctaSections = await getCTASections(site.id, 'sindicato');
    if (ctaSections.length > 0) ctaContent = transformCTAToContent(ctaSections[0]);

    const announcements = await getAnnouncementCards(site.id, 'sindicato');
    if (announcements.length > 0) announcementContent = transformAnnouncementToContent(announcements[0]);
  }

  const imageUrl = getImageUrl(post.heroImage, 'large');
  const date = formatDate(post.publishedAt || post.createdAt);
  const category = getCategoryName(post);
  const contentHtml = lexicalToHtml(post.content);

  const tags: string[] = [];
  if (post.categories && post.categories.length > 0) {
    post.categories.forEach(cat => {
      if (typeof cat !== 'string' && typeof cat !== 'number') {
        tags.push((cat as PayloadCategory).title);
      }
    });
  }
  if (tags.length === 0) tags.push(category);

  const socialLinks = footerContent?.socialLinks || {};
  const latestNewsTitles = recentNewsItems.slice(0, 8).map(n => ({ title: n.title, href: n.link }));

  return (
    <div className="bg-white">
      <Header
        navItems={navItems}
        socialLinks={socialLinks}
        latestNewsTitles={latestNewsTitles}
        logo={site?.header?.logo}
        logoAlt={site?.header?.logoAlt}
      />

      {/* Breadcrumb */}
      <div className="bg-[#f2f2f2] border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <nav className="text-sm text-gray-500">
            <a href="/" className="hover:text-brand-600 transition">Home</a>
            <span className="mx-2">»</span>
            <a href="/publicacoes" className="hover:text-brand-600 transition">Publicações</a>
            <span className="mx-2">»</span>
            <span className="text-gray-700">{post.title.length > 60 ? post.title.slice(0, 60) + '…' : post.title}</span>
          </nav>
        </div>
      </div>

      {/* Main: col-8 article + col-4 sidebar */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">

          {/* Article - 2/3 */}
          <article className="lg:w-2/3">
            {/* Hero image */}
            <div className="overflow-hidden">
              <img
                src={imageUrl}
                alt={post.heroImage?.alt || post.title}
                className="w-full aspect-[702/336] object-cover"
              />
            </div>

            {/* Post header */}
            <header className="mt-6">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight md:text-3xl">
                {post.title}
              </h1>
            </header>

            {/* Post meta */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <time>{date}</time>
              <span className="text-gray-300">|</span>
              {tags.map(tag => (
                <span key={tag} className="bg-brand-600 text-white text-xs font-semibold px-2 py-0.5 uppercase">
                  {tag}
                </span>
              ))}
            </div>

            {/* Post content */}
            <div
              className="mt-8 prose prose-gray max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-brand-600 prose-img:rounded-lg prose-img:shadow-md prose-figure:my-6 [&_iframe]:w-full [&_iframe]:rounded-lg"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Share buttons */}
            <div className="mt-10 border-t border-gray-200 pt-6 flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Compartilhar:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`/publicacoes/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center size-9 bg-blue-800 text-white rounded hover:opacity-80 transition"
                aria-label="Facebook"
              >
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z"/></svg>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`/publicacoes/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center size-9 bg-sky-500 text-white rounded hover:opacity-80 transition"
                aria-label="Twitter"
              >
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' /publicacoes/' + slug)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center size-9 bg-green-500 text-white rounded hover:opacity-80 transition"
                aria-label="WhatsApp"
              >
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-10 border-t border-gray-200 pt-8">
                <div className="border-b-2 border-brand-600 mb-6">
                  <h2 className="text-lg font-bold uppercase text-gray-900 pb-2">Publicações Relacionadas</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {relatedPosts.map(p => (
                    <a key={p.slug} href={`/publicacoes/${p.slug}`} className="group block">
                      <img
                        src={getImageUrl(p.heroImage, 'medium')}
                        alt={p.heroImage?.alt || p.title}
                        className="w-full aspect-[214/140] object-cover transition group-hover:opacity-80"
                      />
                      <div className="mt-2">
                        <time className="text-xs text-gray-400">{formatDate(p.publishedAt || p.createdAt)}</time>
                        <h3 className="mt-0.5 text-sm font-semibold text-gray-900 leading-snug group-hover:text-brand-600 transition line-clamp-2">
                          {p.title}
                        </h3>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar - 1/3 */}
          <aside className="lg:w-1/3">
            <Sidebar
              ctaContent={ctaContent}
              announcementContent={announcementContent}
              recentPosts={recentNewsItems}
            />
          </aside>
        </div>
      </div>

      <Footer content={footerContent} navItems={navItems} contact={site?.contact} />
    </div>
  );
}
