import { cacheLife, cacheTag } from 'next/cache';
import { Suspense } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PublicationsHero from '@/components/publications-hero';
import FormSection from '@/components/form-section';
import CTASection from '@/components/cta-section';
import AnnouncementCard from '@/components/announcement-card';

import {
  getSiteData,
  getCTASections,
  getAnnouncementCards,
} from '@/lib/api';

import {
  getNavItems,
  transformSiteToFooterContent,
  transformCTAToContent,
  transformAnnouncementToContent,
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
  title: "Junte-se à luta pelos direitos dos trabalhadores de bebidas",
  description: "Faça parte do SITIBEGAM. Garantimos representação forte, assistência jurídica completa e defesa dos seus direitos trabalhistas.",
  primaryButtonText: "Quero me sindicalizar",
  primaryButtonHref: "/sindicalize-se",
  secondaryButtonText: "Saiba mais",
  secondaryButtonHref: "/sindicato",
  imageUrl: "/category.jpg",
  imageAlt: "Trabalhadores da indústria de bebidas",
};

// Default Announcement content
const defaultAnnouncementContent: AnnouncementContent = {
  imageUrl: "/cta.jpg",
  imageAlt: "Trabalhadores de bebidas",
  title: "A voz da categoria não para!",
  description: "Receba notícias, atualizações e conquistas da categoria direto no seu e-mail. Fique por dentro das ações do sindicato e fortaleça a luta por melhores condições de trabalho.",
  primaryButtonText: "Quero receber as novidades",
  primaryButtonHref: "/newsletter",
};

const newsletterFields = [
  {
    id: "nome",
    name: "nome",
    type: "text" as const,
    label: "Nome completo",
    placeholder: "Digite seu nome completo",
    required: true,
  },
  {
    id: "email",
    name: "email",
    type: "email" as const,
    label: "E-mail",
    placeholder: "seu@email.com",
    required: true,
  },
  {
    id: "celular",
    name: "celular",
    type: "tel" as const,
    label: "Celular",
    placeholder: "(00) 00000-0000",
    required: false,
  },
];

// Cached content component
async function NewsletterContent() {
  'use cache';
  cacheLife('days');
  cacheTag('newsletter-page-content');

  // Fetch site data
  const site = await getSiteData();

  if (!site) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <p className="text-tertiary">Erro ao carregar dados.</p>
      </main>
    );
  }

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

  return (
    <main className="flex-1">
      <section className="bg-primary py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <PublicationsHero
            badge="Newsletter"
            title="Receba nossas novidades por e-mail"
            description="Inscreva-se na newsletter do SITIBEGAM e fique por dentro das principais notícias, eventos e conquistas da categoria."
          />
        </div>
      </section>

      <FormSection
        title="Cadastre-se na nossa newsletter"
        description="Preencha o formulário abaixo para receber periodicamente informações sobre o sindicato, direitos trabalhistas, eventos e muito mais."
        fields={newsletterFields}
        checkboxLabel="Aceito receber comunicações do SITIBEGAM por e-mail e outros canais digitais."
        checkboxRequired={true}
        submitButtonText="Assinar newsletter"
        siteId={String(site.id)}
        apiEndpoint="/api/newsletter-submissions"
        successMessage="Inscrição realizada com sucesso!"
      />

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
export default async function NewsletterPage() {
  'use cache';
  cacheLife('days');
  cacheTag('newsletter-page');

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
        <NewsletterContent />
      </Suspense>
      <Footer content={footerContent} />
    </div>
  );
}
