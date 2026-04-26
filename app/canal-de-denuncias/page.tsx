import { cacheLife, cacheTag } from 'next/cache';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Breadcrumb from '@/components/breadcrumb';
import PageTitle from '@/components/page-title';
import DenunciaForm from '@/components/denuncia-form';
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

export default async function CanalDenunciasPage() {
  'use cache';
  cacheLife('days');
  cacheTag('canal-denuncias-page');

  const site = await getSiteData();

  let navItems: NavItem[] = defaultNavItems;
  let footerContent: FooterContent | undefined;
  let ctaContent: CTAContent | undefined;
  let announcementContent: AnnouncementContent | undefined;
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
      <Header
        navItems={navItems}
        socialLinks={socialLinks}
        latestNewsTitles={latestNewsTitles}
        logo={site?.header?.logo}
        logoAlt={site?.header?.logoAlt}
      />

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Canal de Denúncias' }]} />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="lg:w-2/3">
            <PageTitle
              title="Canal de Denúncias"
              description="Um espaço seguro para denunciar assédio, discriminação e irregularidades. Sua voz importa."
            />

            {/* Intro */}
            <div className="mb-6 text-sm text-gray-700 leading-relaxed space-y-3">
              <p>
                O SITIBEGAM disponibiliza este canal para que trabalhadores
                e profissionais da categoria possam registrar denúncias de forma segura e sigilosa.
                Todas as denúncias são recebidas pela nossa equipe jurídica e analisadas com
                absoluto zelo pela confidencialidade.
              </p>
              <p>
                Você pode optar por fazer uma denúncia <strong>anônima</strong> (nenhum dado
                pessoal é coletado) ou <strong>identificada</strong> (usamos seus dados apenas
                para retorno referente ao caso).
              </p>
              <p>
                Ao enviar, você receberá um <strong>número de protocolo</strong>. Guarde-o para
                consultar o andamento em{' '}
                <a href="/acompanhar-denuncia" className="text-brand-600 font-medium hover:underline">
                  Acompanhar denúncia
                </a>.
              </p>
            </div>

            {/* Categorias — blocos informativos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <div className="border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Assédio moral</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Humilhações, intimidações, constrangimentos repetidos no ambiente de trabalho.
                </p>
              </div>
              <div className="border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Assédio sexual</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Qualquer conduta de natureza sexual não desejada que cause constrangimento.
                </p>
              </div>
              <div className="border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Discriminação</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Tratamento desigual por raça, gênero, orientação, religião, deficiência etc.
                </p>
              </div>
              <div className="border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Irregularidade trabalhista</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Descumprimento de leis, CCTs, ACTs, horas extras não pagas, jornada irregular.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="border-b-2 border-brand-600 mb-4">
              <h2 className="text-lg font-semibold uppercase text-gray-700 tracking-wide pb-2">
                Registrar denúncia
              </h2>
            </div>

            <DenunciaForm siteId={siteId} />
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
