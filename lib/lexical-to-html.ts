// Convert Lexical rich text JSON to HTML

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
  }
}

interface LexicalRoot {
  root: LexicalNode
}

// Format flags
const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2
const FORMAT_UNDERLINE = 8

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
      return formatText(text, node.format || 0)

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
