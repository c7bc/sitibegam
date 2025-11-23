# Página de Publicação - Cache Configuration

Esta página utiliza o novo sistema de cache do Next.js 16 com `cacheComponents`.

## Arquitetura

A página está dividida em duas partes:

1. **`PublicationPage`** (não cacheado) - Componente principal que renderiza Header, Footer e gerencia o Suspense
2. **`PublicationContent`** (cacheado) - Conteúdo principal da página com 6 horas de TTL

Essa separação garante que:
- Header e Footer permanecem dinâmicos (sem cache)
- O conteúdo da publicação é cacheado eficientemente
- Não há bloqueio de renderização por dados não cacheados

## Configuração de Cache

### TTL (Time To Live)
A página está configurada com **6 horas de TTL** usando `cacheLife`:

```typescript
cacheLife({
  stale: 21600,     // 6 horas - conteúdo permanece fresco no cliente
  revalidate: 3600, // 1 hora - revalidação em background
  expire: 43200,    // 12 horas - expiração absoluta
})
```

### Como Funciona

1. **stale (21600s = 6h)**: O conteúdo é considerado "fresco" por 6 horas no cliente
2. **revalidate (3600s = 1h)**: A cada 1 hora, Next.js revalida o conteúdo em background
3. **expire (43200s = 12h)**: Após 12 horas, o cache expira completamente

## Cache Tags

Cada publicação tem duas tags de cache:
- `publications` - Tag geral para todas as publicações
- `publication-{slug}` - Tag específica para cada publicação

## Revalidação On-Demand

### Revalidar Uma Publicação Específica

```typescript
import { revalidatePublication } from '@/app/actions/revalidate-publications';

// Revalidar apenas uma publicação
await revalidatePublication('direitos-trabalhistas-radiodifusao');
```

### Revalidar Todas as Publicações

```typescript
import { revalidateAllPublications } from '@/app/actions/revalidate-publications';

// Revalidar todas as publicações de uma vez
await revalidateAllPublications();
```

### Exemplo: Webhook do CMS

```typescript
// app/api/revalidate/route.ts
import { revalidatePublication } from '@/app/actions/revalidate-publications';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { slug, secret } = await request.json();

  // Verificar token de segurança
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: 'Invalid token' }, { status: 401 });
  }

  // Revalidar a publicação
  await revalidatePublication(slug);

  return Response.json({ revalidated: true, now: Date.now() });
}
```

## Benefícios

✅ **Performance**: Conteúdo servido do cache por 6 horas
✅ **Atualização**: Revalidação em background a cada 1 hora
✅ **Controle**: Revalidação on-demand quando necessário
✅ **Flexibilidade**: Tags permitem invalidação granular

## Próximos Passos

Quando integrar com um CMS:
1. Substituir `MOCK_PUBLICATIONS` por chamadas ao CMS
2. Adicionar webhooks do CMS para revalidação automática
3. Implementar ISR (Incremental Static Regeneration) se necessário
4. Considerar usar `generateStaticParams` para pre-renderizar rotas populares
