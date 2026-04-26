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

interface ContactFormV2Props {
  siteId: string
}

export default function ContactFormV2({ siteId }: ContactFormV2Props) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'telefone') {
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
      const response = await fetch(`${API_URL}/api/contact-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, site: Number(siteId) }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.errors?.[0]?.message || 'Erro ao enviar mensagem')
      }
      setSuccess(true)
      setFormData({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="border border-green-200 bg-green-50 p-6">
        <h3 className="text-base font-bold text-green-800 mb-2">Mensagem enviada!</h3>
        <p className="text-sm text-green-700 mb-4">Recebemos sua mensagem e entraremos em contato em breve.</p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-brand-600 text-white text-xs font-semibold px-4 py-2 uppercase hover:bg-brand-700 transition"
        >
          Enviar nova mensagem
        </button>
      </div>
    )
  }

  const inputClass = 'w-full h-10 bg-[#f2f2f2] border border-gray-200 px-3 text-sm text-gray-700 outline-none focus:border-brand-600 transition'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nome" className="block text-xs font-semibold uppercase text-gray-600 mb-1">Nome *</label>
          <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase text-gray-600 mb-1">E-mail *</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="telefone" className="block text-xs font-semibold uppercase text-gray-600 mb-1">Telefone *</label>
          <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required placeholder="(00) 00000-0000" className={inputClass} />
        </div>
        <div>
          <label htmlFor="assunto" className="block text-xs font-semibold uppercase text-gray-600 mb-1">Assunto *</label>
          <input type="text" id="assunto" name="assunto" value={formData.assunto} onChange={handleChange} required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="mensagem" className="block text-xs font-semibold uppercase text-gray-600 mb-1">Mensagem *</label>
        <textarea
          id="mensagem"
          name="mensagem"
          value={formData.mensagem}
          onChange={handleChange}
          required
          rows={6}
          className="w-full bg-[#f2f2f2] border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-brand-600 transition resize-none"
        />
      </div>

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
        {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
      </button>
    </form>
  )
}
