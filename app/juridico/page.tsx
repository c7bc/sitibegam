import { cacheLife, cacheTag } from 'next/cache';
import { Suspense } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ContactInfoSection from '@/components/contact-info-section';
import TabsSection from '@/components/tabs-section';
import ContentShowcase from '@/components/content-showcase';
import CTASection from '@/components/cta-section';
import AnnouncementCard from '@/components/announcement-card';
import MailIcon from '@/components/icons/mail';
import PhoneIcon from '@/components/icons/phone';
import MapPinIcon from '@/components/icons/map-pin';

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

import { lexicalToHtml } from '@/lib/lexical-to-html';

import type {
  NavItem,
  FooterContent,
  CTAContent,
  AnnouncementContent,
  PayloadJuridicoContact,
} from '@/types/payload';

// Default CTA content
const defaultCTAContent: CTAContent = {
  title: "Precisa de assessoria jurídica?",
  description: "Não fique sozinho na defesa dos seus direitos. O Sindicato oferece assessoria jurídica completa e gratuita para todos os associados.",
  primaryButtonText: "Agendar atendimento",
  primaryButtonHref: "/contato",
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

// Helper to get icon component from string
function getIconComponent(icon: string): React.ReactNode {
  switch (icon) {
    case 'mail':
      return <MailIcon />;
    case 'phone':
      return <PhoneIcon />;
    case 'map-pin':
    default:
      return <MapPinIcon />;
  }
}

// Transform contact from API to component format
function transformContact(contact: PayloadJuridicoContact) {
  return {
    id: contact.id,
    icon: getIconComponent(contact.icon),
    title: contact.title,
    description: contact.description,
    linkText: contact.linkText,
    linkHref: contact.linkHref,
  };
}

// Cached content component
async function JuridicoContent() {
  'use cache';
  cacheLife('days');
  cacheTag('juridico-page-content');

  // Fetch site data
  const site = await getSiteData();

  if (!site) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <p className="text-tertiary">Erro ao carregar dados do jurídico.</p>
      </main>
    );
  }

  // Fetch juridico page data
  const juridicoPage = await getJuridicoPageData(site.id);

  // Fetch posts for content showcase
  const posts = await getLatestPosts(site.id, 3);
  const newsItems = posts.map(transformPostToNewsItem);

  // Fetch CTA sections
  let ctaContent: CTAContent = defaultCTAContent;
  const ctaSections = await getCTASections(site.id, 'juridico');
  if (ctaSections.length > 0) {
    ctaContent = transformCTAToContent(ctaSections[0]);
  }

  // Fetch announcement cards
  let announcementContent: AnnouncementContent = defaultAnnouncementContent;
  const announcements = await getAnnouncementCards(site.id, 'juridico');
  if (announcements.length > 0) {
    announcementContent = transformAnnouncementToContent(announcements[0]);
  }

  // Transform contacts
  const contacts = juridicoPage?.contactInfo?.contacts?.map(transformContact) || [];

  // Transform tabs with Lexical content to HTML
  const tabs = juridicoPage?.tabs?.map(tab => ({
    id: tab.id,
    label: tab.label,
    badge: tab.badge,
    content: (
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: lexicalToHtml(tab.content) }}
      />
    ),
  })) || [];

  return (
    <main className="flex-1">
      {/* Contact Info Section */}
      {juridicoPage?.contactInfo && (
        <ContactInfoSection
          badge={juridicoPage.contactInfo.badge}
          title={juridicoPage.contactInfo.title}
          description={juridicoPage.contactInfo.description}
          contacts={contacts}
        />
      )}

      {/* Tabs Section */}
      {tabs.length > 0 && (
        <TabsSection
          tabs={tabs}
          defaultTab={tabs[0]?.id}
        />
      )}

      {/* Content Showcase */}
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
          buttonHref="/publicacoes"
        />
      )}

      {/* CTA Section */}
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

      {/* Announcement Card */}
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
export default async function JuridicoPage() {
  'use cache';
  cacheLife('days');
  cacheTag('juridico-page');

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
        <JuridicoContent />
      </Suspense>
      <Footer content={footerContent} />
    </div>
  );
}
