import { cacheLife, cacheTag } from 'next/cache';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Breadcrumb from '@/components/breadcrumb';
import PageTitle from '@/components/page-title';
import ContactInfoV2 from '@/components/contact-info-v2';
import TabsV2 from '@/components/tabs-v2';
import Sidebar from '@/components/sidebar';

import {
  getSiteData,
  getJuridicoPageData,
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
  title: 'Precisa de assessoria jurídica?',
  description: 'O Sindicato oferece assessoria jurídica completa e gratuita para todos os associados.',
  primaryButtonText: 'Agendar atendimento',
  primaryButtonHref: '/contato',
  secondaryButtonText: 'Sindicalize-se',
  secondaryButtonHref: '/sindicalize-se',
  imageUrl: '/category.jpg',
  imageAlt: 'Assessoria jurídica',
};

const defaultAnnouncementContent: AnnouncementContent = {
  imageUrl: '/cta.jpg',
  imageAlt: 'Atualize seus dados',
  title: 'Atualize seus dados',
  description: 'Mantenha seus dados atualizados para receber notificações importantes.',
  primaryButtonText: 'Atualizar cadastro',
  primaryButtonHref: '/contato',
};

export default async function JuridicoPage() {
  'use cache';
  cacheLife('days');
  cacheTag('juridico-page');

  const site = await getSiteData();

  let navItems: NavItem[] = defaultNavItems;
  let footerContent: FooterContent | undefined;
  let ctaContent: CTAContent = defaultCTAContent;
  let announcementContent: AnnouncementContent = defaultAnnouncementContent;
  let recentNewsItems: NewsItem[] = [];
  let contacts: import('@/types/payload').PayloadJuridicoContact[] = [];
  let tabs: import('@/types/payload').PayloadJuridicoTab[] = [];
  let contactInfoTitle = '';
  let contactInfoDescription = '';

  if (site) {
    navItems = getNavItems(site);
    footerContent = transformSiteToFooterContent(site);

    const juridicoPage = await getJuridicoPageData(site.id);
    if (juridicoPage) {
      contacts = juridicoPage.contactInfo?.contacts || [];
      tabs = juridicoPage.tabs || [];
      contactInfoTitle = juridicoPage.contactInfo?.title || '';
      contactInfoDescription = juridicoPage.contactInfo?.description || '';
    }

    const posts = await getLatestPosts(site.id, 10);
    recentNewsItems = posts.map(transformPostToNewsItem);

    const ctaSections = await getCTASections(site.id, 'juridico');
    if (ctaSections.length > 0) {
      ctaContent = transformCTAToContent(ctaSections[0]);
    } else {
      const fallback = await getCTASections(site.id, 'sindicato');
      if (fallback.length > 0) ctaContent = transformCTAToContent(fallback[0]);
    }

    const announcements = await getAnnouncementCards(site.id, 'juridico');
    if (announcements.length > 0) {
      announcementContent = transformAnnouncementToContent(announcements[0]);
    } else {
      const fallback = await getAnnouncementCards(site.id, 'sindicato');
      if (fallback.length > 0) announcementContent = transformAnnouncementToContent(fallback[0]);
    }
  }

  const socialLinks = footerContent?.socialLinks || {};
  const latestNewsTitles = recentNewsItems.slice(0, 8).map(n => ({ title: n.title, href: n.link }));

  return (
    <div className="bg-white">
      <Header navItems={navItems} socialLinks={socialLinks} latestNewsTitles={latestNewsTitles}
        logo={site?.header?.logo}
        logoAlt={site?.header?.logoAlt} />

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Jurídico' }]} />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="lg:w-2/3">
            <PageTitle
              title="Jurídico"
              description="Assessoria jurídica completa e gratuita para os associados do sindicato."
            />

            {contacts.length > 0 && (
              <ContactInfoV2
                title={contactInfoTitle || 'Canais de Atendimento'}
                description={contactInfoDescription}
                contacts={contacts}
              />
            )}

            {tabs.length > 0 && (
              <TabsV2 tabs={tabs} title="Serviços Jurídicos" />
            )}

            {contacts.length === 0 && tabs.length === 0 && (
              <div className="border border-gray-200 p-6 text-center text-sm text-gray-500">
                O conteúdo da página jurídica será disponibilizado em breve.
              </div>
            )}
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
