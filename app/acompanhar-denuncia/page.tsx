import { cacheLife, cacheTag } from 'next/cache';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Breadcrumb from '@/components/breadcrumb';
import PageTitle from '@/components/page-title';
import AcompanharForm from '@/components/acompanhar-form';
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
  { label: 'ACTS', href: '/acts' },
  { label: 'CCTS', href: '/ccts' },
  { label: 'DENÚNCIA', href: '/canal-de-denuncias' },
  { label: 'SERVIÇOS', href: '/servicos' },
  { label: 'NEWSLETTER', href: '/newsletter' },
  { label: 'CONTATO', href: '/contato' },
];

export default async function AcompanharDenunciaPage() {
  'use cache';
  cacheLife('days');
  cacheTag('acompanhar-denuncia-page');

  const site = await getSiteData();

  let navItems: NavItem[] = defaultNavItems;
  let footerContent: FooterContent | undefined;
  let ctaContent: CTAContent | undefined;
  let announcementContent: AnnouncementContent | undefined;
  let recentNewsItems: NewsItem[] = [];

  if (site) {
    navItems = getNavItems(site);
    footerContent = transformSiteToFooterContent(site);

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

      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Canal de Denúncias', href: '/canal-de-denuncias' },
        { label: 'Acompanhar' },
      ]} />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="lg:w-2/3">
            <PageTitle
              title="Acompanhar denúncia"
              description="Consulte o andamento da sua denúncia usando o número de protocolo."
            />

            <div className="mb-6 text-sm text-gray-700 leading-relaxed">
              <p>
                Digite abaixo o protocolo que você recebeu ao enviar sua denúncia. Por questão
                de sigilo, exibimos apenas o status atual — nenhum dado pessoal ou conteúdo da
                denúncia é mostrado aqui.
              </p>
            </div>

            <AcompanharForm />

            <div className="mt-8 border border-gray-200 p-4 bg-[#f2f2f2]">
              <p className="text-xs text-gray-600 leading-relaxed">
                Ainda não registrou uma denúncia?{' '}
                <a href="/canal-de-denuncias" className="text-brand-600 font-medium hover:underline">
                  Clique aqui para acessar o canal de denúncias
                </a>.
              </p>
            </div>
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
