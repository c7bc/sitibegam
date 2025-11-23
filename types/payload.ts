// Types for PayloadCMS Backend Integration

// Media type from PayloadCMS
export interface PayloadMedia {
  id: string | number
  alt?: string
  url: string
  filename: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
  sizes: {
    thumbnail?: { url: string; width: number; height: number }
    square?: { url: string; width: number; height: number }
    small?: { url: string; width: number; height: number }
    medium?: { url: string; width: number; height: number }
    large?: { url: string; width: number; height: number }
    xlarge?: { url: string; width: number; height: number }
    og?: { url: string; width: number; height: number }
  }
  createdAt: string
  updatedAt: string
}

// Category type
export interface PayloadCategory {
  id: string | number
  title: string
  slug: string
  parent?: PayloadCategory | string
  breadcrumbs?: Array<{
    id: string
    label: string
    url: string
  }>
  createdAt: string
  updatedAt: string
}

// Post type from PayloadCMS
export interface PayloadPost {
  id: string | number
  title: string
  slug: string
  heroImage?: PayloadMedia
  content: unknown // Lexical Rich Text
  sites: PayloadSite[] | string[] | number[]
  categories?: PayloadCategory[] | string[] | number[]
  publishedAt?: string
  authors?: Array<{ id: string | number; name: string }>
  populatedAuthors?: Array<{
    id: string | number
    name: string
  }>
  meta: {
    title?: string
    description?: string
    image?: PayloadMedia
  }
  _status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

// Site type from PayloadCMS
export interface PayloadSite {
  id: string | number
  name: string
  url: string
  slug: string
  webhookUrl?: string
  webhookSecret?: string

  contact: {
    phone?: string
    email?: string
    address?: string
    whatsapp?: string
    workingHours?: string
  }

  header: {
    logo?: PayloadMedia
    logoAlt?: string
    navItems?: Array<{
      label: string
      href: string
    }>
  }

  footer: {
    logo?: PayloadMedia
    description?: string
    socialLinks: {
      facebook?: string
      instagram?: string
      twitter?: string
      youtube?: string
    }
  }

  hero: {
    badge?: string
    badgeText?: string
    title?: string
    description?: string
    image?: PayloadMedia
    imageAlt?: string
    primaryButtonText?: string
    primaryButtonHref?: string
    secondaryButtonText?: string
    secondaryButtonHref?: string
  }

  createdAt: string
  updatedAt: string
}

// CTA Section type
export interface PayloadCTASection {
  id: string | number
  page: 'sindicato' | 'juridico' | 'servicos' | 'home'
  title: string
  description?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
  image?: PayloadMedia
  imageAlt?: string
  site: PayloadSite | string
  createdAt: string
  updatedAt: string
}

// Announcement Card type
export interface PayloadAnnouncementCard {
  id: string | number
  page: 'sindicato' | 'juridico' | 'servicos' | 'home'
  title: string
  description?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  image?: PayloadMedia
  imageAlt?: string
  site: PayloadSite | string
  createdAt: string
  updatedAt: string
}

// API Response types
export interface PayloadResponse<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

// Frontend component types (transformed from backend)
export interface NewsItem {
  id: string | number
  imageUrl: string
  imageAlt: string
  category: string
  date: string
  title: string
  link: string
}

export interface CategoryNews {
  id: string | number
  imageUrl: string
  imageAlt: string
  date: string
  title: string
  link: string
}

export interface CategorizedContent {
  [categoryName: string]: CategoryNews[]
}

export interface NavItem {
  label: string
  href: string
  isButton?: boolean
}

export interface HeroContent {
  badge?: string
  badgeText?: string
  title: string
  description: string
  primaryButtonText: string
  primaryButtonHref: string
  secondaryButtonText: string
  secondaryButtonHref: string
  imageUrl: string
  imageAlt: string
}

export interface FooterContent {
  logo?: {
    url: string
    alt: string
  }
  description: string
  navItems: NavItem[]
  socialLinks: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
  }
}

export interface CTAContent {
  title: string
  titleMobile?: string
  description: string
  descriptionMobile?: string
  primaryButtonText: string
  primaryButtonHref: string
  secondaryButtonText: string
  secondaryButtonHref: string
  imageUrl: string
  imageAlt: string
}

export interface AnnouncementContent {
  imageUrl: string
  imageAlt: string
  title: string
  description: string
  primaryButtonText: string
  primaryButtonHref?: string
}

// Sindicato Page types
export interface PayloadLocation {
  id: string
  title: string
  description: string
  address: unknown // Lexical Rich Text
  mapUrl: string
  icon: 'map-pin' | 'building' | 'office'
}

export interface PayloadTeamMember {
  id: string
  name: string
  role: string
  image?: PayloadMedia
  imageAlt?: string
}

export interface PayloadTeamSection {
  id: string
  title: string
  badge?: string
  description?: string
  members: PayloadTeamMember[]
}

export interface PayloadSindicatoPage {
  id: string | number
  locationsSection: {
    badge?: string
    title: string
    description?: string
    mapEmbedUrl?: string
    locations: PayloadLocation[]
  }
  teamSections: PayloadTeamSection[]
  site: PayloadSite | string | number
  createdAt: string
  updatedAt: string
}

// Juridico Page types
export interface PayloadJuridicoContact {
  id: string
  icon: 'mail' | 'map-pin' | 'phone'
  title: string
  description: string
  linkText: string
  linkHref: string
}

export interface PayloadJuridicoTab {
  id: string
  label: string
  badge?: string
  content: unknown // Lexical Rich Text
}

export interface PayloadJuridicoPage {
  id: string | number
  contactInfo: {
    badge?: string
    title: string
    description?: string
    contacts: PayloadJuridicoContact[]
  }
  tabs: PayloadJuridicoTab[]
  site: PayloadSite | string | number
  createdAt: string
  updatedAt: string
}

// Servicos Page types
export interface PayloadServicosFeature {
  id: string
  icon: string
  title: string
  description: string
}

export interface PayloadServicosBenefit {
  id: string
  name: string
  discount: string
  address?: string
  phone?: string
  hours?: string
  observations?: string
}

export interface PayloadServicosBenefitCategory {
  id: string
  name: string
  benefits: PayloadServicosBenefit[]
}

export interface PayloadServicosFacility {
  id: string
  badge?: string
  title: string
  description?: string
  image?: PayloadMedia
  imageAlt?: string
  priceTable?: Array<{
    id: string
    description: string
    price: string
  }>
  generalInfo?: Array<{
    id: string
    info: string
  }>
  contactInfo?: {
    hours?: string
    email?: string
    phone?: string
  }
  regulations?: Array<{
    id: string
    rule: string
  }>
}

export interface PayloadServicosPage {
  id: string | number
  hero: {
    badge?: string
    title: string
    description?: string
    image?: PayloadMedia
    imageAlt?: string
    features?: PayloadServicosFeature[]
  }
  benefits: {
    badge?: string
    title: string
    subtitle?: string
    categories: PayloadServicosBenefitCategory[]
  }
  facilities: PayloadServicosFacility[]
  site: PayloadSite | string | number
  createdAt: string
  updatedAt: string
}
