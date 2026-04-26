'use client'

import { useState, FormEvent } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const formatTelefone = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 15)
}

interface NewsletterFormV2Props {
  siteId: string
}

export default function NewsletterFormV2({ siteId }: NewsletterFormV2Props) {
  const [formData, setFormData] = useState({ nomeCompleto: '', email: '', celular: '' })
  const [accepted, setAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'celular') {
      setFormData({ ...formData, [name]: formatTelefone(value) })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/newsletter-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          newsletterAccepted: accepted,
          site: Number(siteId),
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.errors?.[0]?.message || 'Erro ao realizar inscrição')
      }
      setSuccess(true)
      setFormData({ nomeCompleto: '', email: '', celular: '' })
      setAccepted(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao realizar inscrição')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="border border-green-200 bg-green-50 p-6">
        <h3 className="text-base font-bold text-green-800 mb-2">Inscrição realizada!</h3>
        <p className="text-sm text-green-700 mb-4">Você receberá nossos próximos boletins no seu e-mail.</p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-brand-600 text-white text-xs font-semibold px-4 py-2 uppercase hover:bg-brand-700 transition"
        >
          Fazer nova inscrição
        </button>
      </div>
    )
  }

  const inputClass = 'w-full h-10 bg-[#f2f2f2] border border-gray-200 px-3 text-sm text-gray-700 outline-none focus:border-brand-600 transition'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nomeCompleto" className="block text-xs font-semibold uppercase text-gray-600 mb-1">Nome completo *</label>
        <input type="text" id="nomeCompleto" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} required className={inputClass} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase text-gray-600 mb-1">E-mail *</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="celular" className="block text-xs font-semibold uppercase text-gray-600 mb-1">Celular</label>
          <input type="tel" id="celular" name="celular" value={formData.celular} onChange={handleChange} placeholder="(00) 00000-0000" className={inputClass} />
        </div>
      </div>

      <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          required
          className="mt-1 accent-brand-600"
        />
        <span>Aceito receber comunicações do sindicato por e-mail e outros canais digitais.</span>
      </label>

      {error && (
        <div className="border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !accepted}
        className="bg-brand-600 text-white text-sm font-semibold uppercase px-6 py-3 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isSubmitting ? 'Enviando...' : 'Assinar newsletter'}
      </button>
    </form>
  )
}
