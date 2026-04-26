import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ protocolo: string }> },
) {
  const { protocolo } = await params

  const proto = decodeURIComponent(protocolo).trim().toUpperCase()
  if (!proto) {
    return NextResponse.json({ error: 'Protocolo inválido' }, { status: 400 })
  }

  try {
    const url = `${API_URL}/api/denuncias?where[protocolo][equals]=${encodeURIComponent(proto)}&limit=1&depth=0`
    const resp = await fetch(url, { cache: 'no-store' })

    if (!resp.ok) {
      return NextResponse.json({ error: 'Erro ao consultar' }, { status: 500 })
    }

    const data = await resp.json()
    const doc = data.docs?.[0]
    if (!doc) {
      return NextResponse.json({ error: 'Protocolo não encontrado' }, { status: 404 })
    }

    // Retorna apenas dados não sensíveis
    return NextResponse.json({
      protocolo: doc.protocolo,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })
  } catch (err) {
    console.error('[denuncias/protocolo]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro interno' },
      { status: 500 },
    )
  }
}
