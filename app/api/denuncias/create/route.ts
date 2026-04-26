import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

async function uploadAnexo(file: File): Promise<number | null> {
  try {
    const fd = new FormData()
    fd.append('file', file, file.name)
    fd.append('_payload', JSON.stringify({ alt: `anexo-denuncia-${Date.now()}` }))
    const resp = await fetch(`${API_URL}/api/media`, {
      method: 'POST',
      body: fd,
    })
    if (!resp.ok) return null
    const data = await resp.json()
    return data.doc?.id ?? data.id ?? null
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const fd = await request.formData()

    const anonimo = fd.get('anonimo') === 'true'
    const categoria = String(fd.get('categoria') || '').trim()
    const descricao = String(fd.get('descricao') || '').trim()
    const siteId = fd.get('site')

    if (!categoria || !descricao || !siteId) {
      return NextResponse.json({ error: 'Dados obrigatórios ausentes' }, { status: 400 })
    }

    const payload: Record<string, unknown> = {
      categoria,
      descricao,
      anonimo,
      site: Number(siteId),
    }

    if (!anonimo) {
      const nome = String(fd.get('nome') || '').trim()
      const email = String(fd.get('email') || '').trim()
      const telefone = String(fd.get('telefone') || '').trim()
      if (nome) payload.nome = nome
      if (email) payload.email = email
      if (telefone) payload.telefone = telefone
    }

    const empresa = String(fd.get('empresa') || '').trim()
    if (empresa) payload.empresa = empresa

    const anexoFile = fd.get('anexo')
    if (anexoFile instanceof File && anexoFile.size > 0) {
      const anexoId = await uploadAnexo(anexoFile)
      if (anexoId) payload.anexo = anexoId
    }

    const resp = await fetch(`${API_URL}/api/denuncias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}))
      const msg = err.errors?.[0]?.message || 'Erro ao registrar denúncia'
      return NextResponse.json({ error: msg }, { status: resp.status })
    }

    const data = await resp.json()
    const protocolo = data.doc?.protocolo ?? data.protocolo

    return NextResponse.json({ protocolo })
  } catch (err) {
    console.error('[denuncias/create]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro interno' },
      { status: 500 },
    )
  }
}
