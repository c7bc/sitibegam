// Convert Lexical rich text JSON to HTML

import { resolveMediaUrl } from './resolve-media-url'

interface LexicalNode {
  type: string
  text?: string
  format?: number
  children?: LexicalNode[]
  direction?: string | null
  url?: string
  fields?: {
    url?: string
    newTab?: boolean
    linkType?: string
    // Block fields (populated quando type === 'block')
    blockType?: string
    // YouTubeBlock
    caption?: string
    // PdfEmbedBlock
    file?: unknown
    titulo?: string
    altura?: number
  }
  // Upload node fields
  value?: unknown
  relationTo?: string
}

interface LexicalRoot {
  root: LexicalNode
}

// Format flags
const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2
const FORMAT_UNDERLINE = 8

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatText(text: string, format: number): string {
  let result = text

  if (format & FORMAT_BOLD) {
    result = `<strong>${result}</strong>`
  }
  if (format & FORMAT_ITALIC) {
    result = `<em>${result}</em>`
  }
  if (format & FORMAT_UNDERLINE) {
    result = `<u>${result}</u>`
  }

  return result
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/,
  )
  return match ? match[1] : null
}

function renderUpload(node: LexicalNode): string {
  const media = node.value as { url?: string; alt?: string; mimeType?: string } | null
  if (!media) return ''
  const url = resolveMediaUrl(media)
  if (!url) return ''
  const alt = escapeHtml(media.alt || '')

  // Upload customizado com legenda + alinhamento (definido em Posts.ts)
  const fields = (node.fields || {}) as { caption?: string; alinhamento?: string }
  const caption = fields.caption ? escapeHtml(fields.caption) : ''
  const alignment = fields.alinhamento || 'centro'

  const alignClass =
    alignment === 'esquerda'
      ? 'mr-auto max-w-[50%]'
      : alignment === 'direita'
        ? 'ml-auto max-w-[50%]'
        : alignment === 'largura-total'
          ? 'w-full'
          : 'mx-auto max-w-[80%]'

  // PDF upload inline (caso inserido via upload, não via PdfEmbedBlock)
  if (media.mimeType?.includes('pdf')) {
    return `<div class="my-6 ${alignClass}">
      <iframe src="${url}#toolbar=1" class="w-full rounded-lg border border-gray-200" style="height:600px"></iframe>
      ${caption ? `<p class="mt-2 text-sm text-gray-600 text-center italic">${caption}</p>` : ''}
    </div>`
  }

  return `<figure class="my-6 ${alignClass}">
    <img src="${url}" alt="${alt}" class="w-full rounded-lg shadow-md" />
    ${caption ? `<figcaption class="mt-2 text-sm text-gray-600 text-center italic">${caption}</figcaption>` : ''}
  </figure>`
}

function renderBlock(node: LexicalNode): string {
  const fields = node.fields
  if (!fields) return ''

  switch (fields.blockType) {
    case 'youtube': {
      const videoUrl = fields.url || ''
      const videoId = extractYouTubeId(videoUrl)
      if (!videoId) {
        return `<div class="my-6 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">URL do YouTube inválida: ${escapeHtml(videoUrl)}</div>`
      }
      const caption = fields.caption ? escapeHtml(fields.caption) : ''
      return `<div class="my-6">
        <div class="relative w-full overflow-hidden rounded-lg shadow-md" style="aspect-ratio:16/9">
          <iframe
            src="https://www.youtube.com/embed/${videoId}"
            class="absolute inset-0 w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            title="${caption || 'Vídeo YouTube'}"
          ></iframe>
        </div>
        ${caption ? `<p class="mt-2 text-sm text-gray-600 text-center italic">${caption}</p>` : ''}
      </div>`
    }

    case 'pdfEmbed': {
      const file = fields.file as { url?: string; filename?: string } | string | null | undefined
      const url = resolveMediaUrl(file as never)
      if (!url) {
        return `<div class="my-6 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">PDF não encontrado</div>`
      }
      const altura = typeof fields.altura === 'number' ? fields.altura : 600
      const titulo = fields.titulo ? escapeHtml(fields.titulo) : ''
      return `<div class="my-6">
        ${titulo ? `<h3 class="mb-2 font-semibold text-gray-800">${titulo}</h3>` : ''}
        <iframe
          src="${url}#toolbar=1"
          class="w-full rounded-lg border border-gray-200 shadow-sm"
          style="height:${altura}px"
          title="${titulo || 'Documento PDF'}"
        ></iframe>
        <p class="mt-2 text-sm">
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:underline">
            Baixar PDF
          </a>
        </p>
      </div>`
    }

    default:
      return ''
  }
}

function convertNode(node: LexicalNode): string {
  switch (node.type) {
    case 'root':
      return node.children?.map(convertNode).join('') || ''

    case 'paragraph':
      const paragraphContent = node.children?.map(convertNode).join('') || ''
      if (!paragraphContent.trim()) return ''
      return `<p>${paragraphContent}</p>`

    case 'heading':
      const level = (node as any).tag || 'h2'
      const headingContent = node.children?.map(convertNode).join('') || ''
      return `<${level}>${headingContent}</${level}>`

    case 'text':
      const text = node.text || ''
      return formatText(escapeHtml(text), node.format || 0)

    case 'link':
      const linkContent = node.children?.map(convertNode).join('') || ''
      const url = node.fields?.url || node.url || '#'
      const target = node.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${url}"${target} class="text-brand-600 hover:underline">${linkContent}</a>`

    case 'list':
      const listTag = (node as any).listType === 'number' ? 'ol' : 'ul'
      const listContent = node.children?.map(convertNode).join('') || ''
      return `<${listTag}>${listContent}</${listTag}>`

    case 'listitem':
      const listItemContent = node.children?.map(convertNode).join('') || ''
      return `<li>${listItemContent}</li>`

    case 'quote':
      const quoteContent = node.children?.map(convertNode).join('') || ''
      return `<blockquote class="border-l-4 border-brand-600 pl-4 italic text-tertiary">${quoteContent}</blockquote>`

    case 'horizontalrule':
      return `<hr class="my-8 border-t border-gray-200" />`

    case 'upload':
      return renderUpload(node)

    case 'block':
      return renderBlock(node)

    default:
      // For unknown types, try to render children
      return node.children?.map(convertNode).join('') || ''
  }
}

export function lexicalToHtml(content: LexicalRoot | unknown): string {
  if (!content || typeof content !== 'object') {
    return ''
  }

  const lexicalContent = content as LexicalRoot
  if (!lexicalContent.root) {
    return ''
  }

  return convertNode(lexicalContent.root)
}

// Extract plain text from Lexical content (for descriptions, excerpts)
export function lexicalToText(content: LexicalRoot | unknown): string {
  if (!content || typeof content !== 'object') {
    return ''
  }

  const lexicalContent = content as LexicalRoot
  if (!lexicalContent.root) {
    return ''
  }

  function extractText(node: LexicalNode): string {
    if (node.type === 'text') {
      return node.text || ''
    }
    return node.children?.map(extractText).join(' ') || ''
  }

  return extractText(lexicalContent.root).trim()
}
