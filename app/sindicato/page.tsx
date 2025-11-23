import { cacheLife, cacheTag } from 'next/cache';
import { Suspense } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import LocationsSection from '@/components/locations-section';
import TeamSection from '@/components/team-section';
import ContentShowcase from '@/components/content-showcase';
import CTASection from '@/components/cta-section';
import AnnouncementCard from '@/components/announcement-card';
import MapPinIcon from '@/components/icons/map-pin';
import BuildingIcon from '@/components/icons/building';
import OfficeIcon from '@/components/icons/office';

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
  getImageUrl,
} from '@/lib/utils';

import { lexicalToText } from '@/lib/lexical-to-html';

import type {
  NavItem,
  FooterContent,
  CTAContent,
  AnnouncementContent,
  PayloadLocation,
  PayloadTeamMember,
} from '@/types/payload';

// Default CTA content
const defaultCTAContent: CTAContent = {
  title: "Faça parte da luta dos trabalhadores de bebidas",
  description: "Sindicalizar-se é fortalecer a categoria e garantir seus direitos. Junte-se a nós e tenha acesso a benefícios exclusivos.",
  primaryButtonText: "Quero me sindicalizar",
  primaryButtonHref: "/sindicalize-se",
  secondaryButtonText: "Saiba mais",
  secondaryButtonHref: "/servicos",
  imageUrl: "/category.jpg",
  imageAlt: "Trabalhadores da indústria de bebidas",
};

// Default Announcement content
const defaultAnnouncementContent: AnnouncementContent = {
  imageUrl: "/cta.jpg",
  imageAlt: "Newsletter",
  title: "Receba nossas atualizações",
  description: "Cadastre-se para receber notícias, eventos e informações importantes diretamente no seu e-mail.",
  primaryButtonText: "Quero receber",
  primaryButtonHref: "/newsletter",
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
    case 'building':
      return <BuildingIcon />;
    case 'office':
      return <OfficeIcon />;
    case 'map-pin':
    default:
      return <MapPinIcon />;
  }
}

// Helper to extract src from iframe tag
function extractMapSrc(iframeHtml: string): string {
  const match = iframeHtml.match(/src="([^"]+)"/);
  return match ? match[1] : '';
}

// Transform location from API to component format
function transformLocation(location: PayloadLocation) {
  // Extract text from Lexical address
  const addressText = lexicalToText(location.address);

  return {
    id: location.id,
    icon: getIconComponent(location.icon),
    title: location.title,
    description: location.description,
    address: addressText || location.title,
    mapUrl: location.mapUrl,
  };
}

// Transform team member from API to component format
function transformTeamMember(member: PayloadTeamMember) {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    imageUrl: getImageUrl(member.image, 'square'),
    imageAlt: member.imageAlt || `${member.name} - ${member.role}`,
  };
}

// Cached content component
async function SindicatoContent() {
  'use cache';
  cacheLife('days');
  cacheTag('sindicato-page-content');

  // Fetch site data
  const site = await getSiteData();

  if (!site) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <p className="text-tertiary">Erro ao carregar dados do sindicato.</p>
      </main>
    );
  }

  // Fetch sindicato page data
  const sindicatoPage = await getSindicatoPageData(site.id);

  // Fetch posts for content showcase
  const posts = await getLatestPosts(site.id, 3);
  const newsItems = posts.map(transformPostToNewsItem);

  // Fetch CTA sections
  let ctaContent: CTAContent = defaultCTAContent;
  const ctaSections = await getCTASections(site.id, 'sindicato');
  if (ctaSections.length > 0) {
    ctaContent = transformCTAToContent(ctaSections[0]);
  }

  // Fetch announcement cards
  let announcementContent: AnnouncementContent = defaultAnnouncementContent;
  const announcements = await getAnnouncementCards(site.id, 'sindicato');
  if (announcements.length > 0) {
    announcementContent = transformAnnouncementToContent(announcements[0]);
  }

  // Transform locations
  const locations = sindicatoPage?.locationsSection?.locations?.map(transformLocation) || [];

  // Extract map embed URL from iframe
  const mapEmbedUrl = sindicatoPage?.locationsSection?.mapEmbedUrl
    ? extractMapSrc(sindicatoPage.locationsSection.mapEmbedUrl)
    : '';

  return (
    <main className="flex-1">
      {/* Locations Section */}
      {sindicatoPage?.locationsSection && (
        <LocationsSection
          badge={sindicatoPage.locationsSection.badge}
          title={sindicatoPage.locationsSection.title}
          description={sindicatoPage.locationsSection.description}
          mapEmbedUrl={mapEmbedUrl}
          locations={locations}
        />
      )}

      {/* Team Sections - Dynamic */}
      {sindicatoPage?.teamSections?.map((section) => (
        <TeamSection
          key={section.id}
          badge={section.badge}
          title={section.title}
          description={section.description}
          members={section.members.map(transformTeamMember)}
        />
      ))}

      {/* Content Showcase */}
      {newsItems.length > 0 && (
        <ContentShowcase
          title="Publicações do Sindicato"
          description="Fique por dentro das últimas notícias e informações sobre o sindicato."
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
          buttonText="Ver todas as publicações"
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
export default async function SindicatoPage() {
  'use cache';
  cacheLife('days');
  cacheTag('sindicato-page');

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
        <SindicatoContent />
      </Suspense>
      <Footer content={footerContent} />
    </div>
  );
}
