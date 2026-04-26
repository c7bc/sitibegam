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

const defaultCTAContent: CTAContent = {
  title: 'Junte-se à luta pelos direitos dos trabalhadores SITIBEGAM',
  description: 'Faça parte do maior SITIBEGAM.',
  primaryButtonText: 'Quero me sindicalizar',
  primaryButtonHref: '/sindicalize-se',
  secondaryButtonText: 'Saiba mais',
  secondaryButtonHref: '/sindicato',
  imageUrl: '/category.jpg',
  imageAlt: 'Trabalhador SITIBEGAM',
};

const defaultAnnouncementContent: AnnouncementContent = {
  imageUrl: '/cta.jpg',
  imageAlt: 'A voz dos trabalhadores SITIBEGAM',
  title: 'A voz dos trabalhadores SITIBEGAM não para!',
  description: 'Receba notícias direto no seu e-mail.',
  primaryButtonText: 'Quero receber',
  primaryButtonHref: '/newsletter',
};

export default async function PublicacoesPage() {
  'use cache';
  cacheLife('days');
  cacheTag('publicacoes-page', 'posts');

  const site = await getSiteData();

  let navItems: NavItem[] = defaultNavItems;
  let footerContent: FooterContent | undefined;
  let ctaContent: CTAContent = defaultCTAContent;
  let announcementContent: AnnouncementContent = defaultAnnouncementContent;
  let allNewsItems: NewsItem[] = [];

  if (site) {
    navItems = getNavItems(site);
    footerContent = transformSiteToFooterContent(site);

    const posts = await getLatestPosts(site.id, 100);
    allNewsItems = posts.map(transformPostToNewsItem);

    const ctaSections = await getCTASections(site.id, 'sindicato');
    if (ctaSections.length > 0) ctaContent = transformCTAToContent(ctaSections[0]);

    const announcements = await getAnnouncementCards(site.id, 'sindicato');
    if (announcements.length > 0) announcementContent = transformAnnouncementToContent(announcements[0]);
  }

  const socialLinks = footerContent?.socialLinks || {};
  const latestNewsTitles = allNewsItems.slice(0, 8).map(n => ({ title: n.title, href: n.link }));
  const categoriesList = Array.from(new Set(allNewsItems.map(n => n.category))).filter(Boolean);

  return (
    <div className="bg-white">
      <Header navItems={navItems} socialLinks={socialLinks} latestNewsTitles={latestNewsTitles}
        logo={site?.header?.logo}
        logoAlt={site?.header?.logoAlt} />

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Publicações' }]} />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="lg:w-2/3">
            <PageTitle
              title="Publicações"
              description="Notícias, artigos, revistas e cartilhas publicadas pelo sindicato."
            />

            <PublicationsGridV2
              publications={allNewsItems}
              categories={categoriesList}
              itemsPerPage={8}
              showSearch={true}
              showFilters={true}
            />
          </div>

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
