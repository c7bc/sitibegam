import { cacheLife, cacheTag } from 'next/cache';
import { Suspense } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import HeroWithFeaturesSection from '@/components/hero-with-features-section';
import BenefitsTabSection from '@/components/benefits-tab-section';
import FacilitiesSection from '@/components/facilities-section';
import ContentShowcase from '@/components/content-showcase';
import CTASection from '@/components/cta-section';
import AnnouncementCard from '@/components/announcement-card';

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
  getImageUrl,
} from '@/lib/utils';

import type {
  NavItem,
  FooterContent,
  CTAContent,
  AnnouncementContent,
  PayloadServicosFacility,
  PayloadServicosFeature,
} from '@/types/payload';

// Import icons for features
import ShieldCheckIcon from '@/components/icons/shield-check';
import UsersIcon from '@/components/icons/users';
import HeartIcon from '@/components/icons/heart';
import StarIcon from '@/components/icons/star';

// Helper to get icon component from string
function getFeatureIcon(iconName: string): React.ReactNode {
  switch (iconName) {
    case 'shield-check':
      return <ShieldCheckIcon />;
    case 'users':
      return <UsersIcon />;
    case 'heart':
      return <HeartIcon />;
    case 'star':
      return <StarIcon />;
    default:
      return <StarIcon />;
  }
}

// Transform feature from API to component format
function transformFeature(feature: PayloadServicosFeature) {
  return {
    id: feature.id,
    icon: getFeatureIcon(feature.icon),
    title: feature.title,
    description: feature.description,
  };
}

// Default CTA content
const defaultCTAContent: CTAContent = {
  title: "Ainda não é sindicalizado?",
  description: "Faça sua sindicalização agora e tenha acesso a todos esses benefícios exclusivos. É rápido, fácil e você começa a aproveitar imediatamente.",
  primaryButtonText: "Sindicalizar-se",
  primaryButtonHref: "/sindicalize-se",
  secondaryButtonText: "Saiba mais",
  secondaryButtonHref: "/sindicato",
  imageUrl: "/cta.jpg",
  imageAlt: "Sindicalização",
};

// Default Announcement content
const defaultAnnouncementContent: AnnouncementContent = {
  imageUrl: "/hero.jpeg",
  imageAlt: "Novos convênios",
  title: "Atenção: Novos convênios disponíveis",
  description: "Confira os novos estabelecimentos parceiros que acabaram de firmar convênio com o Sindicato. Mais vantagens para você!",
  primaryButtonText: "Ver convênios",
  primaryButtonHref: "/publicacoes",
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

// Transform facility from API to component format
function transformFacility(facility: PayloadServicosFacility) {
  return {
    badge: facility.badge,
    title: facility.title,
    description: facility.description || '',
    imageUrl: getImageUrl(facility.image, 'large'),
    imageAlt: facility.imageAlt || facility.title,
    priceTable: facility.priceTable?.map(item => ({
      description: item.description,
      price: item.price,
    })) || [],
    generalInfo: facility.generalInfo?.map(item => item.info) || [],
    contactInfo: facility.contactInfo ? {
      hours: facility.contactInfo.hours,
      email: facility.contactInfo.email,
      phone: facility.contactInfo.phone,
    } : undefined,
    regulations: facility.regulations?.map(item => item.rule) || [],
  };
}

// Cached content component
async function ServicosContent() {
  'use cache';
  cacheLife('days');
  cacheTag('servicos-page-content');

  // Fetch site data
  const site = await getSiteData();

  if (!site) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <p className="text-tertiary">Erro ao carregar dados dos serviços.</p>
      </main>
    );
  }

  // Fetch servicos page data
  const servicosPage = await getServicosPageData(site.id);

  // Fetch posts for content showcase
  const posts = await getLatestPosts(site.id, 3);
  const newsItems = posts.map(transformPostToNewsItem);

  // Fetch CTA sections - fallback to sindicato if not found for servicos
  let ctaContent: CTAContent = defaultCTAContent;
  let ctaSections = await getCTASections(site.id, 'servicos');
  if (ctaSections.length === 0) {
    ctaSections = await getCTASections(site.id, 'sindicato');
  }
  if (ctaSections.length > 0) {
    ctaContent = transformCTAToContent(ctaSections[0]);
  }

  // Fetch announcement cards - fallback to sindicato if not found for servicos
  let announcementContent: AnnouncementContent = defaultAnnouncementContent;
  let announcements = await getAnnouncementCards(site.id, 'servicos');
  if (announcements.length === 0) {
    announcements = await getAnnouncementCards(site.id, 'sindicato');
  }
  if (announcements.length > 0) {
    announcementContent = transformAnnouncementToContent(announcements[0]);
  }

  // Transform hero features
  const heroFeatures = servicosPage?.hero?.features?.map(transformFeature) || [];

  // Transform benefits categories
  const benefitCategories = servicosPage?.benefits?.categories?.map(category => ({
    id: category.id,
    name: category.name,
    benefits: category.benefits.map(benefit => ({
      id: benefit.id,
      name: benefit.name,
      discount: benefit.discount,
      address: benefit.address,
      phone: benefit.phone,
      hours: benefit.hours,
      observations: benefit.observations,
    })),
  })) || [];

  // Transform facilities
  const facilities = servicosPage?.facilities?.map(transformFacility) || [];

  return (
    <main className="flex-1">
      {/* Hero Section with Features */}
      <HeroWithFeaturesSection
        badge={servicosPage?.hero?.badge || "Vantagens Exclusivas"}
        title={servicosPage?.hero?.title || "Serviços e Benefícios para Radialistas"}
        description={servicosPage?.hero?.description || "O Sindicato dos Radialistas oferece uma ampla gama de serviços e convênios exclusivos para sindicalizados."}
        features={heroFeatures}
        imageUrl={getImageUrl(servicosPage?.hero?.image, 'large')}
        imageAlt={servicosPage?.hero?.imageAlt || "Serviços para Radialistas"}
      />

      {/* Benefits Tabs */}
      {benefitCategories.length > 0 && (
        <BenefitsTabSection
          badge={servicosPage?.benefits?.badge || "Convênios"}
          title={servicosPage?.benefits?.title || "Benefícios e Descontos"}
          subtitle={servicosPage?.benefits?.subtitle || "Descontos exclusivos em estabelecimentos parceiros para você e sua família"}
          categories={benefitCategories}
        />
      )}

      {/* Facilities */}
      {facilities.map((facility, index) => (
        <FacilitiesSection
          key={index}
          badge={facility.badge}
          title={facility.title}
          description={facility.description}
          imageUrl={facility.imageUrl}
          imageAlt={facility.imageAlt}
          priceTable={facility.priceTable}
          generalInfo={facility.generalInfo}
          contactInfo={facility.contactInfo}
          regulations={facility.regulations}
        />
      ))}

      {/* Content Showcase */}
      {newsItems.length > 0 && (
        <ContentShowcase
          title="Novidades e Informações"
          description="Fique por dentro das últimas novidades sobre benefícios e serviços disponíveis para sindicalizados."
          buttonText="Ver todas as publicações"
          buttonHref="/publicacoes"
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
export default async function ServicosPage() {
  'use cache';
  cacheLife('days');
  cacheTag('servicos-page');

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
            <p className="mt-4 text-tertiary">Carregando serviços...</p>
          </div>
        </main>
      }>
        <ServicosContent />
      </Suspense>
      <Footer content={footerContent} />
    </div>
  );
}
