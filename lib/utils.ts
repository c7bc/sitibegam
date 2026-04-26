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
  HeroSlide,
  FooterContent,
  CTAContent,
  AnnouncementContent,
  NavItem,
} from '@/types/payload'

// API URL for building absolute image URLs
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// Vercel Blob public URL — usado para servir imagens diretamente, sem depender do rewrite no backend
const BLOB_BASE_URL = process.env.NEXT_PUBLIC_BLOB_URL || 'https://t5nhsatjphczs4ej.public.blob.vercel-storage.com'

// Transforma /api/media/file/<filename> em URL direta do Vercel Blob
function mediaPathToBlobUrl(relativeUrl: string): string | null {
  const match = relativeUrl.match(/^\/api\/media\/file\/(.+)$/)
  if (!match) return null
  return `${BLOB_BASE_URL}/media/${match[1]}`
}

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

  // Se for uma URL de media do Payload, aponta direto pro Vercel Blob
  const blobUrl = mediaPathToBlobUrl(relativeUrl)
  if (blobUrl) return blobUrl

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

// Extract plain text from Lexical rich text content
function extractTextFromLexical(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  const root = (content as { root?: { children?: unknown[] } }).root
  if (!root?.children) return ''
  const texts: string[] = []
  function walk(nodes: unknown[]) {
    for (const node of nodes) {
      if (typeof node !== 'object' || !node) continue
      const n = node as { text?: string; children?: unknown[] }
      if (n.text) texts.push(n.text)
      if (n.children) walk(n.children)
    }
  }
  walk(root.children)
  return texts.join(' ')
}

// Transform PayloadPost to NewsItem for frontend components
export function transformPostToNewsItem(post: PayloadPost): NewsItem {
  const fullText = extractTextFromLexical(post.content)
  return {
    id: post.id,
    imageUrl: getImageUrl(post.heroImage, 'medium'),
    imageAlt: post.heroImage?.alt || post.title,
    category: getCategoryName(post),
    date: formatDate(post.publishedAt || post.createdAt),
    title: post.title,
    link: `/publicacoes/${post.slug}`,
    excerpt: fullText.length > 200 ? fullText.slice(0, 200) + '…' : fullText,
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
    badge: site.hero?.badge || 'Unidos pela Voz!',
    badgeText: site.hero?.badgeText || 'Junte-se à força do SITIBEGAM',
    title: site.hero?.title || 'Fortaleça sua voz. Fortaleça sua categoria.',
    description: site.hero?.description || 'O SITIBEGAM é mais do que uma entidade: é o eco da sua dignidade profissional.',
    primaryButtonText: site.hero?.primaryButtonText || 'Ver benefícios',
    primaryButtonHref: site.hero?.primaryButtonHref || '/servicos',
    secondaryButtonText: site.hero?.secondaryButtonText || 'Sindicalize-se agora',
    secondaryButtonHref: site.hero?.secondaryButtonHref || '/sindicalize-se',
    imageUrl: getImageUrl(site.hero?.image, 'xlarge') || '/hero.jpeg',
    imageAlt: site.hero?.imageAlt || 'Trabalhador da indústria de bebidas',
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
    description: site.footer?.description || 'Representando e defendendo os direitos dos trabalhadores SITIBEGAM com força e dedicação.',
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

// Transform site slides to HeroSlide array for carousel
export function transformSiteToSlides(site: PayloadSite): HeroSlide[] {
  if (!site.slides || site.slides.length === 0) return []
  return site.slides.map(slide => ({
    id: slide.id,
    imageUrl: getImageUrl(slide.image, 'xlarge'),
    imageAlt: slide.image?.alt || 'Banner',
  }))
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
