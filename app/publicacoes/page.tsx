import { cacheLife, cacheTag } from 'next/cache';
import { Suspense } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PublicationsHero from '@/components/publications-hero';
import FeaturedPost from '@/components/featured-post';
import PublicationsGrid from '@/components/publications-grid';
import CTASection from '@/components/cta-section';
import AnnouncementCard from '@/components/announcement-card';

import {
  getSiteData,
  getLatestPosts,
  getCategories,
} from '@/lib/api';

import {
  getNavItems,
  transformSiteToFooterContent,
  getImageUrl,
  formatDate,
  getCategoryName,
} from '@/lib/utils';

import type {
  NavItem,
  FooterContent,
  CTAContent,
  AnnouncementContent,
  PayloadPost,
} from '@/types/payload';

// Default CTA content
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

// Default Announcement content
const defaultAnnouncementContent: AnnouncementContent = {
  imageUrl: "/cta.jpg",
  imageAlt: "Trabalhadores de bebidas",
  title: "A voz da categoria não para!",
  description: "Receba notícias, atualizações e conquistas da categoria direto no seu e-mail. Fique por dentro das ações do sindicato e fortaleça a luta por melhores condições de trabalho.",
  primaryButtonText: "Quero receber as novidades",
  primaryButtonHref: "/newsletter",
};

// Default nav items fallback
const defaultNavItems: NavItem[] = [
  { label: "INÍCIO", href: "/" },
  { label: "SINDICATO", href: "/sindicato" },
  { label: "JURÍDICO", href: "/juridico" },
  { label: "PUBLICAÇÕES", href: "/publicacoes" },
  { label: "SERVIÇOS", href: "/servicos" },
  { label: "NEWSLETTER", href: "/newsletter" },
  { label: "CONTATO", href: "/contato" },
];

// Transform post to featured item format
function transformPostToFeaturedItem(post: PayloadPost) {
  return {
    imageUrl: getImageUrl(post.heroImage, 'large'),
    imageAlt: post.heroImage?.alt || post.title,
    category: getCategoryName(post),
    title: post.title,
    description: post.meta?.description || '',
    date: formatDate(post.publishedAt || post.createdAt),
    link: `/publicacoes/${post.slug}`,
  };
}

// Transform post to publication grid item format
function transformPostToGridItem(post: PayloadPost) {
  return {
    id: String(post.id),
    imageUrl: getImageUrl(post.heroImage, 'medium'),
    imageAlt: post.heroImage?.alt || post.title,
    category: getCategoryName(post),
    title: post.title,
    date: formatDate(post.publishedAt || post.createdAt),
    link: `/publicacoes/${post.slug}`,
  };
}

// Cached content component
async function PublicacoesContent() {
  'use cache';
  cacheLife('days');
  cacheTag('publicacoes-page-content');

  // Fetch site data
  const site = await getSiteData();

  if (!site) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <p className="text-tertiary">Erro ao carregar publicações.</p>
      </main>
    );
  }

  // Fetch all posts and categories
  const [posts, apiCategories] = await Promise.all([
    getLatestPosts(site.id, 100),
    getCategories(),
  ]);

  // Split posts: first 3 for featured, rest for grid
  const featuredPosts = posts.slice(0, 3);
  const allPosts = posts;

  // Transform posts
  const featuredItems = featuredPosts.map(transformPostToFeaturedItem);
  const gridItems = allPosts.map(transformPostToGridItem);

  // Transform categories for PublicationsGrid
  const categories = [
    { id: 'all', label: 'Ver todas' },
    ...apiCategories.map(cat => ({
      id: cat.slug,
      label: cat.title,
    })),
  ];

  // Use default CTA and Announcement for publicacoes page
  const ctaContent: CTAContent = defaultCTAContent;
  const announcementContent: AnnouncementContent = defaultAnnouncementContent;

  return (
    <main className="flex-1">
      {/* Hero and Featured Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-12 md:mb-16">
            <PublicationsHero
              badge="Publicações"
              title="Fique por dentro de tudo que acontece no SITIBEGAM"
              description="Notícias, artigos, revistas e cartilhas sobre a categoria dos trabalhadores de bebidas."
            />
          </div>
          {featuredItems.length > 0 && (
            <FeaturedPost items={featuredItems} />
          )}
        </div>
      </section>

      {/* Publications Grid */}
      {gridItems.length > 0 && (
        <PublicationsGrid
          publications={gridItems}
          categories={categories}
        />
      )}

      {/* CTA Section */}
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

      {/* Announcement Card */}
      <AnnouncementCard
        imageUrl={announcementContent.imageUrl}
        imageAlt={announcementContent.imageAlt}
        title={announcementContent.title}
        description={announcementContent.description}
        primaryButtonText={announcementContent.primaryButtonText}
        primaryButtonHref={announcementContent.primaryButtonHref}
      />
    </main>
  );
}

// Main page component
export default async function PublicacoesPage() {
  'use cache';
  cacheLife('days');
  cacheTag('publicacoes-page');

  // Fetch site data for header/footer
  const site = await getSiteData();

  let navItems: NavItem[] = defaultNavItems;
  let footerContent: FooterContent | undefined;

  if (site) {
    navItems = getNavItems(site);
    footerContent = transformSiteToFooterContent(site);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header navItems={navItems} />
      <Suspense fallback={
        <main className="flex-1 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-600 border-r-transparent"></div>
            <p className="mt-4 text-tertiary">Carregando publicações...</p>
          </div>
        </main>
      }>
        <PublicacoesContent />
      </Suspense>
      <Footer content={footerContent} />
    </div>
  );
}
