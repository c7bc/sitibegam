import { cacheLife, cacheTag } from 'next/cache'
import Header from "@/components/header";
import FeaturedSection from "@/components/featured-section";
import NewsFocus from "@/components/news-focus";
import HighlightsBox from "@/components/highlights-box";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";

import {
  getSiteData,
  getLatestPosts,
  getCTASections,
  getAnnouncementCards,
} from "@/lib/api";

import {
  getNavItems,
  transformSiteToFooterContent,
  transformPostToNewsItem,
  transformCTAToContent,
  transformAnnouncementToContent,
} from "@/lib/utils";

import type {
  NewsItem,
  FooterContent,
  CTAContent,
  AnnouncementContent,
  NavItem,
} from "@/types/payload";

const defaultNavItems: NavItem[] = [
  { label: "INÍCIO", href: "/" },
  { label: "SINDICATO", href: "/sindicato" },
  { label: "JURÍDICO", href: "/juridico" },
  { label: "PUBLICAÇÕES", href: "/publicacoes" },
  { label: "SERVIÇOS", href: "/servicos" },
  { label: "NEWSLETTER", href: "/newsletter" },
  { label: "CONTATO", href: "/contato" },
];

const defaultCTAContent: CTAContent = {
  title: "Junte-se à luta pelos direitos dos trabalhadores SITIBEGAM",
  description: "Faça parte do maior SITIBEGAM. Garantimos representação forte, assistência jurídica completa e defesa dos seus direitos trabalhistas.",
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
  description: "Receba notícias, atualizações e conquistas da categoria direto no seu e-mail.",
  primaryButtonText: "Quero receber as novidades",
  primaryButtonHref: "/newsletter",
};

const mockRecentNews: NewsItem[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80",
    imageAlt: "Estúdio de rádio profissional",
    category: "Notícias",
    date: "3 de novembro de 2025",
    title: "Nova convenção coletiva garante aumento salarial de 8% para trabalhadores",
    link: "#",
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80",
    imageAlt: "Apresentador de TV",
    category: "Notícias",
    date: "1 de novembro de 2025",
    title: "Sindicato fecha acordo histórico com grandes emissoras de televisão",
    link: "#",
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    imageAlt: "Reunião sindical",
    category: "Direitos",
    date: "30 de outubro de 2025",
    title: "Justiça reconhece direito a insalubridade para trabalhadores noturnos",
    link: "#",
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    imageAlt: "Microfone de estúdio",
    category: "Notícias",
    date: "28 de outubro de 2025",
    title: "Sindicato promove curso gratuito de locução e apresentação",
    link: "#",
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
    imageAlt: "Evento sindical",
    category: "Eventos",
    date: "25 de outubro de 2025",
    title: "Assembleia geral aprova pauta de reivindicações para 2026",
    link: "#",
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&q=80",
    imageAlt: "Advogado trabalhista",
    category: "Direitos",
    date: "23 de outubro de 2025",
    title: "Atendimento jurídico gratuito beneficia mais de 200 associados em 2025",
    link: "#",
  },
];

export default async function Home() {
  'use cache'
  cacheLife('days')
  cacheTag('homepage', 'posts', 'sites', 'cta-sections', 'announcement-cards')

  const site = await getSiteData();

  let navItems: NavItem[] = defaultNavItems;
  let footerContent: FooterContent | undefined;
  let allNewsItems: NewsItem[] = mockRecentNews;
  let ctaContent: CTAContent = defaultCTAContent;
  let announcementContent: AnnouncementContent = defaultAnnouncementContent;

  if (site) {
    navItems = getNavItems(site);
    footerContent = transformSiteToFooterContent(site);

    const posts = await getLatestPosts(site.id, 50);
    if (posts.length > 0) {
      allNewsItems = posts.map(transformPostToNewsItem);
    }

    // Fetch CTA
    const ctaSections = await getCTASections(site.id, 'sindicato');
    if (ctaSections.length > 0) {
      ctaContent = transformCTAToContent(ctaSections[0]);
    }

    // Fetch Announcement
    const announcements = await getAnnouncementCards(site.id, 'sindicato');
    if (announcements.length > 0) {
      announcementContent = transformAnnouncementToContent(announcements[0]);
    }
  }

  // Featured section: first 5 for slider, next 3 for side blocks
  const sliderNews = allNewsItems.slice(0, 5);
  const sideNews = allNewsItems.slice(5, 8);

  const socialLinks = footerContent?.socialLinks || {};
  const latestNewsTitles = allNewsItems.slice(0, 10).map(n => ({ title: n.title, href: n.link }));

  // News by category for news-focus
  const mainCategoryNews: { [key: string]: NewsItem[] } = { all: allNewsItems.slice(0, 8) };

  // Highlights from categories
  const categoriesSet = new Set(allNewsItems.map(n => n.category));
  const newsByCategory: { [key: string]: NewsItem[] } = {};
  categoriesSet.forEach(cat => {
    newsByCategory[cat] = allNewsItems.filter(n => n.category === cat);
  });
  const highlightCategories = Object.entries(newsByCategory)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 9)
    .map(([catName, items]) => ({
      name: catName,
      href: `/publicacoes?categoria=${encodeURIComponent(catName)}`,
      featured: {
        id: items[0].id,
        imageUrl: items[0].imageUrl,
        imageAlt: items[0].imageAlt,
        date: items[0].date,
        title: items[0].title,
        link: items[0].link,
      },
      posts: items.slice(1, 4).map(item => ({ title: item.title, link: item.link })),
    }));

  return (
    <div className="bg-white">
      <Header
        navItems={navItems}
        socialLinks={socialLinks}
        latestNewsTitles={latestNewsTitles}
        logo={site?.header?.logo}
        logoAlt={site?.header?.logoAlt}
      />

      {/* Featured: Slider 2/3 + Side blocks 1/3 (full-width) */}
      <FeaturedSection sliderNews={sliderNews} sideNews={sideNews} />

      {/* Main content area: 2/3 + 1/3 sidebar */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Main content - 2/3 */}
          <div className="lg:w-2/3">
            <NewsFocus title="Notícias Gerais" news={mainCategoryNews} />
            {highlightCategories.length > 0 && (
              <HighlightsBox categories={highlightCategories} />
            )}
          </div>

          {/* Sidebar - 1/3 */}
          <aside className="lg:w-1/3">
            <Sidebar
              ctaContent={ctaContent}
              announcementContent={announcementContent}
              recentPosts={allNewsItems.slice(0, 5)}
            />
          </aside>
        </div>
      </div>

      <Footer content={footerContent} navItems={navItems} contact={site?.contact} />
    </div>
  );
}
