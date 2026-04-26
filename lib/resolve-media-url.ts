const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
const BLOB_BASE_URL =
  process.env.NEXT_PUBLIC_BLOB_URL || 'https://t5nhsatjphczs4ej.public.blob.vercel-storage.com'

type MediaLike = {
  url?: string | null
  filename?: string | null
} | null | undefined

export function resolveMediaUrl(media: MediaLike | string): string | undefined {
  if (!media) return undefined
  if (typeof media === 'string') {
    if (media.startsWith('http')) return media
    const match = media.match(/^\/api\/media\/file\/(.+)$/)
    if (match) return `${BLOB_BASE_URL}/media/${match[1]}`
    return `${API_URL}${media}`
  }
  const url = media.url
  if (!url) return undefined
  if (url.startsWith('http')) return url
  const match = url.match(/^\/api\/media\/file\/(.+)$/)
  if (match) return `${BLOB_BASE_URL}/media/${match[1]}`
  return `${API_URL}${url}`
}
