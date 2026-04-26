import { cacheLife, cacheTag } from 'next/cache';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Breadcrumb from '@/components/breadcrumb';
import PageTitle from '@/components/page-title';
import ContactFormV2 from '@/components/contact-form-v2';
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
  description: 'Não fique sozinho na defesa dos seus direitos. O Sindicato oferece assessoria jurídica completa e gratuita para todos os associados.',
  primaryButtonText: 'Agendar atendimento',
  primaryButtonHref: '/juridico',
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

export default async function ContatoPage() {
  'use cache';
  cacheLife('days');
  cacheTag('contato-page');

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

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contato' }]} />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Main - 2/3 */}
          <div className="lg:w-2/3">
            <PageTitle
              title="Contato"
              description="Envie sua mensagem ou use os canais abaixo para falar conosco."
            />

            <ContactFormV2 siteId={siteId} />

            {/* Contact info cards */}
            {site?.contact && (
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {site.contact.phone && (
                  <div className="border border-gray-200 p-4 text-center">
                    <div className="mx-auto mb-2 flex items-center justify-center size-10 bg-brand-600 text-white rounded">
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h3 className="text-xs font-bold uppercase text-gray-600">Telefone</h3>
                    <p className="text-sm text-gray-900 mt-1">{site.contact.phone}</p>
                  </div>
                )}
                {site.contact.email && (
                  <div className="border border-gray-200 p-4 text-center">
                    <div className="mx-auto mb-2 flex items-center justify-center size-10 bg-brand-600 text-white rounded">
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xs font-bold uppercase text-gray-600">E-mail</h3>
                    <a href={`mailto:${site.contact.email}`} className="text-sm text-gray-900 mt-1 block hover:text-brand-600 transition break-all">{site.contact.email}</a>
                  </div>
                )}
                {site.contact.address && (
                  <div className="border border-gray-200 p-4 text-center">
                    <div className="mx-auto mb-2 flex items-center justify-center size-10 bg-brand-600 text-white rounded">
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xs font-bold uppercase text-gray-600">Endereço</h3>
                    <p className="text-sm text-gray-900 mt-1">{site.contact.address}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - 1/3 */}
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
