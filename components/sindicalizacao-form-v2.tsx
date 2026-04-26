'use client'

import { useState, FormEvent } from 'react'
import SignaturePad from '@/components/signature-pad'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const formatTelefone = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 15)
}

const formatCPF = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .substring(0, 14)
}

interface SindicalizacaoFormV2Props {
  siteId: string
}

export default function SindicalizacaoFormV2({ siteId }: SindicalizacaoFormV2Props) {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpf: '',
    email: '',
    celular: '',
    dataNascimento: '',
    empresaVeiculo: '',
    cargoFuncao: '',
  })
  const [signature, setSignature] = useState<string | null>(null)
  const [declaracaoLida, setDeclaracaoLida] = useState(false)
  const [ctpsFile, setCtpsFile] = useState<File | null>(null)
  const [contrachequeFile, setContrachequeFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function uploadMedia(file: File): Promise<number> {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('_payload', JSON.stringify({ alt: file.name }))
    const resp = await fetch(`${API_URL}/api/media`, { method: 'POST', body: fd })
    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}))
      throw new Error(errorData.errors?.[0]?.message || 'Erro ao enviar arquivo')
    }
    const data = await resp.json()
    return data.doc?.id ?? data.id
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'celular') {
      setFormData({ ...formData, [name]: formatTelefone(value) })
    } else if (name === 'cpf') {
      setFormData({ ...formData, [name]: formatCPF(value) })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!signature) {
      setError('Por favor, assine o formulário antes de enviar.')
      return
    }
    if (!contrachequeFile) {
      setError('O envio do contracheque é obrigatório.')
      return
    }
    if (!declaracaoLida) {
      setError('Você precisa aceitar os termos para se sindicalizar.')
      return
    }

    setIsSubmitting(true)

    try {
      // Upload obrigatório do contracheque
      const contrachequeId = await uploadMedia(contrachequeFile)

      // Upload opcional da CTPS
      let ctpsDigitalId: number | null = null
      if (ctpsFile) {
        ctpsDigitalId = await uploadMedia(ctpsFile)
      }

      const response = await fetch(`${API_URL}/api/sindicalize-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          assinaturaDigital: signature,
          declaracaoLida: true,
          contracheque: contrachequeId,
          ...(ctpsDigitalId ? { ctpsDigital: ctpsDigitalId } : {}),
          site: Number(siteId),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.errors?.[0]?.message || 'Erro ao enviar solicitação')
      }

      setSuccess(true)
      setFormData({
        nomeCompleto: '',
        cpf: '',
        email: '',
        celular: '',
        dataNascimento: '',
        empresaVeiculo: '',
        cargoFuncao: '',
      })
      setSignature(null)
      setDeclaracaoLida(false)
      setCtpsFile(null)
      setContrachequeFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar solicitação')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="border border-green-200 bg-green-50 p-6">
        <h3 className="text-base font-bold text-green-800 mb-2">Solicitação enviada!</h3>
        <p className="text-sm text-green-700 mb-4">Recebemos sua solicitação de sindicalização. Em breve entraremos em contato.</p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-brand-600 text-white text-xs font-semibold px-4 py-2 uppercase hover:bg-brand-700 transition"
        >
          Fazer nova solicitação
        </button>
      </div>
    )
  }

  const inputClass = 'w-full h-10 bg-[#f2f2f2] border border-gray-200 px-3 text-sm text-gray-700 outline-none focus:border-brand-600 transition'
  const labelClass = 'block text-xs font-semibold uppercase text-gray-600 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nomeCompleto" className={labelClass}>Nome completo *</label>
        <input type="text" id="nomeCompleto" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} required className={inputClass} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cpf" className={labelClass}>CPF *</label>
          <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required placeholder="000.000.000-00" className={inputClass} />
        </div>
        <div>
          <label htmlFor="dataNascimento" className={labelClass}>Data de nascimento *</label>
          <input type="date" id="dataNascimento" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>E-mail *</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="celular" className={labelClass}>Celular *</label>
          <input type="tel" id="celular" name="celular" value={formData.celular} onChange={handleChange} required placeholder="(00) 00000-0000" className={inputClass} />
        </div>
        <div>
          <label htmlFor="empresaVeiculo" className={labelClass}>Empresa / Veículo *</label>
          <input type="text" id="empresaVeiculo" name="empresaVeiculo" value={formData.empresaVeiculo} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="cargoFuncao" className={labelClass}>Cargo / Função *</label>
          <input type="text" id="cargoFuncao" name="cargoFuncao" value={formData.cargoFuncao} onChange={handleChange} required className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ctpsDigital" className={labelClass}>CTPS Digital (opcional)</label>
          <input
            type="file"
            id="ctpsDigital"
            accept="application/pdf,image/*"
            onChange={(e) => setCtpsFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-gray-700 file:mr-3 file:px-3 file:py-2 file:border-0 file:bg-brand-600 file:text-white file:text-xs file:font-semibold file:uppercase file:cursor-pointer hover:file:bg-brand-700 border border-gray-200 bg-[#f2f2f2]"
          />
          <p className="mt-1 text-[11px] text-gray-500">PDF ou imagem. Envio opcional.</p>
        </div>
        <div>
          <label htmlFor="contracheque" className={labelClass}>Contracheque *</label>
          <input
            type="file"
            id="contracheque"
            accept="application/pdf,image/*"
            onChange={(e) => setContrachequeFile(e.target.files?.[0] ?? null)}
            required
            className="w-full text-sm text-gray-700 file:mr-3 file:px-3 file:py-2 file:border-0 file:bg-brand-600 file:text-white file:text-xs file:font-semibold file:uppercase file:cursor-pointer hover:file:bg-brand-700 border border-gray-200 bg-[#f2f2f2]"
          />
          <p className="mt-1 text-[11px] text-gray-500">PDF ou imagem. Envio obrigatório.</p>
        </div>
      </div>

      <div>
        <label className={labelClass}>Assinatura digital *</label>
        <div className="border border-gray-200 bg-[#f2f2f2]">
          <SignaturePad onSignatureChange={setSignature} />
        </div>
      </div>

      <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          checked={declaracaoLida}
          onChange={(e) => setDeclaracaoLida(e.target.checked)}
          required
          className="mt-1 accent-brand-600"
        />
        <span>
          Declaro que li e aceito os termos de sindicalização e autorizo o desconto em folha da contribuição sindical,
          conforme estatuto do sindicato.
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
        {isSubmitting ? 'Enviando...' : 'Enviar solicitação'}
      </button>
    </form>
  )
}
