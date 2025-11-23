import { cacheLife, cacheTag } from 'next/cache'
import Header from "@/components/header";
import Hero from "@/components/hero";
import AnnouncementCard from "@/components/announcement-card";
import RecentNews from "@/components/recent-news";
import NewsByCategory from "@/components/news-by-category";
import CTASection from "@/components/cta-section";
import Footer from "@/components/footer";

import {
  getSiteData,
  getLatestPosts,
  getCTASections,
  getAnnouncementCards,
} from "@/lib/api";

import {
  getNavItems,
  transformSiteToHeroContent,
  transformSiteToFooterContent,
  transformPostToNewsItem,
  transformPostToCategoryNews,
  transformCTAToContent,
  transformAnnouncementToContent,
  getCategoryName,
} from "@/lib/utils";

import type {
  NewsItem,
  CategorizedContent,
  HeroContent,
  FooterContent,
  CTAContent,
  AnnouncementContent,
  NavItem,
} from "@/types/payload";

// Default fallback data
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
  title: "Junte-se à luta pelos direitos dos trabalhadores de bebidas",
  description: "Faça parte do SITIBEGAM. Garantimos representação forte, assistência jurídica completa e defesa dos seus direitos trabalhistas.",
  primaryButtonText: "Quero me sindicalizar",
  primaryButtonHref: "/sindicalize-se",
  secondaryButtonText: "Saiba mais",
  secondaryButtonHref: "/sindicato",
  imageUrl: "/category.jpg",
  imageAlt: "Trabalhadores da indústria de bebidas",
};

const defaultAnnouncementContent: AnnouncementContent = {
  imageUrl: "/cta.jpg",
  imageAlt: "Trabalhadores de bebidas",
  title: "A voz da categoria não para!",
  description: "Receba notícias, atualizações e conquistas da categoria direto no seu e-mail. Fique por dentro das ações do sindicato e fortaleça a luta por melhores condições de trabalho.",
  primaryButtonText: "Quero receber as novidades",
  primaryButtonHref: "/newsletter",
};

// Mock data for fallback when backend is unavailable
const mockRecentNews: NewsItem[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    imageAlt: "Trabalhadores da indústria de bebidas",
    category: "Conquistas",
    date: "3 de novembro de 2025",
    title: "Nova convenção coletiva garante aumento salarial de 8% para trabalhadores de bebidas",
    link: "#",
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=800&q=80",
    imageAlt: "Indústria de bebidas",
    category: "Direitos Trabalhistas",
    date: "1 de novembro de 2025",
    title: "SITIBEGAM fecha acordo histórico com empresas de bebidas em Belém",
    link: "#",
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    imageAlt: "Reunião sindical",
    category: "Direitos Trabalhistas",
    date: "30 de outubro de 2025",
    title: "Justiça reconhece direito a insalubridade para trabalhadores de bebidas",
    link: "#",
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
    imageAlt: "Capacitação de trabalhadores",
    category: "Capacitação",
    date: "28 de outubro de 2025",
    title: "SITIBEGAM promove curso gratuito de capacitação para trabalhadores de bebidas",
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
    category: "Direitos Trabalhistas",
    date: "23 de outubro de 2025",
    title: "Atendimento jurídico gratuito beneficia mais de 200 associados em 2025",
    link: "#",
  },
];

// Empty categorized content for fallback
const emptyNewsByCategory: CategorizedContent = {};

export default async function Home() {
  'use cache'
  cacheLife('days')
  cacheTag('homepage', 'posts', 'sites', 'cta-sections', 'announcement-cards')

  // Fetch site data
  const site = await getSiteData();

  // Prepare data with fallbacks
  let navItems: NavItem[] = defaultNavItems;
  let heroContent: HeroContent | undefined;
  let footerContent: FooterContent | undefined;
  let recentNews: NewsItem[] = mockRecentNews;
  let newsByCategory: CategorizedContent = emptyNewsByCategory;
  let ctaContent: CTAContent = defaultCTAContent;
  let announcementContent: AnnouncementContent = defaultAnnouncementContent;

  if (site) {
    // Transform site data
    navItems = getNavItems(site);
    heroContent = transformSiteToHeroContent(site);
    footerContent = transformSiteToFooterContent(site);

    // Fetch posts
    const posts = await getLatestPosts(site.id, 50);

    console.log('[Home] Posts fetched:', posts.length);
    console.log('[Home] Post categories:', posts.map(p => getCategoryName(p)));

    if (posts.length > 0) {
      // Transform all posts to news items (no filtering)
      const allNewsItems = posts.map(transformPostToNewsItem);
      console.log('[Home] All news items:', allNewsItems.map(n => ({ title: n.title, category: n.category })));

      // Use all posts for recent news (first 6)
      recentNews = allNewsItems.slice(0, 6);

      // Group posts by their actual categories
      const categoriesSet = new Set(posts.map(p => getCategoryName(p)));
      const newsCategorized: CategorizedContent = {};

      categoriesSet.forEach(cat => {
        newsCategorized[cat] = posts
          .filter(post => getCategoryName(post) === cat)
          .slice(0, 6)
          .map(transformPostToCategoryNews);
      });

      if (Object.keys(newsCategorized).length > 0) {
        newsByCategory = newsCategorized;
      }
    }

    // Fetch CTA sections
    // NOTE: Using 'sindicato' temporarily - create CTAs with page='home' in admin for proper behavior
    const ctaSections = await getCTASections(site.id, 'sindicato');
    if (ctaSections.length > 0) {
      ctaContent = transformCTAToContent(ctaSections[0]);
    }

    // Fetch announcement cards
    // NOTE: Using 'sindicato' temporarily - create Announcements with page='home' in admin for proper behavior
    const announcements = await getAnnouncementCards(site.id, 'sindicato');
    if (announcements.length > 0) {
      announcementContent = transformAnnouncementToContent(announcements[0]);
    }
  }

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl">
        <Header navItems={navItems} />
        <Hero content={heroContent} />
        <RecentNews news={recentNews} />
        <NewsByCategory categories={newsByCategory} />
        <CTASection
          title={ctaContent.title}
          titleMobile={ctaContent.titleMobile}
          description={ctaContent.description}
          descriptionMobile={ctaContent.descriptionMobile}
          primaryButtonText={ctaContent.primaryButtonText}
          primaryButtonHref={ctaContent.primaryButtonHref}
          secondaryButtonText={ctaContent.secondaryButtonText}
          secondaryButtonHref={ctaContent.secondaryButtonHref}
          imageUrl={ctaContent.imageUrl}
          imageAlt={ctaContent.imageAlt}
        />
        <AnnouncementCard
          imageUrl={announcementContent.imageUrl}
          imageAlt={announcementContent.imageAlt}
          title={announcementContent.title}
          description={announcementContent.description}
          primaryButtonText={announcementContent.primaryButtonText}
          primaryButtonHref={announcementContent.primaryButtonHref}
        />
      </main>
      <Footer content={footerContent} />
    </div>
  );
}
