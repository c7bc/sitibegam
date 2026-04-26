import { cacheLife, cacheTag } from 'next/cache';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Breadcrumb from '@/components/breadcrumb';
import PageTitle from '@/components/page-title';
import BenefitsV2 from '@/components/benefits-v2';
import FacilitiesV2 from '@/components/facilities-v2';
import Sidebar from '@/components/sidebar';

import {
  getSiteData,
  getServicosPageData,
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
  PayloadServicosBenefitCategory,
  PayloadServicosFacility,
  PayloadServicosFeature,
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
  title: 'Ainda não é sindicalizado?',
  description: 'Faça sua sindicalização e tenha acesso a todos os benefícios exclusivos.',
  primaryButtonText: 'Sindicalizar-se',
  primaryButtonHref: '/sindicalize-se',
  secondaryButtonText: 'Saiba mais',
  secondaryButtonHref: '/sindicato',
  imageUrl: '/cta.jpg',
  imageAlt: 'Sindicalização',
};

const defaultAnnouncementContent: AnnouncementContent = {
  imageUrl: '/hero.jpeg',
  imageAlt: 'Novos convênios',
  title: 'Novos convênios disponíveis',
  description: 'Confira os estabelecimentos parceiros do sindicato.',
  primaryButtonText: 'Ver convênios',
  primaryButtonHref: '/publicacoes',
};

export default async function ServicosPage() {
  'use cache';
  cacheLife('days');
  cacheTag('servicos-page');

  const site = await getSiteData();

  let navItems: NavItem[] = defaultNavItems;
  let footerContent: FooterContent | undefined;
  let ctaContent: CTAContent = defaultCTAContent;
  let announcementContent: AnnouncementContent = defaultAnnouncementContent;
  let recentNewsItems: NewsItem[] = [];
  let heroBadge = '';
  let heroTitle = '';
  let heroDescription = '';
  let heroFeatures: PayloadServicosFeature[] = [];
  let benefitsTitle = '';
  let benefitsSubtitle = '';
  let benefitsCategories: PayloadServicosBenefitCategory[] = [];
  let facilities: PayloadServicosFacility[] = [];

  if (site) {
    navItems = getNavItems(site);
    footerContent = transformSiteToFooterContent(site);

    const servicosPage = await getServicosPageData(site.id);
    if (servicosPage) {
      heroBadge = servicosPage.hero?.badge || '';
      heroTitle = servicosPage.hero?.title || '';
      heroDescription = servicosPage.hero?.description || '';
      heroFeatures = servicosPage.hero?.features || [];
      benefitsTitle = servicosPage.benefits?.title || '';
      benefitsSubtitle = servicosPage.benefits?.subtitle || '';
      benefitsCategories = servicosPage.benefits?.categories || [];
      facilities = servicosPage.facilities || [];
    }

    const posts = await getLatestPosts(site.id, 10);
    recentNewsItems = posts.map(transformPostToNewsItem);

    const ctaSections = await getCTASections(site.id, 'servicos');
    if (ctaSections.length > 0) {
      ctaContent = transformCTAToContent(ctaSections[0]);
    } else {
      const fallback = await getCTASections(site.id, 'sindicato');
      if (fallback.length > 0) ctaContent = transformCTAToContent(fallback[0]);
    }

    const announcements = await getAnnouncementCards(site.id, 'servicos');
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

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Serviços' }]} />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="lg:w-2/3">
            <PageTitle
              title={heroTitle || 'Serviços'}
              description={heroDescription || 'Conheça os benefícios, convênios e instalações disponíveis aos associados.'}
            />

            {heroBadge && (
              <div className="mb-6 inline-block bg-brand-600/10 text-brand-600 text-xs font-semibold px-3 py-1 uppercase">
                {heroBadge}
              </div>
            )}

            {/* Features em grid */}
            {heroFeatures.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {heroFeatures.map((feature) => (
                  <div key={feature.id} className="border border-gray-200 p-4 flex gap-3 items-start">
                    <div className="shrink-0 flex items-center justify-center size-10 bg-brand-600 text-white rounded">
                      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {benefitsCategories.length > 0 && (
              <BenefitsV2
                title={benefitsTitle || 'Benefícios e Convênios'}
                subtitle={benefitsSubtitle}
                categories={benefitsCategories}
              />
            )}

            {facilities.length > 0 && (
              <FacilitiesV2 facilities={facilities} />
            )}

            {heroFeatures.length === 0 && benefitsCategories.length === 0 && facilities.length === 0 && (
              <div className="border border-gray-200 p-6 text-center text-sm text-gray-500">
                Os serviços e benefícios serão disponibilizados em breve.
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
