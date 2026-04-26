import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

const ALL_TAGS = [
  'homepage',
  'posts',
  'sites',
  'cta-sections',
  'announcement-cards',
  'categories',
  'sindicato-page',
  'juridico-page',
  'servicos-page',
  'publication-page',
  'publicacoes-page',
  'noticias-page',
  'artigos-page',
  'revistas-page',
  'cartilhas-page',
  'contato-page',
  'juridico-page-content',
  'newsletter-page',
  'sindicalize-se-page',
  'publications',
  'publication-list',
]

const ALL_PATHS = [
  '/',
  '/publicacoes',
  '/sindicato',
  '/juridico',
  '/servicos',
  '/contato',
  '/newsletter',
  '/sindicalize-se',
  '/publicacoes/noticias',
  '/publicacoes/artigos',
  '/publicacoes/revistas',
  '/publicacoes/cartilhas',
]

export async function POST(request: NextRequest) {
  const secret =
    request.headers.get('x-revalidate-secret') ||
    request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const results: { tags: string[]; paths: string[]; errors: string[] } = {
    tags: [],
    paths: [],
    errors: [],
  }

  for (const tag of ALL_TAGS) {
    try {
      revalidateTag(tag, 'page')
      results.tags.push(tag)
    } catch (err) {
      results.errors.push(`tag:${tag}:${err instanceof Error ? err.message : String(err)}`)
    }
  }

  for (const path of ALL_PATHS) {
    try {
      revalidatePath(path)
      results.paths.push(path)
    } catch (err) {
      results.errors.push(`path:${path}:${err instanceof Error ? err.message : String(err)}`)
    }
  }

  try {
    revalidatePath('/', 'layout')
  } catch (err) {
    results.errors.push(`layout:${err instanceof Error ? err.message : String(err)}`)
  }

  return NextResponse.json({
    revalidated: true,
    tagsCount: results.tags.length,
    pathsCount: results.paths.length,
    errors: results.errors,
    timestamp: new Date().toISOString(),
  })
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Revalidate-all endpoint is running',
    tagsCount: ALL_TAGS.length,
    pathsCount: ALL_PATHS.length,
  })
}
