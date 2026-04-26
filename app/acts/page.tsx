import { cacheLife, cacheTag } from 'next/cache';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Breadcrumb from '@/components/breadcrumb';
import PageTitle from '@/components/page-title';
import ActsCctsList from '@/components/acts-ccts-list';
import Sidebar from '@/components/sidebar';

import {
  getSiteData,
  getLatestPosts,
  getCTASections,
  getAnnouncementCards,
  getActsCcts,
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
  PayloadActCct,
} from '@/types/payload';

const defaultNavItems: NavItem[] = [
  { label: 'INÍCIO', href: '/' },
  { label: 'SINDICATO', href: '/sindicato' },
  { label: 'JURÍDICO', href: '/juridico' },
  { label: 'PUBLICAÇÕES', href: '/publicacoes' },
  { label: 'ACTS', href: '/acts' },
  { label: 'CCTS', href: '/ccts' },
  { label: 'SERVIÇOS', href: '/servicos' },
  { label: 'NEWSLETTER', href: '/newsletter' },
  { label: 'CONTATO', href: '/contato' },
];

const defaultCTAContent: CTAContent = {
  title: 'Junte-se à luta pelos direitos dos trabalhadores SITIBEGAM',
  description: 'Faça parte do maior SITIBEGAM.',
  primaryButtonText: 'Saiba Mais',
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

export default async function ActsPage() {
  'use cache';
  cacheLife('days');
  cacheTag('acts-page', 'acts-ccts');

  const site = await getSiteData();

  let navItems: NavItem[] = defaultNavItems;
  let footerContent: FooterContent | undefined;
  let ctaContent: CTAContent = defaultCTAContent;
  let announcementContent: AnnouncementContent = defaultAnnouncementContent;
  let recentNewsItems: NewsItem[] = [];
  let acts: PayloadActCct[] = [];

  if (site) {
    navItems = getNavItems(site);
    footerContent = transformSiteToFooterContent(site);

    acts = await getActsCcts(site.id, 'ACT');

    const posts = await getLatestPosts(site.id, 10);
    recentNewsItems = posts.map(transformPostToNewsItem);

    const ctaSections = await getCTASections(site.id, 'sindicato');
    if (ctaSections.length > 0) ctaContent = transformCTAToContent(ctaSections[0]);

    const announcements = await getAnnouncementCards(site.id, 'sindicato');
    if (announcements.length > 0) announcementContent = transformAnnouncementToContent(announcements[0]);
  }

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

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'ACTs' }]} />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="lg:w-2/3">
            <PageTitle
              title="Acordos Coletivos de Trabalho (ACTs)"
              description="Acordos celebrados entre o sindicato e empresas/veículos específicos."
            />

            <ActsCctsList
              items={acts}
              emptyMessage="Nenhum acordo coletivo publicado ainda."
            />
          </div>

          <aside className="lg:w-1/3">
            <Sidebar
              ctaContent={ctaContent}
              announcementContent={announcementContent}
              recentPosts={recentNewsItems.slice(0, 5)}
            />
          </aside>
        </div>
      </div>

      <Footer content={footerContent} navItems={navItems} contact={site?.contact} />
    </div>
  );
}
