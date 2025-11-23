import { cacheLife, cacheTag } from 'next/cache';
import { Suspense } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ContactForm from '@/components/contact-form';
import ContentShowcase from '@/components/content-showcase';
import CTASection from '@/components/cta-section';
import AnnouncementCard from '@/components/announcement-card';

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
} from '@/types/payload';

// Default nav items fallback
const defaultNavItems: NavItem[] = [
  { label: "INÍCIO", href: "/" },
  { label: "SINDICATO", href: "/sindicato" },
  { label: "JURÍDICO", href: "/juridico" },
  { label: "PUBLICAÇÕES", href: "/publicacoes" },
  { label: "SERVIÇOS", href: "/servicos" },
  { label: "NEWSLETTER", href: "/newsletter" },
  { label: "CONTATO", href: "/contato" },
];

// Default CTA content
const defaultCTAContent: CTAContent = {
  title: "Precisa de assessoria jurídica?",
  description: "Não fique sozinho na defesa dos seus direitos. O Sindicato oferece assessoria jurídica completa e gratuita para todos os associados.",
  primaryButtonText: "Agendar atendimento",
  primaryButtonHref: "/juridico",
  secondaryButtonText: "Sindicalize-se",
  secondaryButtonHref: "/sindicalize-se",
  imageUrl: "/category.jpg",
  imageAlt: "Assessoria jurídica",
};

// Default Announcement content
const defaultAnnouncementContent: AnnouncementContent = {
  imageUrl: "/cta.jpg",
  imageAlt: "Atendimento jurídico",
  title: "Atualize seus dados",
  description: "Mantenha seus dados atualizados para receber notificações sobre ações coletivas e outras informações jurídicas importantes.",
  primaryButtonText: "Atualizar cadastro",
  primaryButtonHref: "/contato",
};

// Cached content component
async function ContatoContent() {
  'use cache';
  cacheLife('days');
  cacheTag('contato-page-content');

  // Fetch site data
  const site = await getSiteData();

  if (!site) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <p className="text-tertiary">Erro ao carregar dados.</p>
      </main>
    );
  }

  // Fetch posts for content showcase
  const posts = await getLatestPosts(site.id, 3);
  const newsItems = posts.map(transformPostToNewsItem);

  // Fetch CTA sections from sindicato
  let ctaContent: CTAContent = defaultCTAContent;
  const ctaSections = await getCTASections(site.id, 'sindicato');
  if (ctaSections.length > 0) {
    ctaContent = transformCTAToContent(ctaSections[0]);
  }

  // Fetch announcement cards from sindicato
  let announcementContent: AnnouncementContent = defaultAnnouncementContent;
  const announcements = await getAnnouncementCards(site.id, 'sindicato');
  if (announcements.length > 0) {
    announcementContent = transformAnnouncementToContent(announcements[0]);
  }

  // Get contact info from site
  const contactInfo = {
    phone: site.contact?.phone,
    email: site.contact?.email,
    address: site.contact?.address,
  };

  return (
    <main className="flex-1">
      <ContactForm contactInfo={contactInfo} siteId={String(site.id)} />

      {/* ContentShowcase */}
      {newsItems.length > 0 && (
        <ContentShowcase
          title="Orientações Jurídicas"
          description="Fique por dentro das últimas orientações e informações jurídicas para a categoria."
          items={newsItems.map(item => ({
            id: String(item.id),
            imageUrl: item.imageUrl,
            imageAlt: item.imageAlt,
            category: item.category,
            date: item.date,
            title: item.title,
            description: '',
            link: item.link,
          }))}
          buttonText="Ver todas as orientações"
          buttonHref="/juridico"
        />
      )}

      {/* CTASection */}
      <CTASection
        title={ctaContent.title}
        titleMobile={ctaContent.titleMobile}
        description={ctaContent.description}
        descriptionMobile={ctaContent.descriptionMobile}
        primaryButtonText={ctaContent.primaryButtonText}
        primaryButtonHref={ctaContent.primaryButtonHref}
        secondaryButtonText={ctaContent.secondaryButtonText}
        secondaryButtonHref={ctaContent.secondaryButtonHref}
        imageUrl={ctaContent.imageUrl}
        imageAlt={ctaContent.imageAlt}
      />

      {/* AnnouncementCard */}
      <AnnouncementCard
        imageUrl={announcementContent.imageUrl}
        imageAlt={announcementContent.imageAlt}
        title={announcementContent.title}
        description={announcementContent.description}
        primaryButtonText={announcementContent.primaryButtonText}
        primaryButtonHref={announcementContent.primaryButtonHref}
      />
    </main>
  );
}

// Main page component
export default async function ContatoPage() {
  'use cache';
  cacheLife('days');
  cacheTag('contato-page');

  // Fetch site data for header/footer
  const site = await getSiteData();

  let navItems: NavItem[] = defaultNavItems;
  let footerContent: FooterContent | undefined;

  if (site) {
    navItems = getNavItems(site);
    footerContent = transformSiteToFooterContent(site);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header navItems={navItems} />
      <Suspense fallback={
        <main className="flex-1 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-600 border-r-transparent"></div>
            <p className="mt-4 text-tertiary">Carregando...</p>
          </div>
        </main>
      }>
        <ContatoContent />
      </Suspense>
      <Footer content={footerContent} />
    </div>
  );
}
