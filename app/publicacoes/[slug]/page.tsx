import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import TableOfContentsClient from '@/components/publication-detail/table-of-contents-client';
import RelatedPublications from '@/components/publication-detail/related-publications';
import CTASection from '@/components/cta-section';
import AnnouncementCard from '@/components/announcement-card';

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
  PayloadPost,
  PayloadCategory,
} from '@/types/payload';

// Default CTA content
const defaultCTAContent: CTAContent = {
  title: "Junte-se à luta pelos direitos dos trabalhadores de bebidas",
  description: "Faça parte do SITIBEGAM.",
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
  description: "Receba notícias e atualizações direto no seu e-mail.",
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

// Cached content component
async function PublicationContent({ slug }: { slug: string }) {
  'use cache';
  cacheLife('days');
  cacheTag('publications', `publication-${slug}`);

  // Fetch post data
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch site data for related posts, CTA, and announcement
  const site = await getSiteData();

  // Fetch related posts (latest posts excluding current)
  let relatedPosts: PayloadPost[] = [];
  let ctaContent: CTAContent = defaultCTAContent;
  let announcementContent: AnnouncementContent = defaultAnnouncementContent;

  if (site) {
    const allPosts = await getLatestPosts(site.id, 6);
    relatedPosts = allPosts.filter(p => p.slug !== slug).slice(0, 4);

    // Fetch CTA sections
    const ctaSections = await getCTASections(site.id, 'sindicato');
    if (ctaSections.length > 0) {
      ctaContent = transformCTAToContent(ctaSections[0]);
    }

    // Fetch announcement cards
    const announcements = await getAnnouncementCards(site.id, 'sindicato');
    if (announcements.length > 0) {
      announcementContent = transformAnnouncementToContent(announcements[0]);
    }
  }

  // Transform post data
  const imageUrl = getImageUrl(post.heroImage, 'large');
  const date = formatDate(post.publishedAt || post.createdAt);
  const category = getCategoryName(post);

  // Get all category names as tags
  const tags: string[] = [];
  if (post.categories && post.categories.length > 0) {
    post.categories.forEach(cat => {
      if (typeof cat !== 'string' && typeof cat !== 'number') {
        tags.push((cat as PayloadCategory).title);
      }
    });
  }
  if (tags.length === 0) {
    tags.push(category);
  }

  // Convert Lexical content to HTML
  const contentHtml = lexicalToHtml(post.content);

  // Get description from meta or generate from content
  const description = post.meta?.description || '';

  // Transform related posts
  const relatedPubs = relatedPosts.map(p => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.meta?.description || '',
    category: getCategoryName(p),
    date: formatDate(p.publishedAt || p.createdAt),
    image: getImageUrl(p.heroImage, 'medium'),
  }));

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex w-full flex-col items-center">
            {/* Metadata */}
            <div className="flex w-full flex-col items-center text-center">
              <span className="text-sm font-semibold text-secondary md:text-md">
                Publicado em {date}
              </span>
              <h1 className="mt-3 text-display-md font-semibold text-primary md:text-display-lg">
                {post.title}
              </h1>
              {description && (
                <p className="mt-4 text-lg text-tertiary md:mt-6 md:text-xl">
                  {description}
                </p>
              )}
            </div>

            {/* Category Tags */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex bg-utility-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 ring-1 ring-inset ring-utility-brand-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <img
            className="mt-8 h-60 w-full rounded object-cover md:mt-12 md:h-120"
            src={imageUrl}
            alt={post.heroImage?.alt || post.title}
          />
        </div>
      </section>

      {/* Article Content */}
      <section className="bg-primary py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          {/* Main Content - Client Wrapper for TOC */}
          <TableOfContentsClient
            content={contentHtml}
            slug={slug}
            title={post.title}
          />
        </div>
      </section>

      {/* Related Publications */}
      {relatedPubs.length > 0 && (
        <RelatedPublications publications={relatedPubs} />
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

// Generate static params - fetch from API
export async function generateStaticParams() {
  try {
    const site = await getSiteData();

    if (!site) {
      // Return placeholder when API is not available during build
      return [{ slug: 'placeholder' }];
    }

    const posts = await getLatestPosts(site.id, 100);

    if (posts.length === 0) {
      return [{ slug: 'placeholder' }];
    }

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch {
    // Return placeholder when API is not available during build
    return [{ slug: 'placeholder' }];
  }
}

// Main page component
export default async function PublicationPage({ params }: { params: Promise<{ slug: string }> }) {
  'use cache';
  cacheLife('days');
  cacheTag('publication-page');

  const { slug } = await params;

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
            <p className="mt-4 text-tertiary">Carregando publicação...</p>
          </div>
        </main>
      }>
        <PublicationContent slug={slug} />
      </Suspense>
      <Footer content={footerContent} />
    </div>
  );
}
