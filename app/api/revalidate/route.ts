import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

interface RevalidateBody {
  collection: string
  operation: 'create' | 'update' | 'delete'
  siteId: string
  timestamp: string
  id?: string | number
  slug?: string
}

export async function POST(request: NextRequest) {
  try {
    // Validate secret
    const secret = request.headers.get('x-revalidate-secret')

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }

    const body: RevalidateBody = await request.json()
    const { collection, operation, slug } = body

    // Revalidate by tag (primary method)
    revalidateTag(collection, 'page')

    // Also revalidate specific paths based on collection
    switch (collection) {
      case 'posts':
        revalidateTag('posts', 'page')
        revalidatePath('/')
        revalidatePath('/publicacoes')
        revalidatePath('/contato')
        revalidatePath('/sindicalize-se')
        // Revalidate specific post if slug exists
        if (slug) {
          revalidatePath(`/publicacoes/${slug}`)
        }
        break

      case 'sites':
        revalidateTag('sites', 'page')
        revalidatePath('/', 'layout') // Revalidate entire app
        break

      case 'sindicato-page':
        revalidateTag('sindicato-page', 'page')
        revalidatePath('/sindicato')
        break

      case 'juridico-page':
        revalidateTag('juridico-page', 'page')
        revalidatePath('/juridico')
        break

      case 'servicos-page':
        revalidateTag('servicos-page', 'page')
        revalidatePath('/servicos')
        break

      case 'cta-sections':
        revalidateTag('cta-sections', 'page')
        revalidatePath('/')
        revalidatePath('/sindicato')
        revalidatePath('/juridico')
        revalidatePath('/servicos')
        revalidatePath('/contato')
        revalidatePath('/newsletter')
        revalidatePath('/sindicalize-se')
        break

      case 'announcement-cards':
        revalidateTag('announcement-cards', 'page')
        revalidatePath('/')
        revalidatePath('/sindicato')
        revalidatePath('/juridico')
        revalidatePath('/servicos')
        revalidatePath('/contato')
        revalidatePath('/newsletter')
        revalidatePath('/sindicalize-se')
        break

      case 'categories':
        revalidateTag('categories', 'page')
        revalidatePath('/publicacoes')
        break

      case 'contact-submissions':
      case 'newsletter-submissions':
      case 'sindicalize-submissions':
        // No need to revalidate for form submissions
        break

      default:
        // Revalidate homepage for any unknown collection
        revalidatePath('/')
    }

    return NextResponse.json({
      revalidated: true,
      collection,
      operation,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Revalidation endpoint is running',
  })
}
