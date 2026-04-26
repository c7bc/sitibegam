import { cacheLife, cacheTag } from 'next/cache';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Breadcrumb from '@/components/breadcrumb';
import PageTitle from '@/components/page-title';
import PublicationsGridV2 from '@/components/publications-grid-v2';
import Sidebar from '@/components/sidebar';

import {
  getSiteData,
  getLatestPosts,
  getCTASections,
  getAnnouncementCards,
} from '@/lib/api';

import {
  getNavItems,
  transformSiteToFooterContent,
  transformCTAToContent,
  transformAnnouncementToContent,
  transformPostToNewsItem,
} from '@/lib/utils';

import type {
  NavItem,
  FooterContent,
  CTAContent,
  AnnouncementContent,
  NewsItem,
} from '@/types/payload';

const defaultNavItems: NavItem[] = [
  { label: 'INÍCIO', href: '/' },
  { label: 'SINDICATO', href: '/sindicato' },
  { label: 'JURÍDICO', href: '/juridico' },
  { label: 'PUBLICAÇÕES', href: '/publicacoes' },
  { label: 'SERVIÇOS', href: '/servicos' },
  { label: 'NEWSLETTER', href: '/newsletter' },
  { label: 'CONTATO', href: '/contato' },
];

// Todos os posts são considerados notícias (exceto os que têm categorias específicas de Artigo/Revista/Cartilha)
const NEWS_EXCLUDED_CATEGORIES = ['Artigo', 'Revista', 'Cartilha'];

export default async function NoticiasPage() {
  'use cache';
  cacheLife('days');
  cacheTag('noticias-page', 'posts');

  const site = await getSiteData();

  let navItems: NavItem[] = defaultNavItems;
  let footerContent: FooterContent | undefined;
  let ctaContent: CTAContent | undefined;
  let announcementContent: AnnouncementContent | undefined;
  let newsItems: NewsItem[] = [];

  if (site) {
    navItems = getNavItems(site);
    footerContent = transformSiteToFooterContent(site);

    const posts = await getLatestPosts(site.id, 100);
    newsItems = posts
      .map(transformPostToNewsItem)
      .filter(n => !NEWS_EXCLUDED_CATEGORIES.includes(n.category));

    const ctaSections = await getCTASections(site.id, 'sindicato');
    if (ctaSections.length > 0) ctaContent = transformCTAToContent(ctaSections[0]);

    const announcements = await getAnnouncementCards(site.id, 'sindicato');
    if (announcements.length > 0) announcementContent = transformAnnouncementToContent(announcements[0]);
  }

  const socialLinks = footerContent?.socialLinks || {};
  const latestNewsTitles = newsItems.slice(0, 8).map(n => ({ title: n.title, href: n.link }));
  const categoriesList = Array.from(new Set(newsItems.map(n => n.category))).filter(Boolean);

  return (
    <div className="bg-white">
      <Header navItems={navItems} socialLinks={socialLinks} latestNewsTitles={latestNewsTitles}
        logo={site?.header?.logo}
        logoAlt={site?.header?.logoAlt} />

      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Publicações', href: '/publicacoes' },
        { label: 'Notícias' },
      ]} />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="lg:w-2/3">
            <PageTitle
              title="Notícias"
              description="Últimas notícias, coberturas e informações da categoria."
            />

            <PublicationsGridV2
              publications={newsItems}
              categories={categoriesList}
              itemsPerPage={8}
            />
          </div>

          <aside className="lg:w-1/3">
            <Sidebar
              ctaContent={ctaContent}
              announcementContent={announcementContent}
              recentPosts={newsItems.slice(0, 5)}
            />
          </aside>
        </div>
      </div>

      <Footer content={footerContent} navItems={navItems} contact={site?.contact} />
    </div>
  );
}
