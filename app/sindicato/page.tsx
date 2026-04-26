import { cacheLife, cacheTag } from 'next/cache';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Breadcrumb from '@/components/breadcrumb';
import PageTitle from '@/components/page-title';
import LocationsV2 from '@/components/locations-v2';
import TeamV2 from '@/components/team-v2';
import Sidebar from '@/components/sidebar';

import {
  getSiteData,
  getSindicatoPageData,
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
  PayloadLocation,
  PayloadTeamSection,
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
  title: 'Faça parte da luta dos trabalhadores SITIBEGAM',
  description: 'Sindicalizar-se é fortalecer a categoria e garantir seus direitos.',
  primaryButtonText: 'Quero me sindicalizar',
  primaryButtonHref: '/sindicalize-se',
  secondaryButtonText: 'Saiba mais',
  secondaryButtonHref: '/servicos',
  imageUrl: '/category.jpg',
  imageAlt: 'Trabalhador SITIBEGAM',
};

const defaultAnnouncementContent: AnnouncementContent = {
  imageUrl: '/cta.jpg',
  imageAlt: 'Newsletter',
  title: 'Receba nossas atualizações',
  description: 'Cadastre-se para receber notícias e informações importantes.',
  primaryButtonText: 'Quero receber',
  primaryButtonHref: '/newsletter',
};

export default async function SindicatoPage() {
  'use cache';
  cacheLife('days');
  cacheTag('sindicato-page');

  const site = await getSiteData();

  let navItems: NavItem[] = defaultNavItems;
  let footerContent: FooterContent | undefined;
  let ctaContent: CTAContent = defaultCTAContent;
  let announcementContent: AnnouncementContent = defaultAnnouncementContent;
  let recentNewsItems: NewsItem[] = [];
  let locations: PayloadLocation[] = [];
  let teamSections: PayloadTeamSection[] = [];
  let locationsTitle = '';
  let locationsDescription = '';
  let locationsMapEmbed = '';

  if (site) {
    navItems = getNavItems(site);
    footerContent = transformSiteToFooterContent(site);

    const sindicatoPage = await getSindicatoPageData(site.id);
    if (sindicatoPage) {
      locations = sindicatoPage.locationsSection?.locations || [];
      teamSections = sindicatoPage.teamSections || [];
      locationsTitle = sindicatoPage.locationsSection?.title || '';
      locationsDescription = sindicatoPage.locationsSection?.description || '';
      locationsMapEmbed = sindicatoPage.locationsSection?.mapEmbedUrl || '';
    }

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
      <Header navItems={navItems} socialLinks={socialLinks} latestNewsTitles={latestNewsTitles}
        logo={site?.header?.logo}
        logoAlt={site?.header?.logoAlt} />

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Sindicato' }]} />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="lg:w-2/3">
            <PageTitle
              title="O Sindicato"
              description="Conheça as sedes, a diretoria e os responsáveis pela representação da categoria."
            />

            {locations.length > 0 && (
              <LocationsV2
                title={locationsTitle || 'Sedes e Localização'}
                description={locationsDescription}
                mapEmbedUrl={locationsMapEmbed}
                locations={locations}
              />
            )}

            {teamSections.length > 0 && (
              <TeamV2 sections={teamSections} />
            )}

            {locations.length === 0 && teamSections.length === 0 && (
              <div className="border border-gray-200 p-6 text-center text-sm text-gray-500">
                O conteúdo institucional do sindicato será disponibilizado em breve.
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
