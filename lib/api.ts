import { cacheTag, cacheLife } from 'next/cache'
import type {
  PayloadSite,
  PayloadPost,
  PayloadCTASection,
  PayloadAnnouncementCard,
  PayloadResponse,
  PayloadCategory,
  PayloadSindicatoPage,
  PayloadJuridicoPage,
  PayloadServicosPage,
} from '@/types/payload'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
const SITE_SLUG = process.env.SITE_SLUG || 'sitibegam'

// Fetch wrapper with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`

  console.log(`[API] Fetching: ${url}`)

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    cache: 'no-store', // Disable fetch cache to use Next.js cache
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    console.error(`[API] Error ${response.status}: ${errorText}`)
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  console.log(`[API] Success: ${endpoint}`, { docsCount: data.docs?.length })
  return data
}

// Get site data by slug
export async function getSiteData(): Promise<PayloadSite | null> {
  'use cache'
  cacheLife('days')
  cacheTag('sites')

  try {
    const response = await fetchAPI<PayloadResponse<PayloadSite>>(
      `/api/sites?where[slug][equals]=${SITE_SLUG}&depth=2`
    )
    return response.docs[0] || null
  } catch (error) {
    console.error('Error fetching site data:', error)
    return null
  }
}

// Get latest posts for homepage
export async function getLatestPosts(
  siteId: string | number,
  limit: number = 10
): Promise<PayloadPost[]> {
  'use cache'
  cacheLife('days')
  cacheTag('posts')

  try {
    const params = new URLSearchParams({
      'where[sites][in]': String(siteId),
      'where[_status][equals]': 'published',
      sort: '-publishedAt',
      limit: String(limit),
      depth: '2',
    })

    const response = await fetchAPI<PayloadResponse<PayloadPost>>(
      `/api/posts?${params}`
    )
    return response.docs
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

// Get posts by category
export async function getPostsByCategory(
  siteId: string | number,
  categoryId: string | number,
  limit: number = 6
): Promise<PayloadPost[]> {
  'use cache'
  cacheLife('days')
  cacheTag('posts')

  try {
    const params = new URLSearchParams({
      'where[sites][in]': String(siteId),
      'where[categories][in]': String(categoryId),
      'where[_status][equals]': 'published',
      sort: '-publishedAt',
      limit: String(limit),
      depth: '2',
    })

    const response = await fetchAPI<PayloadResponse<PayloadPost>>(
      `/api/posts?${params}`
    )
    return response.docs
  } catch (error) {
    console.error('Error fetching posts by category:', error)
    return []
  }
}

// Get all categories
export async function getCategories(): Promise<PayloadCategory[]> {
  'use cache'
  cacheLife('days')
  cacheTag('categories')

  try {
    const response = await fetchAPI<PayloadResponse<PayloadCategory>>(
      '/api/categories?limit=100'
    )
    return response.docs
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Get CTA sections for a specific page
export async function getCTASections(
  siteId: string | number,
  page: 'home' | 'sindicato' | 'juridico' | 'servicos'
): Promise<PayloadCTASection[]> {
  'use cache'
  cacheLife('days')
  cacheTag('cta-sections')

  try {
    const params = new URLSearchParams({
      'where[site][equals]': String(siteId),
      'where[page][equals]': page,
      depth: '2',
    })

    const response = await fetchAPI<PayloadResponse<PayloadCTASection>>(
      `/api/cta-sections?${params}`
    )
    return response.docs
  } catch (error) {
    console.error('Error fetching CTA sections:', error)
    return []
  }
}

// Get announcement cards for a specific page
export async function getAnnouncementCards(
  siteId: string | number,
  page: 'home' | 'sindicato' | 'juridico' | 'servicos'
): Promise<PayloadAnnouncementCard[]> {
  'use cache'
  cacheLife('days')
  cacheTag('announcement-cards')

  try {
    const params = new URLSearchParams({
      'where[site][equals]': String(siteId),
      'where[page][equals]': page,
      depth: '2',
    })

    const response = await fetchAPI<PayloadResponse<PayloadAnnouncementCard>>(
      `/api/announcement-cards?${params}`
    )
    return response.docs
  } catch (error) {
    console.error('Error fetching announcement cards:', error)
    return []
  }
}

// Get single post by slug
export async function getPostBySlug(slug: string): Promise<PayloadPost | null> {
  'use cache'
  cacheLife('days')
  cacheTag('posts')

  try {
    const params = new URLSearchParams({
      'where[slug][equals]': slug,
      'where[_status][equals]': 'published',
      depth: '2',
    })

    const response = await fetchAPI<PayloadResponse<PayloadPost>>(
      `/api/posts?${params}`
    )
    return response.docs[0] || null
  } catch (error) {
    console.error('Error fetching post by slug:', error)
    return null
  }
}

// Get sindicato page data by site ID
export async function getSindicatoPageData(
  siteId: string | number
): Promise<PayloadSindicatoPage | null> {
  'use cache'
  cacheLife('days')
  cacheTag('sindicato-page')

  try {
    const params = new URLSearchParams({
      'where[site][equals]': String(siteId),
      depth: '2',
    })

    const response = await fetchAPI<PayloadResponse<PayloadSindicatoPage>>(
      `/api/sindicato-page?${params}`
    )
    return response.docs[0] || null
  } catch (error) {
    console.error('Error fetching sindicato page:', error)
    return null
  }
}

// Get juridico page data by site ID
export async function getJuridicoPageData(
  siteId: string | number
): Promise<PayloadJuridicoPage | null> {
  'use cache'
  cacheLife('days')
  cacheTag('juridico-page')

  try {
    const params = new URLSearchParams({
      'where[site][equals]': String(siteId),
      depth: '2',
    })

    const response = await fetchAPI<PayloadResponse<PayloadJuridicoPage>>(
      `/api/juridico-page?${params}`
    )
    return response.docs[0] || null
  } catch (error) {
    console.error('Error fetching juridico page:', error)
    return null
  }
}

// Get servicos page data by site ID
export async function getServicosPageData(
  siteId: string | number
): Promise<PayloadServicosPage | null> {
  'use cache'
  cacheLife('days')
  cacheTag('servicos-page')

  try {
    const params = new URLSearchParams({
      'where[site][equals]': String(siteId),
      depth: '2',
    })

    const response = await fetchAPI<PayloadResponse<PayloadServicosPage>>(
      `/api/servicos-page?${params}`
    )
    return response.docs[0] || null
  } catch (error) {
    console.error('Error fetching servicos page:', error)
    return null
  }
}
