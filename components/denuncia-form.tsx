'use client'

import { useState, FormEvent } from 'react'

const formatTelefone = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 15)
}

interface DenunciaFormProps {
  siteId: string
}

export default function DenunciaForm({ siteId }: DenunciaFormProps) {
  const [anonimo, setAnonimo] = useState(true)
  const [formData, setFormData] = useState({
    categoria: '',
    descricao: '',
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
  })
  const [anexo, setAnexo] = useState<File | null>(null)
  const [termosAceitos, setTermosAceitos] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [protocolo, setProtocolo] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'telefone') {
      setFormData({ ...formData, [name]: formatTelefone(value) })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!formData.categoria) {
      setError('Selecione uma categoria.')
      return
    }
    if (!formData.descricao.trim()) {
      setError('A descrição é obrigatória.')
      return
    }
    if (!termosAceitos) {
      setError('Você precisa confirmar que a denúncia é verídica.')
      return
    }

    setIsSubmitting(true)

    try {
      const fd = new FormData()
      fd.append('anonimo', String(anonimo))
      fd.append('categoria', formData.categoria)
      fd.append('descricao', formData.descricao)
      fd.append('site', String(siteId))

      if (!anonimo) {
        fd.append('nome', formData.nome)
        fd.append('email', formData.email)
        fd.append('telefone', formData.telefone)
      }
      if (formData.empresa) fd.append('empresa', formData.empresa)
      if (anexo) fd.append('anexo', anexo)

      const resp = await fetch('/api/denuncias/create', {
        method: 'POST',
        body: fd,
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err.error || 'Erro ao enviar denúncia')
      }

      const data = await resp.json()
      setProtocolo(data.protocolo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar denúncia')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (protocolo) {
    return (
      <div className="border-2 border-brand-600 bg-brand-50/30 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Denúncia registrada</h3>
        <p className="text-sm text-gray-700 mb-4">
          Sua denúncia foi recebida e está sob análise. Guarde o protocolo abaixo —
          você pode usá-lo para acompanhar o andamento na página{' '}
          <a href="/acompanhar-denuncia" className="text-brand-600 hover:underline font-medium">
            Acompanhar denúncia
          </a>.
        </p>
        <div className="bg-white border border-gray-200 p-4 mb-4">
          <span className="block text-xs font-semibold uppercase text-gray-500 mb-1">Protocolo</span>
          <span className="text-lg font-mono font-semibold text-brand-600">{protocolo}</span>
        </div>
        <button
          onClick={() => {
            setProtocolo(null)
            setFormData({ categoria: '', descricao: '', nome: '', email: '', telefone: '', empresa: '' })
            setAnexo(null)
            setTermosAceitos(false)
          }}
          className="bg-brand-600 text-white text-xs font-semibold px-4 py-2 uppercase hover:bg-brand-700 transition"
        >
          Fazer nova denúncia
        </button>
      </div>
    )
  }

  const inputClass = 'w-full h-10 bg-[#f2f2f2] border border-gray-200 px-3 text-sm text-gray-700 outline-none focus:border-brand-600 transition'
  const labelClass = 'block text-xs font-semibold uppercase text-gray-600 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Toggle anonimato */}
      <div className="border border-gray-200 p-3 bg-[#f2f2f2]">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAnonimo(true)}
            className={`flex-1 px-3 py-2 text-xs font-semibold uppercase transition ${
              anonimo
                ? 'bg-brand-600 text-white'
                : 'bg-white text-gray-600 hover:text-brand-600 border border-gray-200'
            }`}
          >
            Anônima
          </button>
          <button
            type="button"
            onClick={() => setAnonimo(false)}
            className={`flex-1 px-3 py-2 text-xs font-semibold uppercase transition ${
              !anonimo
                ? 'bg-brand-600 text-white'
                : 'bg-white text-gray-600 hover:text-brand-600 border border-gray-200'
            }`}
          >
            Identificada
          </button>
        </div>
        <p className="mt-2 text-[11px] text-gray-500 leading-relaxed">
          {anonimo
            ? 'Denúncia anônima: seus dados pessoais não serão coletados. Use o protocolo gerado para acompanhar.'
            : 'Denúncia identificada: seus dados serão usados apenas para contato referente a esta denúncia.'}
        </p>
      </div>

      {/* Dados pessoais (só se identificada) */}
      {!anonimo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nome" className={labelClass}>Nome completo *</label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required={!anonimo} className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>E-mail *</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required={!anonimo} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="telefone" className={labelClass}>Telefone</label>
            <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(00) 00000-0000" className={inputClass} />
          </div>
        </div>
      )}

      {/* Categoria */}
      <div>
        <label htmlFor="categoria" className={labelClass}>Tipo de denúncia *</label>
        <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} required className={inputClass}>
          <option value="">Selecione...</option>
          <option value="assedio-moral">Assédio moral</option>
          <option value="assedio-sexual">Assédio sexual</option>
          <option value="discriminacao">Discriminação</option>
          <option value="irregularidade-trabalhista">Irregularidade trabalhista</option>
          <option value="outra">Outra</option>
        </select>
      </div>

      {/* Empresa/Veículo */}
      <div>
        <label htmlFor="empresa" className={labelClass}>Empresa / Veículo (se aplicável)</label>
        <input type="text" id="empresa" name="empresa" value={formData.empresa} onChange={handleChange} className={inputClass} />
      </div>

      {/* Descrição */}
      <div>
        <label htmlFor="descricao" className={labelClass}>Descreva o ocorrido *</label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          required
          rows={6}
          placeholder="Inclua o máximo de detalhes: datas, locais, pessoas envolvidas, testemunhas, etc."
          className="w-full bg-[#f2f2f2] border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-brand-600 transition resize-none"
        />
      </div>

      {/* Anexo */}
      <div>
        <label htmlFor="anexo" className={labelClass}>Anexo (opcional)</label>
        <input
          type="file"
          id="anexo"
          accept="application/pdf,image/*"
          onChange={(e) => setAnexo(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-gray-700 file:mr-3 file:px-3 file:py-2 file:border-0 file:bg-brand-600 file:text-white file:text-xs file:font-semibold file:uppercase file:cursor-pointer hover:file:bg-brand-700 border border-gray-200 bg-[#f2f2f2]"
        />
        <p className="mt-1 text-[11px] text-gray-500">Documentos ou imagens que comprovem a denúncia. PDF ou imagem, até 10MB.</p>
      </div>

      {/* Termos */}
      <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={termosAceitos}
          onChange={(e) => setTermosAceitos(e.target.checked)}
          required
          className="mt-1 accent-brand-600"
        />
        <span>
          Declaro que as informações prestadas são verdadeiras e estou ciente de que denúncias falsas
          podem configurar crime previsto em lei.
        </span>
      </label>

      {error && (
        <div className="border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-brand-600 text-white text-sm font-semibold uppercase px-6 py-3 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar denúncia'}
      </button>
    </form>
  )
}
