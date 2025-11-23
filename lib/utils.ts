import type {
  PayloadPost,
  PayloadMedia,
  PayloadCategory,
  PayloadSite,
  PayloadCTASection,
  PayloadAnnouncementCard,
  NewsItem,
  CategoryNews,
  CategorizedContent,
  HeroContent,
  FooterContent,
  CTAContent,
  AnnouncementContent,
  NavItem,
} from '@/types/payload'

// API URL for building absolute image URLs
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// Format ISO date to Portuguese format (e.g., "3 de novembro de 2025")
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ]

  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return `${day} de ${month} de ${year}`
}

// Get image URL from PayloadMedia with fallback to size
// Returns absolute URL by prepending API_URL to relative paths
export function getImageUrl(
  media: PayloadMedia | undefined,
  size: keyof PayloadMedia['sizes'] = 'medium'
): string {
  if (!media) return '/placeholder.jpg'

  // Try to get the requested size, fallback to original URL
  const sizeUrl = media.sizes?.[size]?.url
  const relativeUrl = sizeUrl || media.url

  // If URL is already absolute, return as is
  if (relativeUrl.startsWith('http')) {
    return relativeUrl
  }

  // Build absolute URL from API_URL
  return `${API_URL}${relativeUrl}`
}

// Get category name from post
export function getCategoryName(post: PayloadPost): string {
  if (!post.categories || post.categories.length === 0) return 'Geral'

  const category = post.categories[0]
  if (typeof category === 'string') return 'Geral'

  return (category as PayloadCategory).title
}

// Transform PayloadPost to NewsItem for frontend components
export function transformPostToNewsItem(post: PayloadPost): NewsItem {
  return {
    id: post.id,
    imageUrl: getImageUrl(post.heroImage, 'medium'),
    imageAlt: post.heroImage?.alt || post.title,
    category: getCategoryName(post),
    date: formatDate(post.publishedAt || post.createdAt),
    title: post.title,
    link: `/publicacoes/${post.slug}`,
  }
}

// Transform PayloadPost to CategoryNews for frontend components
export function transformPostToCategoryNews(post: PayloadPost): CategoryNews {
  return {
    id: post.id,
    imageUrl: getImageUrl(post.heroImage, 'thumbnail'),
    imageAlt: post.heroImage?.alt || post.title,
    date: formatDate(post.publishedAt || post.createdAt),
    title: post.title,
    link: `/publicacoes/${post.slug}`,
  }
}

// Group posts by category
export function groupPostsByCategory(
  posts: PayloadPost[],
  categoryNames: string[]
): CategorizedContent {
  const result: CategorizedContent = {}

  // Initialize categories
  categoryNames.forEach(name => {
    result[name] = []
  })

  // Group posts
  posts.forEach(post => {
    const categoryName = getCategoryName(post)
    if (result[categoryName]) {
      result[categoryName].push(transformPostToCategoryNews(post))
    }
  })

  return result
}

// Transform site data to HeroContent
export function transformSiteToHeroContent(site: PayloadSite): HeroContent {
  return {
    badge: site.hero?.badge || 'Força dos trabalhadores de bebidas',
    badgeText: site.hero?.badgeText || 'Força dos trabalhadores de bebidas',
    title: site.hero?.title || 'Fortaleça sua voz. Fortaleça sua categoria.',
    description: site.hero?.description || 'O SITIBEGAM é mais do que uma entidade: é a defesa da sua dignidade profissional na indústria de bebidas.',
    primaryButtonText: site.hero?.primaryButtonText || 'Ver benefícios',
    primaryButtonHref: site.hero?.primaryButtonHref || '/servicos',
    secondaryButtonText: site.hero?.secondaryButtonText || 'Sindicalize-se agora',
    secondaryButtonHref: site.hero?.secondaryButtonHref || '/sindicalize-se',
    imageUrl: getImageUrl(site.hero?.image, 'xlarge') || '/hero.jpeg',
    imageAlt: site.hero?.imageAlt || 'Trabalhadores da indústria de bebidas',
  }
}

// Transform site data to FooterContent
export function transformSiteToFooterContent(site: PayloadSite): FooterContent {
  const defaultNavItems: NavItem[] = [
    { label: 'Início', href: '/' },
    { label: 'Sindicato', href: '/sindicato' },
    { label: 'Jurídico', href: '/juridico' },
    { label: 'Publicações', href: '/publicacoes' },
    { label: 'Serviços', href: '/servicos' },
    { label: 'Contato', href: '/contato' },
  ]

  return {
    logo: site.footer?.logo ? {
      url: getImageUrl(site.footer.logo, 'thumbnail'),
      alt: site.footer.logo.alt || site.name,
    } : undefined,
    description: site.footer?.description || 'Representando e defendendo os direitos dos trabalhadores da indústria de bebidas com força e dedicação.',
    navItems: site.header?.navItems || defaultNavItems,
    socialLinks: {
      facebook: site.footer?.socialLinks?.facebook,
      instagram: site.footer?.socialLinks?.instagram,
      twitter: site.footer?.socialLinks?.twitter,
      youtube: site.footer?.socialLinks?.youtube,
    },
  }
}

// Transform CTA section to CTAContent
export function transformCTAToContent(cta: PayloadCTASection): CTAContent {
  return {
    title: cta.title,
    description: cta.description || '',
    primaryButtonText: cta.primaryButtonText || 'Saiba mais',
    primaryButtonHref: cta.primaryButtonHref || '#',
    secondaryButtonText: cta.secondaryButtonText || '',
    secondaryButtonHref: cta.secondaryButtonHref || '#',
    imageUrl: getImageUrl(cta.image, 'large'),
    imageAlt: cta.imageAlt || cta.title,
  }
}

// Transform Announcement card to AnnouncementContent
export function transformAnnouncementToContent(
  announcement: PayloadAnnouncementCard
): AnnouncementContent {
  return {
    imageUrl: getImageUrl(announcement.image, 'medium'),
    imageAlt: announcement.imageAlt || announcement.title,
    title: announcement.title,
    description: announcement.description || '',
    primaryButtonText: announcement.primaryButtonText || 'Saiba mais',
    primaryButtonHref: announcement.primaryButtonHref,
  }
}

// Get navigation items from site
export function getNavItems(site: PayloadSite): NavItem[] {
  if (site.header?.navItems && site.header.navItems.length > 0) {
    return site.header.navItems
  }

  // Default navigation
  return [
    { label: 'INÍCIO', href: '/' },
    { label: 'SINDICATO', href: '/sindicato' },
    { label: 'JURÍDICO', href: '/juridico' },
    { label: 'PUBLICAÇÕES', href: '/publicacoes' },
    { label: 'SERVIÇOS', href: '/servicos' },
    { label: 'NEWSLETTER', href: '/newsletter' },
    { label: 'CONTATO', href: '/contato' },
  ]
}

// Filter posts by category type (news vs articles)
export function filterPostsByType(
  posts: PayloadPost[],
  type: 'news' | 'articles',
  newsCategories: string[] = ['Rádio', 'TV', 'Direitos Trabalhistas', 'Eventos'],
  articleCategories: string[] = ['Opinião', 'Análises', 'Entrevistas', 'Tutoriais']
): PayloadPost[] {
  const categories = type === 'news' ? newsCategories : articleCategories

  return posts.filter(post => {
    const categoryName = getCategoryName(post)
    return categories.includes(categoryName)
  })
}
