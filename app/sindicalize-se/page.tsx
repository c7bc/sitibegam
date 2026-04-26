import { cacheLife, cacheTag } from 'next/cache';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Breadcrumb from '@/components/breadcrumb';
import PageTitle from '@/components/page-title';
import SindicalizacaoFormV2 from '@/components/sindicalizacao-form-v2';
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
  title: 'Precisa de assessoria jurídica?',
  description: 'O Sindicato oferece assessoria jurídica completa e gratuita para todos os associados.',
  primaryButtonText: 'Agendar atendimento',
  primaryButtonHref: '/juridico',
  secondaryButtonText: 'Saiba mais',
  secondaryButtonHref: '/sindicato',
  imageUrl: '/category.jpg',
  imageAlt: 'Assessoria jurídica',
};

const defaultAnnouncementContent: AnnouncementContent = {
  imageUrl: '/cta.jpg',
  imageAlt: 'Atualize seus dados',
  title: 'Atualize seus dados',
  description: 'Mantenha seus dados sempre atualizados.',
  primaryButtonText: 'Atualizar cadastro',
  primaryButtonHref: '/contato',
};

export default async function SindicalizeSePage() {
  'use cache';
  cacheLife('days');
  cacheTag('sindicalize-se-page');

  const site = await getSiteData();

  let navItems: NavItem[] = defaultNavItems;
  let footerContent: FooterContent | undefined;
  let ctaContent: CTAContent = defaultCTAContent;
  let announcementContent: AnnouncementContent = defaultAnnouncementContent;
  let recentNewsItems: NewsItem[] = [];
  let siteId = '1';

  if (site) {
    navItems = getNavItems(site);
    footerContent = transformSiteToFooterContent(site);
    siteId = String(site.id);

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

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Sindicalize-se' }]} />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="lg:w-2/3">
            <PageTitle
              title="Sindicalize-se"
              description="Fortaleça a voz dos trabalhadores SITIBEGAM. Preencha o formulário abaixo para se juntar ao sindicato."
            />

            <div className="mb-6 border-l-4 border-brand-600 bg-brand-50/50 p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                Ao se sindicalizar, você passa a contar com assessoria jurídica gratuita, acesso a
                convênios, participação em assembleias e deliberações da categoria, representação
                em negociações coletivas e muito mais.
              </p>
            </div>

            <SindicalizacaoFormV2 siteId={siteId} />
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
